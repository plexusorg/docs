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

| Module | Description | Source |
|--------|-------------|--------|
| [FalseOp](/modules/falseop) | Makes clients think they have operator status | [GitHub](https://github.com/plexusorg/Module-FalseOp) |
| [Guilds](/modules/guilds) | Adds player guilds with a private guild world, roles, guests, and warps | [GitHub](https://github.com/plexusorg/Module-Guilds) |
| [HTTPD](/modules/httpd) | Runs a web dashboard and API for server data and admin tools | [GitHub](https://github.com/plexusorg/Module-HTTPD) |
| [LibsDisguises](/modules/libsdisguises) | Adds admin controls for the LibsDisguises plugin | [GitHub](https://github.com/plexusorg/Module-LibsDisguises) |
| [MiniMessageExtensions](/modules/minimessageextensions) | Sets MiniMessage nicknames and chat color styles | [GitHub](https://github.com/plexusorg/Module-MiniMessageExtensions) |
| [NUSH](/modules/nush) | Silences brand-new players to help you stop raids | [GitHub](https://github.com/plexusorg/Module-NUSH) |
| [TFMExtras](/modules/tfmextras) | Adds extra fun and admin commands in the style of TotalFreedomMod | [GitHub](https://github.com/plexusorg/Module-TFMExtras) |

:::tip
Keep your modules on the same version as Plex. Update Plex and your modules together.
:::
