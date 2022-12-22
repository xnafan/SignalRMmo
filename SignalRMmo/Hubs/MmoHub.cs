using Microsoft.AspNetCore.SignalR;
using System.Drawing;
namespace SignalRMmo.Hubs;
public class MmoHub : Hub<IMmoClientHub>
{
    Broadcaster _broadcaster;
    public MmoHub(Broadcaster broadcaster) => _broadcaster = broadcaster;
    public async void Join(string playerName)
    {
        var player = _broadcaster.Join(playerName);
        await Clients.Caller.PlayerCreated(player.Id);
    }

    public void Move(string playerId, Point relativeMotion) => _broadcaster.Move(playerId, relativeMotion);

    public void ClearAllplayers() => _broadcaster.PlayerContainer.Clear();
}