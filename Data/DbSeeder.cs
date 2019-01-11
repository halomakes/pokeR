using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PokeR.Models.Entities;
using PokeR.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PokeR.Data
{
    public class DbSeeder
    {
        private RoomContext db;
        private readonly IHostingEnvironment environment;

        public DbSeeder(RoomContext db, IHostingEnvironment environment)
        {
            this.db = db;
            this.environment = environment;
        }

        public async Task Seed()
        {
            try
            {
                var path = $"{environment.ContentRootPath}/defaultDecks.json";
                var json = await System.IO.File.ReadAllTextAsync(path);

                var decks = JsonConvert.DeserializeObject<List<Deck>>(json);

                db.Decks.AddRange(decks);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.Write("Could not seed database");
                Console.Write(ex.ToString());
            }
        }
    }
}
