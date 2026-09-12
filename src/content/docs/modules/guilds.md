---
title: Guilds
description: An overview of the Guilds module for Plex
---

The Guilds module adds a player guild system. Players can create a guild, invite members, and manage the guild together.
A guild has a home, warps, a prefix, and a private guild chat. A guild also has two roles with in-guild permissions. A
guild can have its own world if the server supports guild worlds.

## Commands

The Guilds module adds one command, `/guild`, with a set of subcommands. The `/guild` menu opens the main guild view.
See the [permissions page](/docs/permissions) for the full list of subcommands and their permission nodes.

Common subcommands:
- `guild create <name>` creates a guild.
- `guild invite <player>` invites a player. The player clicks the accept button in the invite message, or runs
  `guild accept <guild>` or `guild deny <guild>`. An invite expires after five minutes.
- `guild sethome` and `guild home` set and use the guild home.
- `guild setwarp <name>`, `guild warp <name>`, and `guild warps` manage guild warps.
- `guild chat` toggles guild chat or sends a guild chat message.
- `guild world` teleports to the guild world.
- `guild permissions` opens the rank permissions menu.

Run `guild help <subcommand>` to see the details of one subcommand.

The command also works as `/guilds` and `/g`. These subcommands have aliases:
- `create`: `make`
- `home`: `spawn`
- `info`: `information`
- `invite`: `inv`
- `menu`: `gui`, `panel`
- `owner`: `setowner`, `promote`
- `permissions`: `perms`
- `prefix`: `tag`, `settag`, `setprefix`
- `sethome`: `setspawn`
- `setwarp`: `makewarp`, `createwarp`
- `warp`: `goto`
- `warps`: `listwarps`
- `world`: `base`

## Guild ranks and permissions

A guild has two roles: the owner and the members. The Guilds module has its own in-guild permission system for the guild
world. These are not Bukkit permission nodes. The owner opens the `guild permissions` menu and sets what members can do
in the guild world: break blocks, place blocks, and interact with blocks. The owner can always do all three.

Only guild members can enter a guild world. The module sends anyone else back to the main world.

`guild owner <player>` gives the guild to another member. An owner cannot leave a guild that still has other members.
The owner must transfer the guild first, or disband it. If the owner is the only member, `guild leave` disbands the
guild.

## Configuration

The module writes a `config.yml` file to its data folder.

| Key | Default | Description |
|-----|---------|-------------|
| guilds.log-chat-message | true | Whether to log guild chat messages to the console. |

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.

## Requirements

The Guilds module stores guild data in the Plex database, so set up a database in the Plex config.

Advanced Slime Paper (ASP) is optional. Install ASP if you want guild worlds. Without ASP the module still runs, and
every other feature works, but players cannot use guild worlds. The console shows a warning at startup, and
`guild world` tells the player that guild worlds are not available.
