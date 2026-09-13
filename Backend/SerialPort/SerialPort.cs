using System.IO.Ports;

public class ArduinoConnection
{
    private SerialPort sp = new SerialPort("COM3", 115200);

    public void Connection()
    {
        try
        {
            sp.ReadTimeout = 1000;
            sp.Open();

            Console.WriteLine($"Conectado na porta {sp.PortName}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao conectar: {ex.Message}");
        }
    }

    public SerialPort GetPort()
    {
        return sp;
    }
}