namespace SignalRMmo.Model;
public interface IPlayerContainer
{
    Player CreatePlayer(string playerName,int mapWidth= 800, int mapHeight = 600);
    Player? GetPlayer(string playerId);
    bool RemovePlayer(string playerId);
    void Clear();
    IEnumerable<Player> GetPlayers();
}