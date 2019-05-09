using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PokeR.Core
{
    public class RestClient
    {
        private readonly HttpClient client;
        private readonly JsonSerializerSettings serializerSettings = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        };

        public RestClient(Uri baseUrl)
        {
            client = new HttpClient
            {
                BaseAddress = baseUrl
            };
        }

        public RestClient(string baseUrl)
        {
            client = new HttpClient
            {
                BaseAddress = new Uri(baseUrl)
            };
        }

        public async Task<T> GetAsync<T>(string url) => await HandleResponse<T>(await client.GetAsync(url));

        public async Task<string> GetAsync(string url) => await HandleResponse(await client.GetAsync(url));

        public async Task<T> PostAsync<T>(string url, T body) => await HandleResponse<T>(await client.PostAsync(url, MakeBody(body)));

        public async Task<T> PostAsync<S, T>(string url, S body) => await HandleResponse<T>(await client.PostAsync(url, MakeBody(body)));

        public async Task<T> PutAsync<T>(string url, T body) => await HandleResponse<T>(await client.PutAsync(url, MakeBody(body)));

        public async Task<string> DeleteAsync(string url) => await HandleResponse(await client.DeleteAsync(url));

        private async Task<T> HandleResponse<T>(HttpResponseMessage message)
        {
            message.EnsureSuccessStatusCode();
            return JsonConvert.DeserializeObject<T>(await message.Content.ReadAsStringAsync());
        }

        private async Task<string> HandleResponse(HttpResponseMessage message)
        {
            message.EnsureSuccessStatusCode();
            return await message.Content.ReadAsStringAsync();
        }

        private StringContent MakeBody<T>(T payload) =>
            new StringContent(JsonConvert.SerializeObject(payload, serializerSettings), Encoding.UTF8, "application/json");
    }
}
