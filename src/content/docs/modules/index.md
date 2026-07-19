---
title: Introduction
description: The official modules that extend Plex
---

Modules add optional features to Plex. You can add or remove modules to fit your server. This keeps the core plugin
light while you add only the features that you need.

## How modules work

You can install an official module in game with `/plex modules install <name>`. You can also download a module and place
the JAR in the `/plugins/Plex/modules/` folder, then run `/plex modules reload` or restart the server.

To update your modules, run `/plex modules update`. To remove a module, run `/plex modules uninstall <name>`.

To build your own module, see [Creating a module](/docs/create_module).

## Official modules

| Module | Description |
|--------|-------------|
| FalseOp | Makes clients think they have operator status |
| Guilds | Adds a player guild system with ranks, warps, and a guild world |
| HTTPD | Runs a web dashboard and API for server data and admin tools |
| LibsDisguises | Adds admin controls for the LibsDisguises plugin |
| NickMiniMessage | Sets EssentialsX nicknames with MiniMessage formatting |
| NUSH | Silences brand-new players to help you stop raids |
| TFMExtras | Adds extra fun and admin commands in the style of TotalFreedomMod |

:::tip
Keep your modules on the same version as Plex. Update Plex and your modules together.
:::
