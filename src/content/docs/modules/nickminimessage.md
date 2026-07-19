---
title: NickMiniMessage
description: An overview of the NickMiniMessage module for Plex
---

The NickMiniMessage module lets players set an EssentialsX nickname with MiniMessage formatting. This module needs
EssentialsX on the server. If EssentialsX is missing, the module does not start.

## Commands

### nickmm \<nickname\>

The permission for the command is `plex.nickmm`. You can only run it in game. Run the command with the nickname that you
want. You can use MiniMessage formatting.

Examples:
- Rainbow nickname: `/nickmm <rainbow>MyNickname`
- One color: `/nickmm <red>MyNickname`
- Two colors: `/nickmm <red>My<blue>Nickname`

You can read the full MiniMessage guide [here](https://docs.advntr.dev/minimessage/format.html).

## Permissions

The module has two permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.nickmm.ignore_length_limit | Bypass the maximum nickname length that EssentialsX sets |
| plex.nickmm.ignore_matching | Bypass the check that stops two players from using the same nickname |
