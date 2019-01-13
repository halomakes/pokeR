using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace PokeR.Models.Entities
{
    public class User
    {
        [Key, JsonIgnore]
        public string ConnectionId { get; set; }
        public Guid Id { get; set; }
        [Required]
        public string RoomId { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public bool IsHost { get; set; }

        public virtual Room Room { get; set; }
    }
}