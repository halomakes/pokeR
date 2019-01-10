using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Models.ViewModels
{
    public class JoinGroupRequest
    {
        public string RoomId { get; set; }
        public string Name { get; set; }
        public int CardId { get; set; }
    }
}
