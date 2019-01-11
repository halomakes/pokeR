using Microsoft.EntityFrameworkCore;
using PokeR.Models.Entities;

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
        public DbSet<PokeR.Models.Entities.Card> Card { get; set; }
    }
}
