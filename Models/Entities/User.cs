using System.ComponentModel.DataAnnotations;

namespace PokeR.Models.Entities
{
    public class User
    {
        [Key]
        public string ConnectionId { get; set; }
        [Required]
        public string RoomId { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public bool IsHost { get; set; }

        public virtual Room Room { get; set; }
    }
}