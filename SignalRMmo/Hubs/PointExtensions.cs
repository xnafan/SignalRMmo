using System.Drawing;
namespace SignalRMmo.Hubs;

public static class PointExtensions
{
    public static Point Add(this Point thisPoint, Point otherPoint)
    {
        return new Point(thisPoint.X + otherPoint.X, thisPoint.Y + otherPoint.Y);
    }
}