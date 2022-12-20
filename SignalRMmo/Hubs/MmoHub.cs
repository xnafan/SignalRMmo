using Microsoft.AspNetCore.SignalR;
using System.Drawing;
namespace SignalRMmo.Hubs;
public class MmoHub : Hub
{
    Broadcaster _broadcaster;
    public MmoHub(Broadcaster broadcaster) => _broadcaster = broadcaster;
    public async void Join(string playerName)
    {
        var player = _broadcaster.Join(playerName);
        await Clients.Caller.SendAsync("playerCreated", player.Id);
    }

    public void Move(string playerId, Point relativeMotion)  => _broadcaster.Move(playerId, relativeMotion);
}

public static class PointExtensions
{
    public static Point Add(this Point thisPoint, Point otherPoint)
    {
        return new Point(thisPoint.X + otherPoint.X, thisPoint.Y + otherPoint.Y);
    }
}