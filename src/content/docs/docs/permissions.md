---
title: Permissions
description: All of the commands, permission nodes, and command descriptions for Plex and the official Plex modules
---

This page lists the permission nodes for Plex and the official modules. Some nodes, such as world entry and world
modification, come from the server config and change with your setup. World nodes follow the format
`plex.world.<world>.enter` and `plex.world.<world>.modify`.

## Plex

| Command | Permission | Description |
|---------|------------|-------------|
| adminchat | plex.adminchat | Talk privately with other admins |
| adminworld | plex.adminworld | Teleport to the adminworld |
| ban | plex.ban | Ban a player, offline or online. Add `-rb` to roll back their last day of block changes |
| banip | plex.banip | Ban an IP address forever. You can give an IP or a player name |
| banlist | plex.banlist | Show the active bans. Run `/banlist purge` from the console to unban everyone |
| banname | plex.banname | Ban a username forever |
| blockedit | plex.blockedit | Stop a player from modifying blocks |
| commandspy | plex.commandspy | Spy on other players' commands |
| consolesay | plex.consolesay | Show a message to everyone from the console |
| entitywipe | plex.entitywipe | Remove entities that may cause lag, such as dropped items and boats |
| flatlands | plex.flatlands | Teleport to the flatlands |
| freeze | plex.freeze | Freeze a player |
| kick | plex.kick | Kick a player |
| list | plex.list | Show a list of online players |
| list -d | plex.list | Show the list with display names |
| list -v | plex.list.vanished | Show vanished players only |
| localspawn | plex.localspawn | Teleport to the spawn of your current world |
| lockup | plex.lockup | Lock up a player |
| masterbuilderworld | plex.masterbuilderworld | Teleport to the Master Builder world |
| moblimit | plex.moblimit | Manage the mob limit per chunk |
| mobpurge | plex.mobpurge | Purge all mobs |
| mute | plex.mute | Mute a player |
| notes | plex.notes | Manage notes for a player |
| pdebug | plex.debug | Plex's debug command, available only when debug is on |
| plex | N/A | Show information about Plex |
| plex reload | plex.reload | Reload Plex |
| plex update | plex.update | Update Plex to the newest build |
| plex modules | N/A | List the loaded modules |
| plex modules reload | plex.modules.reload | Reload the modules |
| plex modules update | plex.modules.update | Update the modules |
| plex modules install | plex.modules.install | Install a module by name |
| plex modules uninstall | plex.modules.uninstall | Uninstall a module |
| protect | plex.protect | Create and manage WorldGuard regions from flag presets. The command exists only when WorldGuard is installed |
| punishments | plex.punishments | Open the punishments dialog |
| rawsay | plex.rawsay | Show a raw message to everyone |
| removeloginmessage | plex.removeloginmessage | Remove your own login message |
| removeloginmessage -o | plex.removeloginmessage.others | Remove another player's login message |
| say | plex.say | Show a message to everyone |
| setloginmessage | plex.setloginmessage | Set your own login message |
| setloginmessage -o | plex.setloginmessage.others | Set another player's login message |
| smite | plex.smite | Smite a player |
| tag | plex.tag | Set or clear your prefix |
| tag clear | plex.tag.clear.others | Clear another player's prefix |
| tempban | plex.tempban | Temporarily ban a player. Add `-rb` to roll back their last day of block changes |
| tempmute | plex.tempmute | Temporarily mute a player |
| toggle | plex.toggle | Toggle server features through a dialog |
| unban | plex.ban | Unban a player, offline or online |
| unfreeze | plex.unfreeze | Unfreeze a player |
| unmute | plex.unmute | Unmute a player |
| whohas | plex.whohas | List players with a specific item in their inventory |
| whohas clear | plex.whohas.clear | Clear a specific item from all players' inventories |
| world | plex.world | Teleport to a world |

Plex has no game mode commands of its own. It also cancels every game mode change that a command makes, including the
vanilla `/gamemode` command.

Plex also uses these permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.ban.bypass | Join the server while banned |
| plex.gamemode.spectator.teleport | Teleport to a player while in spectator mode |
| plex.mute.bypass | Chat and use blocked commands while chat is turned off |
| plex.notes.notify | Get an alert when a player with notes joins |
| plex.world.playerworlds | See and enter player worlds with `/world` |

## Guilds module

| Command | Permission | Description |
|---------|------------|-------------|
| guild | plex.guilds.guild | Open the guild menu, or show your invites if you are not in a guild |
| guild accept | plex.guilds.accept | Accept a guild invite |
| guild chat | plex.guilds.chat | Toggle guild chat or send a guild chat message |
| guild create | plex.guilds.create | Create a guild with a name |
| guild guest | plex.guilds.guests | Add or remove a guest of the guild world |
| guild invite | plex.guilds.invite | Invite a player to the guild |
| guild leave | plex.guilds.leave | Leave your guild, or disband it as the owner |
| guild prefix | plex.guilds.prefix | Set or clear the guild prefix |
| guild resetworld | plex.guilds.resetworld | Reset a guild world (staff) |
| guild visit | plex.guilds.world | Teleport to a guild world where you are a guest |
| guild warp | plex.guilds.warp | List, use, set, and delete guild warps |
| guild world | plex.guilds.world | Teleport to your guild world |

