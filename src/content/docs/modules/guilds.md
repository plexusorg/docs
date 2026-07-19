---
title: Guilds
description: An overview of the Guilds module for Plex
---

The Guilds module adds a player guild system. Players can create a guild, invite members, and manage the guild together.
A guild has a home, warps, a prefix, and a private guild chat. A guild also has ranks with in-guild permissions and a
claimed guild world.

## Commands

The Guilds module adds one command, `/guild`, with a set of subcommands. The `/guild` menu opens the main guild view.
See the [permissions page](/docs/permissions) for the full list of subcommands and their permission nodes.

Common subcommands:
- `guild create <name>` creates a guild.
- `guild invite <player>` invites a player, and the player runs `guild accept` or `guild deny`.
- `guild sethome` and `guild home` set and use the guild home.
- `guild setwarp <name>`, `guild warp <name>`, and `guild warps` manage guild warps.
- `guild chat` toggles guild chat or sends a guild chat message.
- `guild world` teleports to the guild world.
- `guild permissions` opens the rank permissions menu.

## Guild ranks and permissions

The Guilds module has its own in-guild permission system for the guild world. These are not Bukkit permission nodes. The
guild owner sets them per rank in the `guild permissions` menu. They control whether a rank can break blocks, place
blocks, and interact with blocks in the guild world.

## Configuration

The module writes a `config.yml` file to its data folder.

| Key | Default | Description |
|-----|---------|-------------|
| guilds.log-chat-message | true | Whether to log guild chat messages to the console. |

## Requirements

The Guilds module needs Advanced Slime Paper (ASP) for the guild world. Install ASP on your server. The module also
stores guild data in the Plex database, so set up a database in the Plex config.
