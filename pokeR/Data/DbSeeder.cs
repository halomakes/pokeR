using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using PokeR.Core.Entities;
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
            await SeedDecks();
            await SeedEmblems();
        }


        public async Task SeedEmblems()
        {
            try
            {
                var emblems = await GetFile<List<Emblem>>("defaultEmblems.json");
                db.Emblems.AddRange(emblems);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.Write("Could not seed emblems to database");
                Console.Write(ex.ToString());
            }
        }

        public async Task SeedDecks()
        {
            try
            {
                var decks = await GetFile<List<Deck>>("defaultDecks.json");
                db.Decks.AddRange(decks);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.Write("Could not seed decks to database");
                Console.Write(ex.ToString());
            }
        }

        private async Task<T> GetFile<T>(string fileName)
        {
            var path = $"{environment.ContentRootPath}/{fileName}";
            var json = await System.IO.File.ReadAllTextAsync(path);

            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
