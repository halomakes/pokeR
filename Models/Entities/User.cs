using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        [Required]
        public int EmblemId { get; set; }

        public int? CurrentCardId { get; set; }

        public virtual Room Room { get; set; }
        public virtual Emblem Emblem { get; set; }
        [ForeignKey("CurrentCardId")]
        public virtual Card CurrentCard { get; set; }
    }
}