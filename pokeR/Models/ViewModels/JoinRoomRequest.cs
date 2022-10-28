using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Models.ViewModels
{
    public class JoinRoomRequest
    {
        public string RoomId { get; set; }
        public string Name { get; set; }
        public int EmblemId { get; set; }
        /// <summary>
        /// Player ID used when rejoining
        /// </summary>
        public Guid? PlayerId { get; set; }

        public bool IsRejoin => PlayerId is not null && PlayerId != Guid.Empty;
    }
}
