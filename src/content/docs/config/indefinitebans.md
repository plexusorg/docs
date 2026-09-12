---
title: Indefinite Bans
description: Instructions for how to use indefinite bans within Plex
---

Plex has an indefinite ban system. Indefinite bans are reserved for players who should not automatically be unbanned.
Plex reads the indefinite bans from the `/plugins/Plex/indefbans.yml` file. Redis is not involved. If you run several
servers on Redis, Plex only tells the other servers to refresh their ban decisions.

You can add an indefinite ban in game:

- `/banname <username> [reason]` bans a username.
- `/banip <ip or player> [reason]` bans an IP address. Give a player name to ban their current or last known IP address.

Both commands write the new entry into `indefbans.yml`. There is no command to remove an indefinite ban. Delete the
entry from the file and run `/plex reload`.

## Default file

```yaml title="/plugins/Plex/indefbans.yml"
# Plex Indefinite Bans File
# Players with their UUID / IP / Usernames in here will be indefinitely banned until removed
# Root keys are organizational labels only, they do not affect ban matching.
# Choose any non-empty, unique label without dots (.), including numbers or names.
# Quote labels containing YAML punctuation, such as "case: repeated evasion".
# Each block can contain multiple related usernames, UUIDs, and IPs.

# If you want to get someone's UUID, use https://api.ashcon.app/mojang/v2/user/<username>
griefers:
  # The reason is optional. If set, it is shown on the ban screen and in the HTTPD's indefinite bans page.
  reason: "Repeated griefing"
  users:
    - "badplayer123"
    - "badplayer321"
  uuids:
    - 1dac0e92-f565-4479-afd5-38c7df5f9732 # badplayer123
  ips:
    - 123.123.123.123

bypassers:
  users:
    - "bypasser1"
  ips:
    - 321.321.321.321
    - 169.254.1.2
```

### How it works

Each block starts with a label. The label helps you organize indefinite bans. For example, you could have a block
`griefers` for serial griefers or `bypassers` for players who have bypassed bans. Plex does not use the label to match a
ban, so you can name it anything you like. A label must be unique, so you cannot have `bypassers` twice. A label must not
contain a dot. Put quotation marks around a label that contains a colon, such as `"case: repeated evasion"`.

Each block takes an optional `reason`. Plex shows the reason on the ban screen. The `users` section is for usernames
only, the `uuids` section is only for UUIDs, and the `ips` section is for IPs only. If you do not want to ban a type, you
do not have to include it.

### Converting indefinite bans

If you are switching from TotalFreedomMod to Plex, we have developed a tool called IBConverter to convert your existing
indefinite bans into Plex's format. For more information on IBConverter,
visit [the GitHub page](https://github.com/plexusorg/IBConverter). This tool was written in Rust. The only thing you
need to give it is your existing `indefinitebans.yml` file from TotalFreedomMod. You can download a compiled version
below:

- [IBConverter-Linux.zip](/IBConverter-Linux.zip)
- [IBConverter-Windows.zip](/IBConverter-Windows.zip)
- [IBConverter-macOS.zip](/IBConverter-macOS.zip)
