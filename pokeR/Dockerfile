FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_ENVIRONMENT=Production

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash \
    && apt-get install nodejs -yq
WORKDIR /src
COPY ["pokeR/PokeR.csproj", "pokeR/"]
RUN dotnet restore "pokeR/PokeR.csproj"
COPY . .
WORKDIR "/src/pokeR/ClientApp"
RUN npm install
RUN npm install -g @angular/cli
RUN npm rebuild node-sass
WORKDIR "/src/pokeR"
RUN dotnet build "PokeR.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PokeR.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PokeR.dll"]