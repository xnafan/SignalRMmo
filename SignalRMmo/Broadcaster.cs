﻿using Microsoft.AspNetCore.SignalR;
using SignalRMmo.Hubs;
using SignalRMmo.Model;
using System.Drawing;
namespace SignalRMmo;
public class Broadcaster
{
    #region properties
    private readonly TimeSpan BroadcastInterval = TimeSpan.FromMilliseconds(25);
    private readonly IHubContext<MmoHub, IMmoClientHub> _hubContext;
    private Timer _broadcastLoop;
    private bool _dataUpdated = false;
    public IPlayerContainer PlayerContainer { get; set; } = new PlayerContainer();
    #endregion

    #region Constructor
    public Broadcaster(IHubContext<MmoHub, IMmoClientHub> hubContext)
    {
        _hubContext = hubContext;
        _broadcastLoop = new Timer(BroadCastMovement, null, BroadcastInterval, BroadcastInterval);
    } 
    #endregion

    #region Methods
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
            await BroadCastState();
            _dataUpdated = false;
        }
    } 

    public async Task BroadCastState()
    {
        await _hubContext.Clients.All.GameUpdate(PlayerContainer.GetPlayers());
    }
    #endregion
}