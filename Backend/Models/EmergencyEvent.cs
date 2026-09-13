namespace Backend.Models;

public class EmergencyEvents
{
    public string Event { get; set; } = "";
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
