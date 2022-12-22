using SignalRMmo;
using SignalRMmo.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<Broadcaster, Broadcaster>();
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();
var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapHub<MmoHub>("/mmo");
app.Run();
