namespace SignalRMmo.Model;
public class PlayerContainer : IPlayerContainer
{
    #region Properties
    private static readonly Random _random = new Random();
    private List<Player> _players = new List<Player>();
    #endregion

    #region Methods
    public Player CreatePlayer(string playerName)
    {
        var player = new Player() { Name = playerName, Position = new System.Drawing.Point(_random.Next(600), _random.Next(400)) };
        _players.Add(player);
        return player;
    }
    public Player? GetPlayer(string playerId) => _players.FirstOrDefault(player => player.Id == playerId);
    public bool RemovePlayer(string playerId) => _players.RemoveAll(player => player.Id == playerId) > 0;
    public IEnumerable<Player> GetPlayers()
    {
        foreach (var player in _players)
        {
            yield return player;
        }
    } 
    #endregion
}