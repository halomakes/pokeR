# PokeR
[![Build Status](https://travis-ci.org/halomademeapc/pokeR.png?branch=master)](https://travis-ci.org/halomademeapc/pokeR) [![Docker Pulls](https://img.shields.io/docker/pulls/halomademeapc/poker)](https://hub.docker.com/repository/docker/halomademeapc/poker)

Realtime planning poker with [SignalR](https://github.com/SignalR/SignalR).

*Check out [the demo](https://app.planning.rocks)!*

PokeR is a realtime planning poker app built with .NET Core and Angular.  It features a custom-built frontend with some slick animations to make your next planning session just a little bit nicer.  There's also a REST API that you can use to customize the game to your liking. 

PokeR uses Entity Framework Core in-memory.  If you need persistence for some reason, you can swap this out for SQLite or another provider.  Data is seeded on startup from the json files in the project's root directory. You can also edit options via the exposed REST API.  Documentation for the API can be viewed in the Swagger UI at `/swagger`.

## Quickstart
The easiest way to get going is by pulling down a ready-to-go image from Docker Hub.  
```powershell
docker run --name poker --restart always -d -p 80:80 halomademeapc/poker
```

## Overview
![Room creation screen](https://i.imgur.com/UdVZaty.png)
You can pick any integer that isn't already taken to be your room number.  This number will appear in share links to your room.  Options for the deck to play with are Modified Fibonacci (.5, 1, 2, 3, 5, 8, 13, 20) and T-Shirt Sizes, but more can be added by configuring the defaults JSON file or by posting new decks to the REST API at runtime.  

![Room join screen](https://i.imgur.com/0l1dU76r.png)
Users can join your room by going directly to `/rooms/{roomId}` or by going to the homepage and clicking on the "Join a room" button.  The first person into the room (assumed to be the person who created it) is designated as the host and gets extra controls to manage voting.

![Roster pane](https://i.imgur.com/mjIJbfS.png)
If you need to change who is in the host role, expanding the Roster tab on the left then dragging-and-dropping the crown icon onto another user will transfer ownership of the room to them.  

![Playfield](https://i.imgur.com/P55ujrs.png)
Cards are played face-down and revealed once everyone has played.  If someone changes their vote mid-round, you will see an animation of the original card being withdrawn and the new one being played in its stead.

![Confetti](https://i.imgur.com/VEaMsyxr.png)
If everybody happens to have the same vote, you'll be greeted with some celebratory confetti for the concensus courtesy of [confetti-js](https://www.npmjs.com/package/confetti-js).  One danger with this is that people like it so much it can start to encourage groupthink.  

![Countdown](https://i.imgur.com/2CB9CkIr.png)
If a user is AFK or otherwise responsive and is holding things up, the host can set a deadline for the voting round.  Everyone will see the countdown and once time is up, votes will be revealed even if not everyone has responded.

![New round button](https://i.imgur.com/sOS8wjE.png)
The host can begin a new round to clear out any existing votes and start things off fresh.

![Theme icon](https://i.imgur.com/amy7wtL.png) ![Theme switcher](https://i.imgur.com/yCJJYFG.png)
The app will respect your OS dark mode preference by default.  If you hover over the icon in the top-right corner, you can switch themes manually.

## Requirements
**To build**
* .NET 6 SDK
* Node.js

**To run**
* .NET 6 Runtime

## Building
```powershell
dotnet publish ./PokeR.csproj
```

## Running
```powershell
dotnet ./PokeR.dll
```
