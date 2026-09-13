using System.IO.Ports;
using System.Text.Json;
using Backend.Models;
using Microsoft.AspNetCore.SignalR;

// fica lendo a serial do arduino em segundo plano
public class SerialBackgroundService : BackgroundService
{
    private readonly ArduinoConnection _connect;
    private readonly IHubContext<EmergencyHub> _hubContext;
    private readonly AddressGeocoder _geocoder;

    public SerialBackgroundService(
        ArduinoConnection connect,
        IHubContext<EmergencyHub> hubContext,
        AddressGeocoder geocoder)
    {
        _connect = connect;
        _hubContext = hubContext;
        _geocoder = geocoder;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _connect.Connection();
        SerialPort sp = _connect.GetPort();

        return Task.Run(async () =>
        {
            while (sp.IsOpen && !stoppingToken.IsCancellationRequested)
            {
                try
                {
                    string message = sp.ReadLine();

                    var data = JsonSerializer.Deserialize<EmergencyEvents>(
                        message,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                    if (data == null) continue;

                    // se não veio gps, pega pelo endereço
                    if (data.Latitude == null && data.Address != "")
                    {
                        var geo = await _geocoder.GeocodeAsync(data.Address, stoppingToken);
                        if (geo != null)
                        {
                            data.Latitude = geo.Value.Lat;
                            data.Longitude = geo.Value.Lng;
                        }
                    }

                    Console.WriteLine($"Evento: {data.Event}");
                    Console.WriteLine($"Nome: {data.Name}");
                    Console.WriteLine($"Endereço: {data.Address}");
                    Console.WriteLine($"GPS: {data.Latitude}, {data.Longitude}");

                    // manda pro front pelo websocket
                    await _hubContext.Clients.All.SendAsync("ReceiveEvent", data, stoppingToken);
                }
                catch (TimeoutException)
                {
                    // continua esperando a próxima mensagem
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao ler porta: {ex.Message}");
                }
            }
        }, stoppingToken);
    }
}
