---
title: Guilds
description: An overview of the Guilds module for Plex
---

The Guilds module adds a player guild system. Each guild can have a private world. Guild members build in the world
together. Other players need guest access or the staff entry permission. A guild also has warps, a prefix, and a private
guild chat.

## Commands

The Guilds module adds one command, `/guild`, with a set of subcommands. The command also works as `/guilds` and `/g`.
Subcommands have no aliases. See the [permissions page](/docs/permissions) for the permission nodes.

Run `/guild` with no arguments to open the guild menu. If you are not in a guild, `/guild` shows your pending invites and
how to create a guild. Help and tab completion show only the subcommands that you can use.

| Command | Who | Description |
|---------|-----|-------------|
| `guild help` | Anyone | Show the subcommands that you can use. |
| `guild create <name>` | No guild | Create a guild. You become the owner. Guild names are unique and not case-sensitive. |
| `guild list [page]` | Anyone | List guilds. Click a guild to see its information. |
| `guild info [guild]` | Anyone | Show a guild's name, UUID, owner, member count, creation date, and prefix. Enter a name or UUID. Omit it to show your own guild. |
| `guild accept <guild>` | No guild | Accept an invite. You can also click the button in the invite message. An invite expires after five minutes. |
| `guild visit <guild>` | Member, guest, or staff with entry permission | Teleport to a guild world. Enter the guild name or UUID. |
| `guild world` | Member | Teleport to the spawn of your guild world. |
| `guild world generate <overworld\|nether\|end\|superflat>` | Owner | Generate your guild world with the selected terrain type. |
| `guild world reset [confirm]` | Owner | Reset your guild world after confirmation. See [Reset a guild world](#reset-a-guild-world). |
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

Guild names can contain `:`, for example `/guild create :3`.

Warp names use letters and numbers only, with a maximum of 16 characters. You cannot name a warp `set` or `delete`.

## Generate and visit a world

Creating a guild does not generate its world. As the owner, run `/guild world generate <type>`. Choose `overworld`,
`nether`, `end`, or `superflat`. These are the only terrain choices; there are no other generation settings.

After generation finishes, run `/guild world` to visit. You must reset an existing world before you can generate
another one with a different terrain type.

Every guild world has a fixed 500,000 by 500,000 block border, regardless of terrain type. The border is centered at
X=0, Z=0 and extends 250,000 blocks in each direction. This also applies when you load an existing guild world.

## The guild menu

Run `/guild` to open the menu. The menu shows only the buttons that you can use.

- Click **Go to world** to teleport to the guild world spawn.
- Click **Members** to see the members and their roles. Click a member to promote, demote, or kick them.
- Click **Guests** to see the guests, their mode, and their time left. Click a guest to switch between view and build, to extend
  the access, or to remove the guest.
- Click **Set world spawn here** to set the guild world spawn to your location. You must be in your guild world.
- Click **Warps** to see the warps. Click a warp to teleport.

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

A guild world is private. Members and guests can enter it. Staff with `plex.guilds.world.bypass` can also enter without
joining the guild or receiving guest access. For `/guild visit <guild>`, staff also need `plex.guilds.world`.

The bypass permits entry only. It does not grant permission to build, interact, or manage the guild. The module blocks
entry for other players.

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

As the owner, run `/guild world reset`. Read the warning, then run `/guild world reset confirm` within 60 seconds.

Staff can reset another guild's world with `/guild resetworld <guild>`. Enter the guild name or UUID, read the warning,
then run `/guild resetworld <guild> confirm`. This requires `plex.guilds.resetworld`, not the entry bypass permission.

The reset moves all players out of the world and removes the world. The guild, its members, and its guests stay. The
reset clears the world's warps and saved spawn. The module keeps a backup of the old world for the number of days in
`guilds.worlds.backup-retention-days`.

After the reset, the owner must run `/guild world generate <type>` before anyone can visit again.

## Configuration

The module writes a `config.yml` file to its data folder.

| Key | Default | Description |
|-----|---------|-------------|
| guilds.log-chat-message | true | Whether to log guild chat messages to the console. |
| guilds.guests.default-duration | 24h | The guest access time when `guild guest add` has no time. |
| guilds.guests.max-duration | 30d | The longest guest access time that a player can give. |
| guilds.worlds.backup-retention-days | 7 | How long to keep backups from world resets. |

Durations use a whole number followed by `m` (minutes), `h` (hours), or `d` (days).

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.

## Requirements

The Guilds module stores guild data in the Plex database, so set up a database in the Plex config.

Guild worlds require Scissors-ASP with vanilla world profile support. Without the required server support, the module
still runs, but guild worlds are disabled. The console shows a warning at startup. If you run `/guild world`, you get
a message that guild worlds are not available.
