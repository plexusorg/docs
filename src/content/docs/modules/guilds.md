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
| `guild info [guild]` | Anyone | Show a guild's name, prefix, creation date, owner, officers, and members. Online players show in green and offline players in gray. Enter a guild name, guild UUID, world name, or player name. Omit it to show your own guild. |
| `guild accept <guild>` | No guild | Accept an invite. You can also click the button in the invite message. An invite expires after five minutes. |
| `guild visit <guild>` | Member, guest, or staff with entry permission | Teleport to a guild world. Enter the guild name or UUID. |
| `guild world` | Member | Teleport to the spawn of your guild world. |
| `guild world generate <overworld\|nether\|end\|superflat>` | Owner | Generate your guild world with the selected terrain type. |
| `guild world reset [confirm]` | Owner with `plex.guilds.world.reset` | Reset your guild world after confirmation. See [Reset a guild world](#reset-a-guild-world). |
| `guild warp` | Member | Show a clickable list of the guild warps. |
| `guild warp <name>` | Member | Teleport to a warp. |
| `guild warp set <name>` | Officer | Create or move a warp at your location. You must be in your guild world. |
| `guild warp delete <name>` | Officer | Delete a warp. |
| `guild chat [message]` | Member | Toggle guild chat, or send one message to guild chat. |
| `guild leave` | Member | Leave the guild. For the owner, this shows a warning first. |
| `guild leave confirm` | Owner with `plex.guilds.disband` | Disband the guild. See [Leave or disband a guild](#leave-or-disband-a-guild). |
| `guild invite <player>` | Officer | Invite an online player. |
| `guild guest add <player> [view\|build] [time]` | Officer | Give a player guest access to the guild world. Build mode requires `plex.guilds.guests.build`. |
| `guild guest remove <player>` | Officer | Remove a guest immediately. |
| `guild prefix set <text>` | Owner | Set the guild prefix. Every member shows the prefix before their tag in chat and in the tab list. |
| `guild prefix clear` | Owner | Remove the guild prefix. |
| `guild resetworld <guild> [confirm]` | Staff | Reset a guild world. See [Reset a guild world](#reset-a-guild-world). |
| `guild -o <guild> [subcommand] [arguments]` | Staff | Manage another guild as if you were its owner. See [Manage another guild](#manage-another-guild). |
| `guild recover deleted` | Staff | List disbanded guilds that you can still restore. |
| `guild recover guild <guild> [confirm]` | Staff | Restore a disbanded guild. See [Recover a guild](#recover-a-guild). |
| `guild recover sessions <player>` | Staff | List a player's sessions and the guild actions in each. |
| `guild recover session <id> [confirm]` | Staff | Undo the guild actions of one session. |

Guild names can contain `:`, for example `/guild create :3`.

Warp names use letters and numbers only, with a maximum of 16 characters. You cannot name a warp `set` or `delete`.

## Generate and visit a world

Creating a guild does not generate its world. As the owner, run `/guild world generate <type>`. Choose `overworld`,
`nether`, `end`, or `superflat`. These are the only terrain choices; there are no other generation settings.

After generation finishes, run `/guild world` to visit. You must reset an existing world before you can generate
another one with a different terrain type.

Every guild world uses the border width in `guilds.worlds.size`, regardless of terrain type. The default is 500,000 by
500,000 blocks, centered at X=0, Z=0. The default border extends 250,000 blocks in each direction. The configured border
also applies when you load or visit an existing guild world. Restart the server after you change this setting. Changing
the border does not regenerate existing terrain.

## The guild menu

Run `/guild` to open the menu. The menu shows the buttons that your role allows. A button for an action that also needs a
permission you lack is gray, and its description says why. See [Protect destructive actions](#protect-destructive-actions).

- Click **Go to world** to teleport to the guild world spawn.
- Click **Members** to see the members and their roles. Click a member to promote, demote, or kick them.
- Click **Guests** to see the guests, their mode, and their time left. Click a guest to switch between view and build, to extend
  the access, or to remove the guest.
- Click **Set world spawn here** to set the guild world spawn to your location. You must be in your guild world.
- Click **Warps** to see the warps. Click a warp to teleport.
- Click **World settings** to change the time and weather of the guild world. Only the owner and officers see this
  button.

Long lists have pages. Use the arrows at the bottom of the menu to change the page.

## Roles

A guild has three roles. These roles are not Bukkit permission nodes.

| Action | Owner | Officer | Member |
|--------|:-----:|:-------:|:------:|
| Enter the guild world, build, and use warps | Yes | Yes | Yes |
| Invite players, manage guests, set and delete warps, set the world spawn, change the world time and weather | Yes | Yes | No |
| Kick members | Yes | Yes | No |
| Kick officers, promote, demote, set the prefix | Yes | No | No |

A new member gets the Member role. The owner promotes a member to officer in the menu.

To give the guild to another player, the owner promotes an officer again. That player becomes the owner, and the old
owner becomes an officer. The old owner can then stay or leave.

Some actions need a permission node as well as the role:

| Action | Permission |
|--------|------------|
| Make a member the owner | `plex.guilds.transfer` |
| Promote a member to officer, or demote an officer | `plex.guilds.roles` |
| Kick a member or officer | `plex.guilds.kick` |
| Give a guest build mode, or extend a guest in build mode | `plex.guilds.guests.build` |
| Disband the guild | `plex.guilds.disband` |
| Reset the guild world | `plex.guilds.world.reset` |

## Guests

A guild world is private. Members and guests can enter it. Staff with `plex.guilds.world.bypass` can also enter without
joining the guild or receiving guest access. For `/guild visit <guild>`, staff also need `plex.guilds.world`.

The bypass also permits building and interaction in the world. It does not permit guild management. The module blocks
entry for other players.

An officer or the owner runs `guild guest add <player> [view|build] [time]` to add a guest. The guest gets a message with
a button to visit the world.

- Add `build` to let the guest build at once. If you do not enter a mode, a new guest gets view mode.
- A guest in view mode cannot build. The guest can open doors, trapdoors, and fence gates, and use buttons, levers, and
  pressure plates. Switch the guest to build mode in the menu.
- Guest access expires. The default time is 24 hours. Enter a time such as `30m`, `12h`, or `7d` to change it. The
  maximum time is 30 days. You can change both values in the configuration.
- Run `guild guest add` again for an existing guest to reset the time. If you do not enter a mode, the mode stays the
  same.
- When access ends or you remove a guest, the module moves the guest out of the world.
- Guests cannot use warps.

## Guild chat

Run `guild chat` to switch your chat between guild chat and public chat. Run `guild chat <message>` to send one message
to guild chat. Only the members of your guild see the message.

For safety, staff with `plex.guilds.chat.spy` see the guild chat of every guild. Each message shows the name of its
guild. The permission has no toggle.

## Leave or disband a guild

A member or officer runs `guild leave` to leave the guild.

When the owner runs `guild leave`, the module shows a warning. The owner then runs `guild leave confirm` to disband the
guild. This requires `plex.guilds.disband`. An owner without it can ask staff to disband the guild. To leave without
disbanding, make another member the owner, which requires `plex.guilds.transfer`, and then leave.

Disbanding removes the guild for every member and closes the guild world. Staff can restore the guild for the number of
days in `guilds.recovery.retention-days`. Until then, nobody can create a guild with the same name. After that time, the
module permanently deletes the guild, its world, its reset backups, and, with Oasis, the block history of its world.

:::danger
After the retention period, there is no backup. To keep the guild, make another member the owner first.
:::

## Reset a guild world

As the owner, run `/guild world reset`. Read the warning, then run `/guild world reset confirm` within 60 seconds. This
requires `plex.guilds.world.reset`. An owner without it must ask staff to reset the world.

Staff can reset another guild's world with `/guild resetworld <guild>`. Enter the guild name or UUID, read the warning,
then run `/guild resetworld <guild> confirm`. This requires `plex.guilds.resetworld`, not the entry bypass permission.

The reset moves all players out of the world and removes the world. The guild, its members, and its guests stay. The
reset clears the world's warps and saved spawn. The module keeps a backup of the old world for the number of days in
`guilds.worlds.backup-retention-days`. With Oasis, the reset also deletes the block history of the old world.

After the reset, the owner must run `/guild world generate <type>` before anyone can visit again.

## Protect destructive actions

On a server that allows offline-mode (cracked) accounts, anyone can join under a name that has no sign-in protection.
That person gets the guild role of the real player. As an owner, they could disband the guild, reset its world, or give
the guild to their own account. They could also leave a way back in: promote an alt to officer, or give an alt a
build-mode guest pass for up to 30 days.

To prevent this, grant the nodes in the table under [Roles](#roles) only to logins that your authentication plugin has
proven. Use a LuckPerms context from that plugin. A player whose login is not proven keeps the role and every other
guild action, but sees these buttons gray and gets a message when they try one.

LuckPerms applies a node when the player has any one of the values you list for a context, so you can accept weaker
sign-in methods for players than for staff.

Edit the locked-action messages in `messages.yml` to tell players how to protect their account on your server.

If someone already used a player's account, staff can undo that session's guild actions with
`/guild recover session`. See [Recover a guild](#recover-a-guild). Block changes in the guild world need a rollback in
Oasis.

## Manage another guild

Staff with `plex.guilds.others` can act on any guild as if they were its owner. Run `/guild -o <guild>` to open that
guild's menu. Enter the guild name or UUID. In the menu, you can promote, demote, and kick members, make a member the
owner, and manage guests, warps, the spawn, and the world settings. When you make a member the owner, the current owner
becomes an officer. You cannot kick the owner.

Add a subcommand to run it for that guild, for example `/guild -o Builders warp set spawn` or
`/guild -o Builders world reset`. These subcommands work with `-o`: `invite`, `warp`, `guest`, `prefix`, `world`,
`visit`, `chat`, `info`, and `leave`. You still need the permission for the subcommand itself.

- `guild -o <guild> visit` teleports you to the guild world without the entry bypass permission.
- `guild -o <guild> chat` switches your chat to that guild's chat.
- `guild -o <guild> leave confirm` disbands the guild.

## Recover a guild

The module records every guild action with the player who made it and the session in which it happened. A session lasts
from when a player joins the server until they leave. The module keeps disbanded guilds and this action log for the
number of days in `guilds.recovery.retention-days`. Recovery requires `plex.guilds.recover`.

To restore a disbanded guild, run `/guild recover deleted` to list the disbanded guilds. Click a guild, or run
`/guild recover guild <guild>`, to preview the restore. Then run `/guild recover guild <guild> confirm`. The guild comes
back with its world, warps, and prefix. Members who joined another guild in the meantime stay in their new guild. If the
owner is one of them, the restore makes the member with the highest role the owner. If no member remains, the guild
cannot be restored.

To undo what a player did, for example after a compromised account, run `/guild recover sessions <player>`. Click a
session, or run `/guild recover session <id>`, to see its actions. Then run `/guild recover session <id> confirm` to
reverse them. The undo covers members, roles, ownership, guests, invites, warps, the spawn, the prefix, world settings,
world resets, guild creation, and disbands. It does not undo block changes in the world.

The undo skips an action when:

- the guild changed again after the action,
- the action reset a world whose backup no longer exists,
- the action generated a world,
- the old prefix now belongs to another guild, or
- the player now belongs to another guild.

## Configuration

The module writes a `config.yml` file to its data folder.

| Key | Default | Description |
|-----|---------|-------------|
| guilds.recovery.retention-days | 7 | How long to keep disbanded guilds and the action log for recovery. |
| guilds.log-chat-message | true | Whether to log guild chat messages to the console. |
| guilds.invites.daily-limit | 5 | The most invites one guild can send in 24 hours. |
| guilds.guests.default-duration | 24h | The guest access time when `guild guest add` has no time. |
| guilds.guests.max-duration | 30d | The longest guest access time that a player can give. |
| guilds.worlds.unload-after | 5m | How long an empty guild world stays loaded before it unloads. |
| guilds.worlds.size | 500000 | Border width in blocks for every terrain type. Use an even number from 16 to 59999968. |
| guilds.worlds.backup-retention-days | 7 | How long to keep backups from world resets. A backup for an unfinished reset is kept until the reset finishes. |

Durations use a whole number followed by `m` (minutes), `h` (hours), or `d` (days).

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.

## Requirements

The Guilds module stores guild data in the Plex database, so set up a database in the Plex config.

Guild worlds require Scissors-ASP with vanilla world profile support. Without the required server support, the module
still runs, but guild worlds are disabled. The console shows a warning at startup. If you run `/guild world`, you get
a message that guild worlds are not available.
