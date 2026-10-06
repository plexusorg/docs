---
title: NUSH
description: An overview of the NUSH module for Plex
---

NUSH turns itself on when it detects a raid. Staff can also turn it on with `/nush on`. When staff turn NUSH on, it
restricts players who joined within the last five minutes, plus players who join while it is on. Previous visits do not
grant an exemption. Players with explicit staff trust or bypass permission are exempt
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
| `plex.nush.view` | Receive the staff feed of restricted players' chat, WorldEdit commands, and `block_on_mute` commands, plus NUSH alerts. While NUSH is on, also receive restricted players' normal join and leave messages. |
| `plex.nush.bypass` | Bypass automatic restriction on arrival, when staff turn NUSH on, or when NUSH detects a raid. This does not remove an existing restriction or prevent staff from restricting the player with `/nush revoke`. |

Grant `plex.nush.use` and `plex.nush.view` to staff who manage NUSH. Also grant `plex.nush.allow` to staff who can
allow or restrict players. Grant `plex.nush.bypass` separately to players who should bypass automatic restriction.
Use `/nush feed` to mute or unmute the chat and command feed. Alerts and normal join and leave messages remain visible.

## Raid detection

NUSH always watches for a sudden rise in joins, chat messages, or commands. It learns the normal traffic of your server
and compares new traffic with it. A rise must reach at least 10 joins in 10 seconds, 30 chat messages in 5 seconds, or
40 commands in 2 seconds. Players with staff trust or bypass permission do not count.

When NUSH detects a raid, it turns itself on and restricts the players who caused the rise. Players who join after that
are also restricted. Staff with `plex.nush.view` see an alert. NUSH stays on until staff run `/nush off`. When the
traffic stays low for 120 seconds, staff see a second alert, but NUSH stays on.

Raid detection does not change `server.enabled`. After a restart, NUSH uses the saved value again. NUSH does not count
joins in the first 60 seconds after the module starts, because many players can join when a server starts.

## WorldEdit commands

NUSH does not block most commands from restricted players. It watches their WorldEdit commands and shows them in the
staff feed. With FastAsyncWorldEdit, the command seems to work for the player, but the world does not change. Without
FastAsyncWorldEdit, NUSH cancels the command. NUSH always cancels `regen`, `butcher`, `remove`, `delchunks`, `restore`,
and `snapshot`. NUSH also cancels the commands in the Plex `block_on_mute` list.

To use FastAsyncWorldEdit with NUSH, add the NUSH class to `extent.allowed-plugins` in
`plugins/FastAsyncWorldEdit/config.yml`, then restart the server:

```yaml
extent:
  allowed-plugins:
    - dev.plex.nush.ShadowExtent
```

If you do not add it, NUSH logs an error at startup and cancels WorldEdit commands instead.

## Commands

### nush on

Turns NUSH on. Restricts recent arrivals and subsequent joins, including returning players. The default lookback is five minutes.

### nush off

Turns NUSH off. Players can chat normally. The command also releases every player on the list at once. Use this
command to end an automatic raid response.

### nush status

Shows whether NUSH is on or off, how many players are restricted, and the state of raid detection.

### nush kick

Disconnects every restricted player who is online.

### nush list

Shows each restricted player with the time left and how many chat messages and WorldEdit commands they sent.

### nush log \<player\>

Shows the stored chat and command log of a restricted player. The `log.size` setting sets how many entries NUSH keeps
for each player. The default is 50.

### nush feed

Mutes or unmutes the chat and command feed for you. Alerts remain visible.

### nush time \<minutes\>

Sets the wait time in minutes for new restrictions. This is separate from the recent-join lookback.

### nush allow \<player\>

Trusts a restricted player and releases their restriction. Staff trust exempts the player from later automatic restrictions.

Only `/nush allow` grants staff trust. Finishing the wait time does not.

### nush revoke \<player\>

Removes staff trust and restricts the player again.

## Configuration

The module writes a `config.yml` file to its data folder. The admission settings are:

| Key | Default | Description |
|-----|---------|-------------|
| server.enabled | false | Whether NUSH is on when the server starts. The `/nush on` and `/nush off` commands change this value. Raid detection does not change it. |
| server.wait_time | 5 | The online wait time in minutes. The `/nush time` command changes this value. |
| server.recent_join_minutes | 5 | How far back to include arrivals when you turn NUSH on. |

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.
