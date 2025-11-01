using Microsoft.AspNetCore.SignalR;

namespace PlacementCellApi.Hubs
{
    public class SignalingHub : Hub
    {
        // When a client sends a signaling message, relay it to the target user
        public async Task SendSignal(string targetConnectionId, string message)
        {
            await Clients.Client(targetConnectionId).SendAsync("ReceiveSignal", Context.ConnectionId, message);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("ConnectionEstablished", Context.ConnectionId);
            await base.OnConnectedAsync();
        }
    }
}