The command also works as `/guilds` and `/g`. The guild role also controls some subcommands. For example, only officers
and the owner can invite players. See the [Guilds page](/modules/guilds) for the roles.

## HTTPD module

The HTTPD module does not use Bukkit permission nodes. It controls access through staff login. A user who signs in and
has the staff flag on their linked account can use the protected pages and issue punishments from the web. See the
[HTTPD module page](/modules/httpd) for details.

## LibsDisguises module

| Command | Permission | Description |
|---------|------------|-------------|
| disguisetoggle | plex.libsdisguises.disguisetoggle | Toggle LibsDisguises for the whole server |
| undisguiseall | plex.libsdisguises.undisguiseall | Undisguise all players |

The module also uses two permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.libsdisguises.bypass | Exempt a player from `/undisguiseall`. The `-a` flag ignores this permission. |
| plex.libsdisguises.player | Keep the fake name when disguised as another player. Without it, the disguise shows the real name but keeps the fake skin. |

## NickMiniMessage module

| Command | Permission | Description |
|---------|------------|-------------|
| nickmm | plex.nickmm | Change your nickname with MiniMessage formatting |

The command also works as `/nickminimessage`.

The module also uses two permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.nickmm.ignore_length_limit | Bypass the maximum nickname length |
| plex.nickmm.ignore_matching | Bypass the duplicate-nickname check |

## NUSH module

| Command | Permission | Description |
|---------|------------|-------------|
| nush | plex.nush.use | Toggle and manage NUSH |
| nush allow, nush revoke | plex.nush.allow | Allow a player or restrict a player again. Also requires plex.nush.use |

The module also uses these permissions:

| Permission | Description |
|------------|-------------|
| plex.nush.view | Receive the staff feed and alerts, including restricted players' normal join and leave messages while NUSH is on |
| plex.nush.bypass | Bypass automatic restriction on arrival or when staff turn NUSH on. Does not remove an existing restriction |

## TFMExtras module

| Command | Permission | Description |
|---------|------------|-------------|
| admininfo | plex.tfmextras.admininfo | Show information on how to apply for admin |
| autoclear | plex.tfmextras.autoclear | Toggle whether a player has their inventory cleared when they join |
| autoteleport | plex.tfmextras.autotp | Teleport yourself at random |
| cage | plex.tfmextras.cage | Cage a player or remove their cage (admin-only) |
| cake | plex.tfmextras.cake | Give a cake to everyone on the server |
| clearchat | plex.tfmextras.clearchat | Clear the chat |
| cloudclear | plex.tfmextras.cloudclear | Clear lingering area-effect clouds |
| clownfish | plex.tfmextras.clownfish | Give a clownfish that knocks players back |
| cookie | plex.tfmextras.cookie | Give a cookie to everyone on the server |
| disco | plex.tfmextras.disco | Start or stop your own dance floor |
| effect clear | plex.tfmextras.effect.clear | Clear your own potion effects |
| effect give | plex.tfmextras.effect.give | Give yourself a potion effect |
| eject | plex.tfmextras.eject | Remove all passengers from yourself |
| emf | plex.tfmextras.emf | Strike a player with lightning and kill them |
| enchant | plex.tfmextras.enchant | Enchant the item in your hand |
| expel | plex.tfmextras.expel | Push away nearby players |
| gravity | plex.tfmextras.gravity | Change your own gravity for this session |
| jumppads | plex.tfmextras.jumppads | Enable jump pads for yourself or another player |
| orbit | plex.tfmextras.orbit | Start or stop your own orbit |
| paintball | plex.tfmextras.paintball | Give snowballs that paint what they hit for a few seconds |
| randomfish | plex.tfmextras.randomfish | Spawn a random fish at your location |
| rocket | plex.tfmextras.rocket | Launch yourself on a rocket without a public announcement |
| size | plex.tfmextras.size | Change your own size for this session |
| trail | plex.tfmextras.trail | Toggle a rainbow trail that fades behind you |

Grant the base command permission as well as its `.others` permission to let staff target other players.
Keep the cage, cake, and cookie permissions for admins.
For disco, grant `plex.tfmextras.disco` for self-use. Also grant `plex.tfmextras.disco.everyone` for
`/disco everyone [seconds|stop]`. You cannot target one other player.

The module also uses these additional permissions:

| Permission | Description |
|------------|-------------|
| plex.tfmextras.autotp.others | Toggle auto-teleport on join for a named player |
| plex.tfmextras.clownfish.restrict | Restrict a player with `/clownfish restrict` |
| plex.tfmextras.disco.everyone | Start or stop dance floors for all online players; also requires plex.tfmextras.disco |
| plex.tfmextras.effect.clear.others | Clear another player's potion effects |
| plex.tfmextras.effect.give.others | Give another player a potion effect |
| plex.tfmextras.gravity.others | Change another player's gravity |
| plex.tfmextras.jumppads.others | Set the jump-pad mode of another player |
| plex.tfmextras.orbit.others | Start or stop another player's orbit |
| plex.tfmextras.rocket.others | Launch another player on a rocket with an admin announcement |
| plex.tfmextras.size.others | Change another player's size |
