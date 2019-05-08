using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PokeR.Core.Entities
{
    public class Room
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string TagLine { get; set; }
        [Required]
        public DateTime TimeCreated { get; set; }
        public int DeckId { get; set; }

        public virtual ICollection<User> Users { get; set; }
        public virtual Deck Deck { get; set; }
    }
}
