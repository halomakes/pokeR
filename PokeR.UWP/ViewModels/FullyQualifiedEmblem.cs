using PokeR.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokeR.UWP.ViewModels
{
    public class FullyQualifiedEmblem : Emblem
    {
        public FullyQualifiedEmblem(Emblem e)
        {
            Id = e.Id;
            ImageUrl = e.ImageUrl;
            Users = e.Users;
        }

        public FullyQualifiedEmblem(Emblem e, string url)
        {
            Id = e.Id;
            ImageUrl = e.ImageUrl;
            Users = e.Users;
            FullUrl = url;
        }

        public string FullUrl { get; set; }
    }
}
