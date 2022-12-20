namespace SignalRMmo.Model;
public interface IPlayerContainer
{
    Player CreatePlayer(string playerName);
    Player? GetPlayer(string playerId);
    bool RemovePlayer(string playerId);

    IEnumerable<Player> GetPlayers();
}