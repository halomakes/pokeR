using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Core.ViewModels
{
    public class CreateRoomRequest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string TagLine { get; set; }
        public int DeckId { get; set; }
    }
}
