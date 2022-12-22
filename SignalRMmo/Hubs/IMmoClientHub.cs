using SignalRMmo.Model;
namespace SignalRMmo.Hubs;
public interface IMmoClientHub
{
    Task GameUpdate(IEnumerable<Player> players);
    Task PlayerCreated(string playerId);
}