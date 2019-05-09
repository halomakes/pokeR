using Autofac;
using PokeR.Core.Entities;
using PokeR.Core.ViewModels;
using PokeR.UWP.Services;
using PokeR.UWP.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.ApplicationModel.Resources;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace PokeR.UWP
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class JoinRoom : Page
    {
        private JoinRoomRequest Request = new JoinRoomRequest();
        private IPokerApiClient apiClient;
        private string appUrl;

        private List<Emblem> emblems = new List<Emblem>();
        FullyQualifiedEmblem selectedEmblem { get; set; }
        IEnumerable<FullyQualifiedEmblem> emblemsWithUrls => emblems.Select(e => new FullyQualifiedEmblem(e, GetEmblemUrl(e)));

        public JoinRoom()
        {
            this.InitializeComponent();
            apiClient = App.Container.Resolve<IPokerApiClient>();
            var resourceLoader = ResourceLoader.GetForViewIndependentUse();
            appUrl = resourceLoader.GetString("AppUrl");
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            await LoadEmblemOptions();
        }

        private async Task LoadEmblemOptions()
        {
            emblems = await apiClient.GetEmblems();
            Bindings.Update();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (e.Parameter is string && !string.IsNullOrWhiteSpace((string)e.Parameter))
            {
                Request.RoomId = e.Parameter.ToString();
            }
            else
            {
                Frame.Navigate(typeof(MainPage));
            }
            base.OnNavigatedTo(e);
        }

        private string GetEmblemUrl(Emblem e) => $"{appUrl}{e.ImageUrl}";
    }
}
