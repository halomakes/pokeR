# PokeR
Realtime planning poker with [SignalR](https://github.com/SignalR/SignalR).

PokeR uses Entity Framework Core in-memory.  If you need persistence for some reason, you can swap this out for SQLite or another provider.  Data is seeded on startup from the json files in the project's root directory. You can also edit options via the exposed REST API.  Documentation for the API can be viewed in the Swagger UI at /swagger.

## Quickstart
```powershell
docker run --name poker -d -p 80:80 halomademeapc/poker
```

## Requirements
**To build**
* .NET Core 2.2 SDK
* Node.js

**To run**
* .NET Core 2.2 Runtime

## Building
```powershell
dotnet publish ./PokeR.csproj
```

## Running
```powershell
dotnet ./PokeR.csproj
```