---
title: Command Blocker
description: Instructions for how to use the command blocker within Plex
---

Plex features an advanced command blocker with support for matching and RegEx statements. 

## Default file

The default `commands.yml` file is below.

```yaml title="/plugins/Plex/commands.yml"
#
# Command Blocker
#
# Format:
#   - "<regex or match>:<rank>:command name no slash:Block message"
#
# Symbols to use:
#   - r for RegEx
#   - m for matching
#   - The ranks are "e" for everyone, "s" for senior admin, and "a" for admin
#   - MATCHING MODE: The command is just the command without slashes. Optional arguments are specified as well. It also accepts full plugins via specifying the plugin name followed by a ":" (e.g. "viaversion:")
#   - REGEX MODE: The command is regex that matches the desired command. It matches case insensitively.
#   - Finally the block message MUST NOT CONTAIN ":". Use _ to use the default command blocked message as specified in messages.yml, or you can optionally put your own in
#
# So these would be valid:
#   - "m:e:mail sendall:You cannot send messages to everyone on the server"
#   - "r:e:^[A-z]*:[A-z]*::Plugin specific commands are disabled"
commands:
  - "m:a:break:_"
  - "m:a:delchunks:_"
  - "m:a:kickall:_"
  - "m:a:locatebiome:_"
  - "m:a:playsound:_"
  - "m:a:setspawn:_"
  - "m:a:socialspy:_"
  - "m:a:tpall:_"
  - "m:e:/eval:_"
  - "m:e:advancement:_"
  - "m:e:antioch:_"
  - "m:e:backup:_"
  - "m:e:ban-ip:_"
  - "m:e:co purge:_"
  - "m:e:d minecart_command:_"
  - "m:e:debug:_"
  - "m:e:defaultgamemode:<gray>The default gamemode should not be changed."
  - "m:e:deljail:_"
  - "m:e:disguiseradius:_"
  - "m:e:fill:_"
  - "m:e:jails:_"
  - "m:e:mail sendall:<red>You cannot send messages to everyone on the server."
  - "m:e:mail sendtempall:<red>You cannot send messages to everyone on the server."
  - "m:e:paper:_"
  - "m:e:pardon-ip:_"
  - "m:e:pardon:_"
  - "m:e:save-off:_"
  - "m:e:save-on:_"
  - "m:e:setjail:_"
  - "m:e:spigot reload:_"
  - "m:e:time:<gray>Server-side time changing is disabled. Please use /ptime to set your own personal time."
  - "m:e:togglejail:_"
  - "m:e:undisguiseradius:_"
  - "m:e:weather:_"
  - "m:e:worldborder:<gray>The worldborder does not need to be changed. This command is disabled."
  - "r:a:^(co|core|coreprotect) (rb|rollback|l|lookup|rl|reload):_"
  - "r:e:^[A-z]*:[A-z]*::<gray>Plugin specific commands are disabled."

# These commands will be blocked when a player is muted or when chat is toggled off.
block_on_mute:
  - me
  - say
  - msg
  - reply
  - mail
```

## The symbols

- `r` represents RegEx and `m` represents matching.
- The ranks are `e` to block for everyone, `a` to block for admins and above, and `s` to block for senior admins and
  above.

## The format

An example formatted entry in the `commands.yml` file would look like this:
`"m:e:mail sendall:You cannot send messages to everyone on the server"`
The `m` will match the `mail sendall` command. The `e` stands for everyone, so it will block this command for everyone.
The last part is the message. If you use `_` as the blocked message, it will use the default message specified in
`messages.yml`
