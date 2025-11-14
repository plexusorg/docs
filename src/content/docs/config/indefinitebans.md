---
title: Indefinite Bans
description: Instructions for how to use indefinite bans within Plex
---

Plex has an indefinite ban system. Indefinite bans are reserved for players who should not automatically be unbanned.
Anyone who has access to the `indefbans.yml` file can add indefinite bans. If you are using Redis, all indefinite bans
will be uploaded to Redis on startup. From that point on, indefinite bans will be fetched from Redis instead of the
`indefbans.yml` file. **Redis is NOT required to use indefinite bans.** If you do not use Redis, Plex will fetch
indefinite bans from the `indefbans.yml` file. No matter which medium you use, you will always add new entries to the
`indefbans.yml` file. Note that there is no in-game command for adding or removing indefinite bans.

## Default file

```yaml title="/plugins/Plex/indefbans.yml"
# Plex Indefinite Bans File
# Players with their UUID / IP / Usernames in here will be indefinitely banned until removed

# If you want to get someone's UUID, use https://api.ashcon.app/mojang/v2/user/<username>
griefers:
  users:
    - "badplayer123"
    - "badplayer321"
  uuids:
    - 1dac0e92-f565-4479-afd5-38c7df5f9732 # badplayer123
  ips:
    - 123.123.123.123

# Note that these keys can be anything, they are simply to help you keep things organized.
# They are not used within the plugin. Duplicate keys are not allowed, and will not work.
bypassers:
  users:
    - "bypasser1"
  ips:
    - 321.321.321.321
    - 169.254.1.2
```

### How it works

Each entry starts with a description. This is to help you organize indefinite bans. For example, you could have a
section `griefers` for serial griefers or `bypassers` for players who have bypassed bans. The `users` section is for
usernames only, the `uuids` section is only for UUIDs, and the `ips` section is for IPs only. If you do not want to ban
a type, you do not have to include it. Note that no duplicate descriptions can exist. This means you cannot have
`bypassers` as a section twice. The actual descriptions are not used in the plugins and can be anything you like. They
do not affect the indefinite ban in any way.

### Converting indefinite bans

If you are switching from TotalFreedomMod to Plex, we have developed a tool called IBConverter to convert your existing
indefinite bans into Plex's format. For more information on IBConverter,
visit [the GitHub page](https://github.com/plexusorg/IBConverter). This tool was written in Rust. The only thing you
need to give it is your existing `indefinitebans.yml` file from TotalFreedomMod. You can download a compiled version
below:

- [IBConverter-Linux.zip](/IBConverter-Linux.zip)
- [IBConverter-Windows.zip](/IBConverter-Windows.zip)
- [IBConverter-macOS.zip](/IBConverter-macOS.zip)
