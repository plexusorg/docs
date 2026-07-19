---
title: LibsDisguises
description: An overview of the LibsDisguises module for Plex
---

The LibsDisguises module adds admin controls for the LibsDisguises plugin. It adds two commands, and it checks disguises
to keep them within safe limits. For example, it blocks fishing-hook disguises, and it caps disguise name length and
size. This module needs the LibsDisguises plugin. If LibsDisguises is missing, the module does not start.

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
| plex.libsdisguises.player | Keep the fake name and skin when disguised as another player. Without it, the disguise shows the real name and skin. |
