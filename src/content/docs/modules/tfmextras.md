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
- `orbit <player> [power]` keeps a player floating upward in survival mode until you run `orbit <player> stop`.
- `paintball [color]` gives snowballs that paint whatever they hit. The paint fades after a few seconds.
- `randomfish` spawns a random fish.
- `rocket [player]` launches a player upward on a trail of flames, sets off a firework at the top, and lets the player
  fall slowly.
- `trail` toggles a rainbow trail under your feet that fades behind you.

Player effects:
- `cage <player> [outer] [inner]` traps a player in a cage of glass, or of the blocks you name. The player cannot move
  or teleport out. `cage <player> off` removes the cage. Blocks that fall, flow, or explode are not allowed.
- Use `disco [seconds]` to start your own dance floor with music and color changes. It lasts 10 seconds unless you
  give a time. Use `disco stop` to end it early.
- Use `disco everyone [seconds|stop]` to start or stop dance floors for all online players. You need both
  `plex.tfmextras.disco` and `plex.tfmextras.disco.everyone`. You cannot target one other player.
- `gravity <player> <low|normal|high|value>` changes how fast a player falls. `reset` restores the normal value.
- `size <player> <scale>` makes a player larger or smaller, from 0.1 to 10. `reset` restores the normal size.

Cleanup commands:
- `cloudclear` clears lingering area-effect clouds.
- `eject` removes all passengers from you.

The trail, paintball, cage, and disco commands only change blocks for a short time. Trail blocks and paintball splats
fade on their own. A cage or a dance floor goes away when the command ends or the player leaves. The module puts every
original block back, and it also does this when the module unloads. Size and gravity changes last until the player
leaves the server or the module unloads.

For orbit, rocket, size, and gravity, grant the base command permission for self-use.
Also grant the matching `.others` permission to staff who can target other players. Keep cage, cake, and cookie for admins.
Grant `plex.tfmextras.disco` for self-use. Also grant `plex.tfmextras.disco.everyone` to staff who can affect everyone.
Use `/rocket` to launch yourself. You receive a private reply. To launch someone else, use `/rocket <player>` with
`plex.tfmextras.rocket.others`; this keeps the admin announcement.

## Configuration

The module writes a `config.yml` file to its data folder. It controls the jump-pad strength, the admin-info text, the
lists of players who are cleared or teleported on join, and the clownfish settings. The `fun` section sets how long trail blocks and paintball splats stay before they fade, and the longest disco
a command can start.
