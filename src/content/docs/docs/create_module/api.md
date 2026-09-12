---
title: The Plex API
description: The services that a Plex module can use through the api() facade
---

Every service is a method on the facade that `api()` returns. Keep to these methods. They are the supported module API.

| Service | Purpose |
|---------|---------|
| `api().logging()` | Logs `info`, `debug`, `warn`, and `error` messages. |
| `api().messages()` | Builds components, formats MiniMessage, and broadcasts messages. |
| `api().players()` | Looks up players, lists online names, and reads per-module player data. |
| `api().punishments()` | Reads indefinite bans and issues punishments. |
| `api().commands()` | Registers commands and lists the commands that Plex tracks. |
| `api().notes()` | Reads and writes player notes. |
| `api().configuration()` | Reads the shared Plex config, messages, indefinite bans, and toggles. |
| `api().moduleConfigs()` | Creates module configuration objects. |
| `api().modules()` | Reads metadata about the loaded modules. |
| `api().storage()` | Gives SQL storage and migrations for the module. |
| `api().rollback()` | Runs a block rollback for a player. |
| `api().apiCompatibilityVersion()` | Returns the module API version of this Plex build, as an `int`. |

Listeners do not go through the facade. Register a listener with `registerListener(Listener)` on your module.

A player lookup returns a `PlexPlayerView`. It exposes the player UUID, name, IP list, punishment history, and the
frozen, muted, locked-up, and staff-chat states. It does not expose the online `Player` object.
