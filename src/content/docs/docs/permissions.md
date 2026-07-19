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
| adventure | plex.gamemode.adventure | Set your own gamemode to adventure mode |
| adventure (others) | plex.gamemode.adventure.others | Set another player's gamemode to adventure mode |
| ban | plex.ban | Ban a player, offline or online |
| banlist | plex.banlist | Manage the banlist |
| bcastloginmessage | plex.broadcastloginmessage | Broadcast your login message for vanish support |
| blockedit | plex.blockedit | Stop a player from modifying blocks |
| commandspy | plex.commandspy | Spy on other players' commands |
| consolesay | plex.consolesay | Show a message to everyone from the console |
| creative | plex.gamemode.creative | Set your own gamemode to creative mode |
| creative (others) | plex.gamemode.creative.others | Set another player's gamemode to creative mode |
| entitywipe | plex.entitywipe | Remove entities that may cause lag, such as dropped items and boats |
| flatlands | plex.flatlands | Teleport to the flatlands |
| freeze | plex.freeze | Freeze a player |
| gamemode | plex.gamemode | Change your own gamemode |
| gamemode (others) | plex.gamemode.others | Change another player's gamemode |
| kick | plex.kick | Kick a player |
| list | plex.list | Show a list of online players |
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
| punishments | plex.punishments | Open the punishments dialog |
| rawsay | plex.rawsay | Show a raw message to everyone |
| removeloginmessage | plex.removeloginmessage | Remove your own login message |
| removeloginmessage -o | plex.removeloginmessage.others | Remove another player's login message |
| say | plex.say | Show a message to everyone |
| setloginmessage | plex.setloginmessage | Set your own login message |
| setloginmessage -o | plex.setloginmessage.others | Set another player's login message |
| smite | plex.smite | Smite a player |
| spectator | plex.gamemode.spectator | Set your own gamemode to spectator mode |
| spectator (others) | plex.gamemode.spectator.others | Set another player's gamemode to spectator mode |
| survival | plex.gamemode.survival | Set your own gamemode to survival mode |
| survival (others) | plex.gamemode.survival.others | Set another player's gamemode to survival mode |
| tag | plex.tag | Set or clear your prefix |
| tag clear | plex.tag.clear.others | Clear another player's prefix |
| tempban | plex.tempban | Temporarily ban a player |
| tempmute | plex.tempmute | Temporarily mute a player |
| toggle | plex.toggle | Toggle server features through a dialog |
| unban | plex.ban | Unban a player, offline or online |
| unfreeze | plex.unfreeze | Unfreeze a player |
| unmute | plex.unmute | Unmute a player |
| whohas | plex.whohas | List players with a specific item in their inventory |
| whohas clear | plex.whohas.clear | Clear a specific item from all players' inventories |
| world | plex.world | Teleport to a world |

## Guilds module

| Command | Permission | Description |
|---------|------------|-------------|
| guild | plex.guilds.guild | Open the guild menu |
| guild accept | plex.guilds.accept | Accept a guild invite |
| guild chat | plex.guilds.chat | Toggle guild chat or send a guild chat message |
| guild create | plex.guilds.create | Create a guild with a name |
| guild deny | plex.guilds.deny | Deny a guild invite |
| guild disband | plex.guilds.disband | Disband your guild |
| guild home | plex.guilds.home | Teleport to the guild home |
| guild info | plex.guilds.info | Show the guild information |
| guild invite | plex.guilds.invite | Invite a player to the guild |
| guild leave | plex.guilds.leave | Leave your guild |
| guild menu | plex.guilds.menu | Open the guild management menu |
| guild owner | plex.guilds.owner | Set the guild owner |
| guild permissions | plex.guilds.permissions | Open the guild rank permissions menu |
| guild prefix | plex.guilds.prefix | Set the guild prefix |
| guild sethome | plex.guilds.sethome | Set the guild home |
| guild setwarp | plex.guilds.setwarp | Create a guild warp at your location |
| guild warp | plex.guilds.warp | Warp to a guild warp |
| guild warps | plex.guilds.warps | Show a clickable list of guild warps |
| guild world | plex.guilds.world | Teleport to the guild world |

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
| plex.libsdisguises.player | Keep the fake name and skin when disguised as another player. Without it, the disguise shows the real name and skin. |

## NickMiniMessage module

| Command | Permission | Description |
|---------|------------|-------------|
| nickmm | plex.nickmm | Change your nickname with MiniMessage formatting |

The module also uses two permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.nickmm.ignore_length_limit | Bypass the maximum nickname length |
| plex.nickmm.ignore_matching | Bypass the duplicate-nickname check |

## NUSH module

| Command | Permission | Description |
|---------|------------|-------------|
| nush | plex.nush.use | Toggle and manage NUSH |

The module also uses one permission node that is not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.nush.view | View the messages that NUSH holds back from new players |

## TFMExtras module

| Command | Permission | Description |
|---------|------------|-------------|
| admininfo | plex.tfmextras.admininfo | Show information on how to apply for admin |
| autoclear | plex.tfmextras.autoclear | Toggle whether a player has their inventory cleared when they join |
| autoteleport | plex.tfmextras.autotp | Teleport yourself at random, or toggle auto-teleport on join for a player |
| cake | plex.tfmextras.cake | Give a cake to everyone on the server |
| cartsit | plex.tfmextras.cartsit | Sit in the nearest minecart, or eject the player in it |
| clearchat | plex.tfmextras.clearchat | Clear the chat |
| cloudclear | plex.tfmextras.cloudclear | Clear lingering area-effect clouds |
| clownfish | plex.tfmextras.clownfish | Give a clownfish that knocks players back |
| eject | plex.tfmextras.eject | Remove all passengers from a player |
| enchant | plex.tfmextras.enchant | Enchant the item in your hand |
| emf | plex.tfmextras.emf | Make a player speak English |
| expel | plex.tfmextras.expel | Push away nearby players |
| jumppads | plex.tfmextras.jumppads | Enable jump pads for yourself or another player |
| orbit | plex.tfmextras.orbit | Launch a player upward at speed |
| randomfish | plex.tfmextras.randomfish | Spawn a random fish at your location |

The module also uses these permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.tfmextras.autotp.other | Toggle auto-teleport on join for another player |
| plex.tfmextras.clownfish.restrict | Restrict a player with `/clownfish restrict` |
| plex.tfmextras.jumppads.others | Set the jump-pad mode of another player |
