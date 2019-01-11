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

        public async Task JoinRoom(JoinGroupRequest request)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);
            var user = new User
            {
                ConnectionId = Context.ConnectionId,
                DisplayName = request.Name,
                RoomId = request.RoomId
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
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
            }
        }

        public async Task CloseRoom(string roomId)
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

        public async Task CreateRoom(Room room)
        {
            room.TimeCreated = DateTime.Now;
            db.Rooms.Add(room);
            await db.SaveChangesAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await LeaveRoom();
            await base.OnDisconnectedAsync(exception);
        }

        private async Task<List<User>> GetRoomUsers(string roomId) => await db.Users.Where(u => u.RoomId == roomId).ToListAsync();
    }
}
