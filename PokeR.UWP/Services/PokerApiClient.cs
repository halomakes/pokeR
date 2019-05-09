using PokeR.Core;
using PokeR.Core.Entities;
using PokeR.Core.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.ApplicationModel.Resources;

namespace PokeR.UWP.Services
{
    public class PokerApiClient : IPokerApiClient
    {
        private readonly RestClient client;
        public PokerApiClient()
        {
            var resourceLoader = ResourceLoader.GetForCurrentView();
            var appUrl = resourceLoader.GetString("AppUrl"); //figure that out later
            client = new RestClient(appUrl);
        }

        private List<Deck> deckCache;
        private List<Emblem> emblemCache;

        public async Task CreateRoom(CreateRoomRequest request) => await client.PostAsync("api/rooms", request);

        public async Task<List<Deck>> GetDecks()
        {
            if (deckCache != null && deckCache.Any())
                return deckCache;
            deckCache = await client.GetAsync<List<Deck>>("api/decks");
            return deckCache;
        }

        public async Task<List<Emblem>> GetEmblems()
        {
            if (emblemCache != null && emblemCache.Any())
                return emblemCache;
            emblemCache = await client.GetAsync<List<Emblem>>("api/emblems");
            return emblemCache;
        }

        public async Task<Room> GetRoom(string roomId) => await client.GetAsync<Room>($"api/rooms/{roomId}");

        public async Task<bool> CheckAvailability(string roomId) => await client.GetAsync($"api/rooms/available/{roomId}") == "true";
    }
}
