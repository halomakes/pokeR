FROM armutcom/aspnet-core:spa-latest AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_ENVIRONMENT=Production

FROM armutcom/aspnet-core:2.2.3-sdk-2.2.105-node-8.11.2-build-bionic AS build
WORKDIR /src
COPY ["pokeR/PokeR.csproj", "pokeR/"]
RUN dotnet restore "pokeR/PokeR.csproj"
COPY . .
WORKDIR "/src/pokeR"
RUN dotnet build "PokeR.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "PokeR.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "PokeR.dll"]