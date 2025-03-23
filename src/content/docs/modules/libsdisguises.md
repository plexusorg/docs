---
title: LibsDisguises
description: An overview of the LibsDisguises module for Plex
---

The LibsDisguises module adds two new commands: `undisguiseall` and `disguisetoggle`.

## Commands

### undisguiseall

The `undisguiseall` command disguises all non-admins. You can optionally add `-a` to undisguise all players including
admins. If your server is using permissions, the permission to bypass being undisguised is `plex.libsdisguises.bypass`.
This permission will not bypass `-a`, however. The permission to use the command itself is
`plex.libsdisguises.undisguiseall`

### disguisetoggle

The `disguisetoggle` command toggles LibsDisguises. It allows players with the `plex.libsdisguises.disguisetoggle`
permission to toggle LibsDisguises. When LibsDisguises is disabled, all players are undisguised and no commands from
LibsDisguises can be used until re-enabled.
