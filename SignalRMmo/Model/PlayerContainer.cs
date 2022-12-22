﻿namespace SignalRMmo.Model;
public class PlayerContainer : IPlayerContainer
{
    #region Properties
    private static readonly Random _random = new Random();
    private List<Player> _players = new List<Player>();
    #endregion

    #region Methods
    public Player CreatePlayer(string playerName, int mapWidth=800, int mapHeight=600)
    {
        var player = new Player() { Name = playerName, Position = new System.Drawing.Point(_random.Next(mapWidth/4*3)+ mapWidth / 4, _random.Next(mapHeight / 4*3) + mapHeight / 4) };
        _players.Add(player);
        return player;
    }
    public Player? GetPlayer(string playerId) => _players.FirstOrDefault(player => player.Id == playerId);
    public bool RemovePlayer(string playerId) => _players.RemoveAll(player => player.Id == playerId) > 0;
    public void Clear() => _players.Clear();
    public IEnumerable<Player> GetPlayers()
    {
        foreach (var player in _players)
        {
            yield return player;
        }
    }
    #endregion
}