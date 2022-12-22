using Microsoft.AspNetCore.Mvc;
namespace SignalRMmo.Controllers;
public class HomeController : Controller
{
    private readonly Broadcaster _broadcaster;

    public HomeController(Broadcaster broadcaster) => _broadcaster = broadcaster;

    public IActionResult Index() => View();

    public IActionResult Restart()
    {
        _broadcaster.PlayerContainer.Clear();
        return RedirectToAction(nameof(Index));
    }
}