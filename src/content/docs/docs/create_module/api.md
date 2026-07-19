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
| `api().listeners()` | Registers and unregisters listeners. |
| `api().configuration()` | Reads the shared Plex config, messages, indefinite bans, and toggles. |
| `api().moduleConfigs()` | Creates module configuration objects. |
| `api().modules()` | Reads metadata about the loaded modules. |
| `api().storage()` | Gives SQL storage and migrations for the module. |
| `api().scheduler()` | Runs global, async, region, and entity tasks with Folia support. |
| `api().rollback()` | Runs a block rollback for a player. |
| `api().compatibility()` | Returns the module API version of this Plex build. |

A player lookup returns a `PlexPlayerView`. It exposes the player UUID, name, IP list, punishment history, the frozen,
muted, and locked-up states, and the online `Player` object.
