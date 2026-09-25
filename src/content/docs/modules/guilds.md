---
title: Guilds
description: An overview of the Guilds module for Plex
---

The Guilds module adds a player guild system. Each guild gets a private world. Guild members build in the world
together. Other players can enter only as guests. A guild also has warps, a prefix, and a private guild chat.

## Commands

The Guilds module adds one command, `/guild`, with a set of subcommands. The command also works as `/guilds` and `/g`.
Subcommands have no aliases. See the [permissions page](/docs/permissions) for the permission nodes.

Run `/guild` with no arguments to open the guild menu. If you are not in a guild, `/guild` shows your pending invites and
how to create a guild. Help and tab completion show only the subcommands that you can use.

| Command | Who | Description |
|---------|-----|-------------|
| `guild help` | Anyone | Show the subcommands that you can use. |
| `guild create <name>` | No guild | Create a guild. You become the owner. Guild names are unique and not case-sensitive. |
| `guild accept <guild>` | No guild | Accept an invite. You can also click the button in the invite message. An invite expires after five minutes. |
| `guild visit <guild>` | Guest | Teleport to the spawn of a guild world where you are a guest. |
| `guild world` | Member | Teleport to the spawn of your guild world. |
| `guild warp` | Member | Show a clickable list of the guild warps. |
| `guild warp <name>` | Member | Teleport to a warp. |
| `guild warp set <name>` | Officer | Create or move a warp at your location. You must be in your guild world. |
| `guild warp delete <name>` | Officer | Delete a warp. |
| `guild chat [message]` | Member | Toggle guild chat, or send one message to guild chat. |
| `guild leave` | Member | Leave the guild. For the owner, this shows a warning first. |
| `guild leave confirm` | Owner | Disband the guild and permanently delete the guild world. |
| `guild invite <player>` | Officer | Invite an online player. |
| `guild guest add <player> [time]` | Officer | Give a player guest access to the guild world. |
| `guild guest remove <player>` | Officer | Remove a guest immediately. |
| `guild prefix set <text>` | Owner | Set the guild prefix. Every member shows the prefix before their tag in chat and in the tab list. |
| `guild prefix clear` | Owner | Remove the guild prefix. |
| `guild resetworld <guild> [confirm]` | Staff | Reset a guild world. See [Reset a guild world](#reset-a-guild-world). |

Warp names use letters and numbers only, with a maximum of 16 characters. You cannot name a warp `set` or `delete`.

## The guild menu

Run `/guild` to open the menu. The menu shows only the buttons that you can use.

- **Go to world** teleports you to the guild world spawn.
- **Members** lists the members with their roles. Click a member to promote, demote, or kick them.
- **Guests** lists the guests with their mode and time left. Click a guest to switch between view and build, to extend
  the access, or to remove the guest.
- **Set world spawn here** sets the guild world spawn to your location. You must be in your guild world.
- **Warps** lists the warps. Click a warp to teleport.

Long lists have pages. Use the arrows at the bottom of the menu to change the page.

## Roles

A guild has three roles. These roles are not Bukkit permission nodes.

| Action | Owner | Officer | Member |
|--------|:-----:|:-------:|:------:|
| Enter the guild world, build, and use warps | Yes | Yes | Yes |
| Invite players, manage guests, set and delete warps, set the world spawn | Yes | Yes | No |
| Kick members | Yes | Yes | No |
| Kick officers, promote, demote, set the prefix | Yes | No | No |

A new member gets the Member role. The owner promotes a member to officer in the menu.

To give the guild to another player, the owner promotes an officer again. That player becomes the owner, and the old
owner becomes an officer. The old owner can then stay or leave.

## Guests

A guild world is private. Only members and guests can enter it. The module sends anyone else back to the main world.

An officer or the owner runs `guild guest add <player> [time]` to add a guest. The guest gets a message with a button to
visit the world.

- A new guest can look but cannot build. Switch the guest to build mode in the menu.
- Guest access expires. The default time is 24 hours. Enter a time such as `30m`, `12h`, or `7d` to change it. The
  maximum time is 30 days. You can change both values in the configuration.
- Run `guild guest add` again for an existing guest to reset the time. The mode stays the same.
- When access ends or you remove a guest, the module moves the guest out of the world.
- Guests cannot use warps.

## Leave or disband a guild

A member or officer runs `guild leave` to leave the guild.

When the owner runs `guild leave`, the module shows a warning. The owner then runs `guild leave confirm` to disband the
guild.

:::danger
Disbanding removes the guild for every member. It also permanently deletes the guild world and everything built in it.
There is no backup. To keep the guild, make another member the owner first.
:::

## Reset a guild world

Staff run `guild resetworld <guild>` to replace a guild world with a new, empty world. Enter the guild name or the guild
UUID. The module shows what the reset does, then staff run the command again with `confirm`.

The reset moves all players out of the world. The guild, its members, and its guests stay. The reset removes the warps
in the world and sets the world spawn back to the default. The module keeps a backup of the old world for the number of
days in `guilds.worlds.backup-retention-days`.

## Configuration

The module writes a `config.yml` file to its data folder.

| Key | Default | Description |
|-----|---------|-------------|
| guilds.log-chat-message | true | Whether to log guild chat messages to the console. |
| guilds.guests.default-duration | 24h | The guest access time when `guild guest add` has no time. |
| guilds.guests.max-duration | 30d | The longest guest access time that a player can give. |
| guilds.worlds.size | 500000 | The world border and terrain size for new worlds and resets. |
| guilds.worlds.backup-retention-days | 7 | How long to keep backups from world resets. |

Durations use a whole number followed by `m` (minutes), `h` (hours), or `d` (days).

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.

## Requirements

The Guilds module stores guild data in the Plex database, so set up a database in the Plex config.

Advanced Slime Paper (ASP) is optional. Install ASP if you want guild worlds. Without ASP the module still runs, and
every other feature works, but players cannot use guild worlds. The console shows a warning at startup, and
`guild world` tells the player that guild worlds are not available.
