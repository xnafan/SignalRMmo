using Microsoft.AspNetCore.SignalR;
using SignalRMmo.Hubs;
using SignalRMmo.Model;
using System.Drawing;
namespace SignalRMmo;
public class Broadcaster
{
    #region properties
    private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(25);
    private readonly IHubContext<MmoHub> _hubContext;
    private Timer _broadcastLoop;
    private bool _dataUpdated = false;
    public IPlayerContainer PlayerContainer { get; set; } = new PlayerContainer();
    #endregion

    public Broadcaster(IHubContext<MmoHub> hubContext)
    {
        _hubContext = hubContext;
        _broadcastLoop = new Timer(BroadCastMovement,null,BroadcastInterval,BroadcastInterval);
    }

    public Player Join(string playerName)
    {
        _dataUpdated = true;
        return PlayerContainer.CreatePlayer(playerName);
    }
    public void Move(string playerId, Point relativeMotion)
    {
        var player = PlayerContainer.GetPlayer(playerId);
        if (player != null)
        {
            player.Position = player.Position.Add(relativeMotion);
            _dataUpdated = true; 
        }
    }

    private async void BroadCastMovement(object? state)
    {
        if (_dataUpdated)
        {
            await _hubContext.Clients.All.SendAsync("gameUpdate", PlayerContainer.GetPlayers());
            _dataUpdated = false; 
        }
    }
}