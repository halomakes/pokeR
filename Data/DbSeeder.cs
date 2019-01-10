using PokeR.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Data
{
    public class DbSeeder
    {
        private RoomContext db;

        public DbSeeder(RoomContext db)
        {
            this.db = db;
        }

        public async Task Seed()
        {

        }
    }
}
