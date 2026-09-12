---
title: LibsDisguises
description: An overview of the LibsDisguises module for Plex
---

The LibsDisguises module adds admin controls for the LibsDisguises plugin. It adds two commands, and it checks every
disguise to keep it within safe limits. It blocks fishing-hook disguises. It limits the disguise name to 32 characters.
It limits the size of a slime or phantom disguise, the radius of an area-effect-cloud disguise, and the invulnerability
of a wither disguise. It stops an ender dragon disguise from roaring before it attacks. It limits how far a disguise can
move up or down. It does not let a player use a disguise to hide. This module needs the LibsDisguises plugin. If
LibsDisguises is missing, the module does not start.

## Commands

### disguisetoggle

Alias: `dtoggle`. The permission is `plex.libsdisguises.disguisetoggle`. This command toggles LibsDisguises for the whole
server. When LibsDisguises is off, all players are undisguised, and no one can use a LibsDisguises command until you turn
it back on.

### undisguiseall

Aliases: `undisall`, `uall`. The permission is `plex.libsdisguises.undisguiseall`. This command undisguises players. Add
`-a` to also undisguise players who have the bypass permission.

## Permissions

The module has two permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.libsdisguises.bypass | Exempt a player from `/undisguiseall`. The `-a` flag ignores this permission. |
| plex.libsdisguises.player | Keep the fake name when disguised as another player. Without it, the disguise shows the real name but keeps the fake skin. |

## Configuration

The module writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module sends.
The module has no other configuration.
