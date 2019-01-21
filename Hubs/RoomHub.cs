using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PokeR.Models.Entities;
using PokeR.Models.ViewModels;
using PokeR.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Hubs
{
    public class RoomHub : Hub
    {
        private RoomContext db;

        public RoomHub(RoomContext db)
        {
            this.db = db;
        }

        public async Task JoinRoom(JoinRoomRequest request)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);
            var user = new User
            {
                ConnectionId = Context.ConnectionId,
                DisplayName = request.Name,
                RoomId = request.RoomId,
                EmblemId = request.EmblemId,
                Id = Guid.NewGuid(),
                IsHost = !await db.Users.AnyAsync(u => u.RoomId == request.RoomId)
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
            await Clients.Caller.SendAsync("Self", user);
            await Clients.Group(request.RoomId).SendAsync("UserJoined", new ListChange<User>(user, await GetRoomUsers(request.RoomId)));
        }

        public async Task LeaveRoom()
        {
            var userQuery = db.Users.Where(u => u.ConnectionId == Context.ConnectionId);
            var user = await userQuery.FirstOrDefaultAsync();
            var roomId = user?.RoomId;
            if (roomId != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
                db.Users.Remove(user);
                await db.SaveChangesAsync();

                if (user.IsHost || !(await db.Users.Where(u => u.RoomId == roomId).AnyAsync()))
                    await CloseRoom(roomId);
                else
                    await Clients.Group(roomId).SendAsync("UserLeft", new ListChange<User>(user, await GetRoomUsers(roomId)));

                await AssertGameEnd(user);
            }
        }

        public async Task PlayCard(int cardId)
        {
            var user = await GetUser();
            user.CurrentCardId = cardId;
            await db.SaveChangesAsync();

            await Clients.Group(user.RoomId).SendAsync("CardPlayed", new ListChange<User>(user, await GetRoomUsers(user.RoomId)));
            await AssertGameEnd(user);
        }

        public async Task StartRound()
        {
            var roomId = await GetRoomId();
            var users = await GetRoomUsers(roomId);
            users.ForEach(u => u.CurrentCardId = null);
            await db.SaveChangesAsync();

            await Clients.Group(roomId).SendAsync("RoundStarted");
        }

        public async Task UpdateTagline(string newTagline) => await Clients.Group(await GetRoomId()).SendAsync("TaglineUpdated", newTagline);

        public async Task StoreTagline(string newTagline)
        {
            var room = await db.Users.Where(u => u.ConnectionId == Context.ConnectionId).Select(u => u.Room).FirstOrDefaultAsync();
            if (room != null)
            {
                room.TagLine = newTagline;
                await db.SaveChangesAsync();
            }
        }

        public async Task StartTimer(int milliseconds)
        {
            var roomId = await GetRoomId();
            await Clients.Group(roomId).SendAsync("TimerStarted", milliseconds);
        }

        public async Task EndRound() => await EndRoundForRoom(await GetRoomId());

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await LeaveRoom();
            await base.OnDisconnectedAsync(exception);
        }

        private async Task AssertGameEnd(User user)
        {
            if (!(await RoundIsPendingVote(user)))
                await EndRoundForRoom(user.RoomId);
        }

        private async Task CloseRoom(string roomId)
        {
            var activeUserIds = await db.Users.Where(u => u.RoomId == roomId).Select(u => u.ConnectionId).ToListAsync();
            await Clients.Group(roomId).SendAsync("RoomClosed");
            foreach (var id in activeUserIds)
            {
                await Groups.RemoveFromGroupAsync(id, roomId);
            }
            db.Users.RemoveRange(db.Users.Where(u => u.RoomId == roomId));
            db.Rooms.RemoveRange(db.Rooms.Where(r => r.Id == roomId));
            await db.SaveChangesAsync();
        }

        private async Task EndRoundForRoom(string roomId) => await Clients.Group(roomId).SendAsync("RoundEnded");

        private async Task<bool> RoundIsPendingVote(User user) => await db.Users.AnyAsync(u => u.RoomId == user.RoomId && u.CurrentCardId == null);

        private async Task<List<User>> GetRoomUsers(string roomId) => await db.Users
            .Include(u => u.CurrentCard)
            .Where(u => u.RoomId == roomId).ToListAsync();

        private async Task<string> GetRoomId() => await db.Users
            .Where(u => u.ConnectionId == Context.ConnectionId)
            .Select(u => u.RoomId)
            .FirstOrDefaultAsync();

        private async Task<User> GetUser() => await db.Users
            .FirstOrDefaultAsync(u => u.ConnectionId == Context.ConnectionId);
    }
}
