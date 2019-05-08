using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Core.ViewModels
{
    public class JoinRoomRequest
    {
        public string RoomId { get; set; }
        public string Name { get; set; }
        public int EmblemId { get; set; }
    }
}
