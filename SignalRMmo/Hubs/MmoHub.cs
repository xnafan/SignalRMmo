using Microsoft.AspNetCore.SignalR;
using SignalRMmo.Model;
using System.Drawing;
namespace SignalRMmo.Hubs;

/// <summary>
/// This class is a SignalR hub which allows for clients to 
/// - join a game, with the desired player name
/// - subscribe to events, which sets up the client for receiving game updates
/// - send their desired moves
/// - restart the game
/// </summary>
public class MmoHub : Hub<IMmoClientHub>
{
    Broadcaster _broadcaster;
    public MmoHub(Broadcaster broadcaster) => _broadcaster = broadcaster;
    public async void Join(string playerName)
    {
        var player = _broadcaster.Join(playerName);
        await Clients.Caller.PlayerCreated(player.Id);
    }

    public async Task Subscribe(){
        await _broadcaster.BroadCastState();
    }
    public void Move(string playerId, Point relativeMotion) => _broadcaster.Move(playerId, relativeMotion);

    public void ClearAllplayers() => _broadcaster.PlayerContainer.Clear();
}