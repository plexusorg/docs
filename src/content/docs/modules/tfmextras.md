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
- `autoteleport` teleports you at random, or toggles auto-teleport on join for a named player.
- `clearchat` clears the chat.
- `enchant` enchants the item in your hand.

Fun commands:
- `cake` gives a cake to everyone.
- `cartsit` sits you in the nearest minecart.
- `clownfish` gives a clownfish that knocks players back.
- `expel` pushes away nearby players.
- `jumppads` enables jump pads for you or another player.
- `orbit <player>` launches a player upward at speed.
- `randomfish` spawns a random fish.

Cleanup commands:
- `cloudclear` clears lingering area-effect clouds.
- `eject <player>` removes all passengers from a player.

## Configuration

The module writes a `config.yml` file to its data folder. It controls the jump-pad strength, the admin-info text, the
lists of players who are cleared or teleported on join, whether unsafe enchantments are allowed, and the clownfish
settings.
