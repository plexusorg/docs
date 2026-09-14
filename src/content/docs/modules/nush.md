---
title: NUSH
description: An overview of the NUSH module for Plex
---

Turn NUSH on when a raid starts. NUSH restricts players who joined within the last five minutes, plus players who join
while it is on. Previous visits do not grant an exemption. Players with explicit staff trust or bypass permission are exempt
from automatic restriction.

Staff see a held message with a `[NUSH]` prefix. The restricted player sees the message without the prefix, and does not know
that NUSH holds it back.

The wait timer counts only online time. It pauses when the player leaves and resumes when they return. Finishing the
wait releases that restriction but does not grant permanent trust. Use `/nush allow <player>` to trust a genuine player.

NUSH caches staff-trust lookups for up to 30 seconds. Local `/nush allow` and `/nush revoke` changes take effect immediately.
A trust change made on another server can take up to 30 seconds to affect a new join.

## Permissions

| Permission | Access |
|------------|--------|
| `plex.nush.use` | Use `/nush`. To use `/nush allow` or `/nush revoke`, also grant `plex.nush.allow`. |
| `plex.nush.allow` | Use `/nush allow` and `/nush revoke` with `plex.nush.use`. |
| `plex.nush.view` | Receive the staff feed of restricted chat and blocked commands, plus NUSH alerts. While NUSH is on, also receive restricted players' normal join and leave messages. |
| `plex.nush.bypass` | Bypass automatic restriction on arrival or when staff turn NUSH on. This does not remove an existing restriction or prevent staff from restricting the player with `/nush revoke`. |

Grant `plex.nush.use` and `plex.nush.view` to staff who manage NUSH. Also grant `plex.nush.allow` to staff who can
allow or restrict players. Grant `plex.nush.bypass` separately to players who should bypass automatic restriction.
Use `/nush feed` to mute or unmute the chat and blocked-command feed. Alerts and normal join and leave messages remain visible.

## Commands

### nush on

Turns NUSH on. Restricts recent arrivals and subsequent joins, including returning players. The default lookback is five minutes.

### nush off

Turns NUSH off. This is the default state. Players can chat normally. The command also releases every player on
the list at once.

### nush status

Shows whether NUSH is on or off.

### nush time \<minutes\>

Sets the wait time in minutes for new restrictions. This is separate from the recent-join lookback.

### nush allow \<player\>

Trusts a restricted player and releases their restriction. Staff trust exempts the player from later automatic restrictions.

Old automatic verification does not count as staff trust. Older versions stored timer completion, previous visits, and staff
approval in the same flag. Approve genuine players again with `/nush allow` when needed.

### nush revoke \<player\>

Removes staff trust and restricts the player again.

## Configuration

The module writes a `config.yml` file to its data folder. The admission settings are:

| Key | Default | Description |
|-----|---------|-------------|
| server.enabled | false | Whether NUSH is on. The `/nush on` and `/nush off` commands change this value. |
| server.wait_time | 5 | The online wait time in minutes. The `/nush time` command changes this value. |
| server.recent_join_minutes | 5 | How far back to include arrivals when you turn NUSH on. |

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.
