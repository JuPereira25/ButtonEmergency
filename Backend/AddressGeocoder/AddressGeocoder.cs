using System.Globalization;
using System.Net.Http.Json;

// pega o endereço e transforma em latitude/longitude
public class AddressGeocoder
{
    private readonly HttpClient _http;

    public AddressGeocoder(IHttpClientFactory factory)
    {
        _http = factory.CreateClient("nominatim");
    }

    public async Task<(double Lat, double Lng)?> GeocodeAsync(string address, CancellationToken cancel)
    {
        var query = Uri.EscapeDataString(address + ", Brasil");

        // busca no Nominatim (OpenStreetMap)
        var results = await _http.GetFromJsonAsync<List<NominatimResult>>(
            $"search?format=json&limit=1&countrycodes=br&q={query}",
            cancel
        );

        // se não achou nada, volta vazio
        if (results == null || results.Count == 0) return null;

        var lat = double.Parse(results[0].lat, CultureInfo.InvariantCulture);
        var lng = double.Parse(results[0].lon, CultureInfo.InvariantCulture);

        return (lat, lng);
    }

    private class NominatimResult
    {
        public string lat { get; set; } = "";
        public string lon { get; set; } = "";
    }
}
