using System.Collections.Generic;
using System.Threading.Tasks;
using PokeR.Core.Entities;
using PokeR.Core.ViewModels;

namespace PokeR.UWP.Services
{
    public interface IPokerApiClient
    {
        Task<bool> CheckAvailability(string roomId);
        Task CreateRoom(CreateRoomRequest request);
        Task<List<Deck>> GetDecks();
        Task<List<Emblem>> GetEmblems();
        Task<Room> GetRoom(string roomId);
    }
}