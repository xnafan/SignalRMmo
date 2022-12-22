using SignalRMmo.Model;
namespace SignalRMmo.Hubs;
/// <summary>
/// This interface defines which methods are available 
/// on the client (javascript), and makes them accessible
/// in a strongly typed way
/// </summary>
public interface IMmoClientHub
{
    //sends all the current players to the client
    Task GameUpdate(IEnumerable<Player> players);

    //notifies a client that its player has been created
    //by sending the playerId of the newly created player
    Task PlayerCreated(string playerId);
}