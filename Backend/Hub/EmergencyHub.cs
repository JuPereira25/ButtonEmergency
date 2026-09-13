using Microsoft.AspNetCore.SignalR;

// websocket pra falar com o front
public class EmergencyHub : Hub
{
    // avisa todo mundo que a ambulância foi enviada
    public Task MarkResolved() => Clients.All.SendAsync("Resolved");
}
