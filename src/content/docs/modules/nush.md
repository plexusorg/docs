---
title: NUSH
description: An overview of the NUSH module for Plex
---

The NUSH module helps you stop raids. When a new player joins, only staff and the player can see the player's chat
messages. Staff can then let the player chat where everyone sees it. If the player spams, staff can ban the player, and
regular players do not see the spam. You can also set a wait time, so a new player can chat with everyone after that time
without staff action.

## Permissions

The `plex.nush.use` permission grants access to the NUSH command and all of its subcommands. The `plex.nush.view`
permission lets a player see the chat messages that NUSH holds back. Give both permissions to your staff, and give
neither to regular players.

## Commands

### nush on

Turns NUSH on. New players wait before their chat messages reach everyone.

### nush off

Turns NUSH off. This is the default state. All new players can chat normally.

### nush status

Shows whether NUSH is on or off.

### nush time \<minutes\>

Sets the wait time in minutes. A new player must wait this long before the player can chat with everyone. This gives
staff time to react if the player spams on join.

### nush remove \<player\>

Removes a player from the NUSH list. NUSH adds new players automatically. If a real new player is caught during a raid,
you can remove the player so the player can chat normally.

## Configuration

The module writes a `config.yml` file to its data folder with two options.

| Key | Default | Description |
|-----|---------|-------------|
| server.enabled | false | Whether NUSH is on. The `/nush on` and `/nush off` commands change this value. |
| server.wait_time | 5 | The wait time in minutes for a new player. The `/nush time` command changes this value. |
