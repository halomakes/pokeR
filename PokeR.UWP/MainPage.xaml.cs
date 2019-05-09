using Autofac;
using PokeR.Core.Entities;
using PokeR.Core.ViewModels;
using PokeR.UWP.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace PokeR.UWP
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private CreateRoomRequest Request = new CreateRoomRequest();
        private IPokerApiClient apiClient;

        private List<Deck> decks = new List<Deck>();
        Deck selectedDeck { get; set; }

        public MainPage()
        {
            this.InitializeComponent();
            apiClient = App.Container.Resolve<IPokerApiClient>();
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            await LoadDeckOptions();
        }

        private async Task LoadDeckOptions()
        {
            decks = await apiClient.GetDecks();
            Bindings.Update();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Console.Write("Submit clicked~");
        }

        private void DeckList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            Request.DeckId = selectedDeck?.Id ?? 0;
        }
    }
}
