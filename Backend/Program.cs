var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddHttpClient("nominatim", client =>
{
    client.BaseAddress = new Uri("https://nominatim.openstreetmap.org/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("EmergencySystem/1.0");
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.Services.AddSingleton<ArduinoConnection>();
builder.Services.AddSingleton<AddressGeocoder>();
builder.Services.AddHostedService<SerialBackgroundService>();

var app = builder.Build();

app.UseCors("Frontend");
app.MapHub<EmergencyHub>("/emergencyHub");
app.Run();
