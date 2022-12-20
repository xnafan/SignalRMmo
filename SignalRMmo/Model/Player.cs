using Newtonsoft.Json;
using System.Drawing;
namespace SignalRMmo.Model;
public class Player
{
    [JsonProperty("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonProperty("position")]
    public Point Position { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; } = string.Empty;
}