using Microsoft.EntityFrameworkCore;
using PokeR.Core.Entities;

namespace PokeR.Services
{
    public class RoomContext : DbContext
    {
        public RoomContext(DbContextOptions<RoomContext> options)
        : base(options)
        { }


        public DbSet<Deck> Decks { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Emblem> Emblems { get; set; }
    }
}
