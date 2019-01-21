FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["PokeR/PokeR.csproj", "PokeR/"]
RUN dotnet restore "PokeR/PokeR.csproj"
COPY . .
WORKDIR "/src/PokeR"
RUN dotnet build "PokeR.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "PokeR.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "PokeR.dll"]