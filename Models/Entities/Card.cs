using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PokeR.Models.Entities
{
    public class Card
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int Order { get; set; }
        public string Image { get; set; }
        public int DeckId { get; set; }

        public Deck Deck { get; set; }
        public virtual ICollection<User> Users { get; set; }
    }
}
