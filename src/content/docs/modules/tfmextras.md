---
title: TFMExtras
description: An overview of the TFMExtras module for Plex
---

The TFMExtras module adds extra commands in the style of TotalFreedomMod. These are fun and admin commands that do not
fit the core plugin. The module needs no other plugins.

## Commands

See the [permissions page](/docs/permissions) for the full list of commands and their permission nodes. The commands
fall into a few groups.

Admin and player tools:
- `admininfo` shows how to apply for admin.
- `autoclear <player>` toggles whether a player has their inventory cleared when they join.
- `autoteleport` teleports you at random. `autoteleport <player>` toggles auto-teleport on join for a named player.
- `clearchat` clears the chat.
- `effect give <player> <effect> [seconds|infinite] [amplifier] [hideParticles]` gives a potion effect.
- `effect clear [player] [effect]` clears one potion effect or all of them.
- `emf <player>` strikes a player with lightning and kills them.
- `enchant` enchants the item in your hand.

Fun commands:
- `cake` gives a cake to everyone.
- `clownfish` gives a clownfish that knocks players back.
- `cookie` gives a cookie to everyone.
- `expel` pushes away nearby players.
- `jumppads` enables jump pads for you or another player.
- `orbit [power] [player|-a]` keeps a player floating upward in survival mode. If you do not name a player, it affects
  you. Use `-a` to affect every online player. The power goes from 1 to 150, and the default is 100. Use
  `orbit stop [player|-a]` to end it.
- `paintball [color]` gives snowballs that paint whatever they hit. The paint fades after a few seconds.
- `randomfish` spawns a random fish.
- `rocket [player|-a]` launches a player upward on a trail of flames, sets off a firework at the top, and lets the player
  fall slowly.
- `trail` toggles a rainbow trail under your feet that fades behind you.

Player effects:
- `cage <player> [outer] [inner]` traps a player in a cage of glass, or of the blocks you name. The player cannot move
  or teleport out. The outer wall must be a solid block that does not fall and is not TNT. The inner fill follows the
  same rule, but it can also be air or water. Waterlogged blocks are not allowed.
- `uncage <player>` removes the cage and puts the old blocks back.
- Use `disco [seconds|stop] [player|-a]` to start or stop a dance floor with music and color changes. If you do not
  name a player, it affects you. Use `-a` to affect every online player. It lasts 10 seconds unless you give a time.
  Use `disco stop` to end it early.
- `gravity <low|normal|high|reset|value> [player|-a]` changes how fast a player falls. If you do not name a player, it
  affects you. Use `-a` to affect every online player. A custom value goes from 0.01 to 1.0. `normal` and `reset`
  restore the normal value.
- `size <scale|reset> [player|-a]` makes a player larger or smaller, from 0.1 to 10. If you do not name a player, it
  affects you. Use `-a` to affect every online player. `reset` restores the normal size.

Cleanup commands:
- `cloudclear` clears lingering area-effect clouds.
- `eject` removes all passengers from you.

The trail, paintball, cage, and disco commands only change blocks for a short time. Trail blocks and paintball splats
fade on their own. A cage goes away when you run `uncage` or the player leaves. A dance floor goes away when it ends or
the player leaves. The module puts every
original block back, and it also does this when the module unloads. Size and gravity changes last until the player
leaves the server or the module unloads.

For orbit, rocket, size, and gravity, grant the base command permission for self-use.
Also grant the matching `.others` permission to staff who can target other players or everyone with `-a`. Keep cage, cake, and cookie for admins.
Grant `plex.tfmextras.disco` for self-use. Also grant `plex.tfmextras.disco.others` to staff who can target another player or everyone.
Use `/rocket` to launch yourself. You receive a private reply. To launch someone else, use `/rocket <player>` with
`plex.tfmextras.rocket.others`; this keeps the admin announcement.

## Configuration

The module writes a `config.yml` file to its data folder. It controls the jump-pad strength, the admin-info text, the
lists of players who are cleared or teleported on join, and the clownfish settings. The `fun` section sets how long trail blocks and paintball splats stay before they fade, and the longest disco
a command can start.
