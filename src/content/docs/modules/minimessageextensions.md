---
title: MiniMessageExtensions
description: An overview of the MiniMessageExtensions module for Plex
---

The MiniMessageExtensions module lets players set an EssentialsX nickname with MiniMessage formatting. It also lets
players set a color style for their chat messages.

The `/nickmm` command needs EssentialsX on the server. If EssentialsX is missing, the module still starts and shows a
warning in the console. `/chatstyle` still works, but `/nickmm` tells the player that nicknames are not available.

## Commands

### nickmm \<nickname\>

Alias: `nickminimessage`. The permission for the command is `plex.nickmm`. You can only run it in game. Run the command
with the nickname that you want. You can use MiniMessage formatting.

The nickname must be one word. The command ignores all text after the first space.

Examples:
- Rainbow nickname: `/nickmm <rainbow>MyNickname`
- One color: `/nickmm <red>MyNickname`
- Two colors: `/nickmm <red>My<blue>Nickname`

You can read the full MiniMessage guide [here](https://docs.advntr.dev/minimessage/format.html).

These tags work in a nickname: colors, `shadow`, `font`, `bold`, `italic`, `underlined`, `strikethrough`, `reset`,
`gradient`, `rainbow`, `transition`, `pride`, `sprite`, and `head`. Other tags, such as `click`, `hover`, `obfuscated`,
and `newline`, do not work. They stay in the nickname as plain text.

### chatstyle \<tag | off\>

The permission for the command is `plex.chatstyle`. You can only run it in game. Run the command with one or more
MiniMessage color tags. The module saves your chat style in the Plex database. It then applies the style to your chat
messages.

A chat style can only use these tags: colors, `shadow`, `gradient`, `rainbow`, `transition`, and `pride`. A chat style
cannot contain text, and it can have a maximum of 255 characters. After you set a style, the command shows a sample
message in your new style.

Examples:
- Gradient: `/chatstyle <gradient:red:blue>`
- Rainbow: `/chatstyle <rainbow>`
- One color: `/chatstyle <#ff8800>`

Run `/chatstyle off` to remove your chat style.

## Permissions

The module has two permission nodes that are not tied to a command.

| Permission | Description |
|------------|-------------|
| plex.nickmm.ignore_length_limit | Bypass the maximum nickname length that EssentialsX sets |
| plex.nickmm.ignore_matching | Bypass the check that stops two players from using the same nickname |
