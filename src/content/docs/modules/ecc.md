---
title: Module-ECC
description: Raid protection and chat safety for Plex
---

Module-ECC (Extra Chat Controls) replaces Module-NUSH and keeps its config. It has two parts: NUSH raid protection and chat safety.

## NUSH

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

### Permissions

| Permission | Access |
|------------|--------|
| `plex.nush.use` | Use `/nush`. To use `/nush allow` or `/nush revoke`, also grant `plex.nush.allow`. |
| `plex.nush.allow` | Use `/nush allow` and `/nush revoke` with `plex.nush.use`. |
| `plex.nush.view` | Receive the staff feed of restricted players' chat, WorldEdit commands, and `block_on_mute` commands, plus NUSH alerts. While NUSH is on, also receive restricted players' normal join and leave messages. |
| `plex.nush.bypass` | Bypass automatic restriction on arrival, when staff turn NUSH on, or when NUSH detects a raid. This does not remove an existing restriction or prevent staff from restricting the player with `/nush revoke`. |

Grant `plex.nush.use` and `plex.nush.view` to staff who manage NUSH. Also grant `plex.nush.allow` to staff who can
allow or restrict players. Grant `plex.nush.bypass` separately to players who should bypass automatic restriction.
Use `/nush feed` to mute or unmute the chat and command feed. Alerts and normal join and leave messages remain visible.

### Raid detection

NUSH always watches for a sudden rise in joins, chat messages, or commands. It learns the normal traffic of your server
and compares new traffic with it. A rise must reach at least 10 joins in 10 seconds, 30 chat messages in 5 seconds, or
40 commands in 2 seconds. Players with staff trust or bypass permission do not count.

When NUSH detects a raid, it turns itself on and restricts the players who caused the rise. Players who join after that
are also restricted. Staff with `plex.nush.view` see an alert. NUSH stays on until staff run `/nush off`. When the
traffic stays low for 120 seconds, staff see a second alert, but NUSH stays on.

Raid detection does not change `server.enabled`. After a restart, NUSH uses the saved value again. NUSH does not count
joins in the first 60 seconds after the module starts, because many players can join when a server starts.

### WorldEdit commands

NUSH does not block most commands from restricted players. It watches their WorldEdit commands and shows them in the
staff feed. With FastAsyncWorldEdit, the command seems to work for the player, but the world does not change. Without
FastAsyncWorldEdit, NUSH cancels the command. NUSH always cancels `regen`, `butcher`, `remove`, `delchunks`, `restore`,
and `snapshot`. NUSH also cancels the commands in the Plex `block_on_mute` list.

To use FastAsyncWorldEdit with NUSH, add the NUSH class to `extent.allowed-plugins` in
`plugins/FastAsyncWorldEdit/config.yml`, then restart the server:

```yaml
extent:
  allowed-plugins:
    - dev.plex.ecc.nush.ShadowExtent
```

If you do not add it, NUSH logs an error at startup and cancels WorldEdit commands instead.

### Commands

#### nush on

Turns NUSH on. Restricts recent arrivals and subsequent joins, including returning players. The default lookback is five minutes.

#### nush off

Turns NUSH off. Players can chat normally. The command also releases every player on the list at once. Use this
command to end an automatic raid response.

#### nush status

Shows whether NUSH is on or off, how many players are restricted, and the state of raid detection.

#### nush kick

Disconnects every restricted player who is online.

#### nush list

Shows each restricted player with the time left and how many chat messages and WorldEdit commands they sent.

#### nush log \<player\>

Shows the stored chat and command log of a restricted player. The `log.size` setting sets how many entries NUSH keeps
for each player. The default is 50.

#### nush feed

Mutes or unmutes the chat and command feed for you. Alerts remain visible.

#### nush time \<minutes\>

Sets the wait time in minutes for new restrictions. This is separate from the recent-join lookback.

#### nush allow \<player\>

Trusts a restricted player and releases their restriction. Staff trust exempts the player from later automatic restrictions.

Only `/nush allow` grants staff trust. Finishing the wait time does not.

#### nush revoke \<player\>

Removes staff trust and restricts the player again.

### Configuration

The module writes a `config.yml` file to its data folder. The admission settings are:

| Key | Default | Description |
|-----|---------|-------------|
| server.enabled | false | Whether NUSH is on when the server starts. The `/nush on` and `/nush off` commands change this value. Raid detection does not change it. |
| server.wait_time | 5 | The online wait time in minutes. The `/nush time` command changes this value. |
| server.recent_join_minutes | 5 | How far back to include arrivals when you turn NUSH on. |

The module also writes a `messages.yml` file to its data folder. Edit this file to change the messages that the module
sends.

## Chat safety

Chat safety checks what players say for sexual talk and grooming. It is off by default.

When a conversation looks like a problem, the sender is shadow muted: they see their own messages, and nobody else does.
A second check then reviews the conversation. Players who are not involved are unmuted. Players the review finds at fault
or at risk are banned indefinitely by UUID, name, and IP. The ban screen is fixed, and the player is kicked a few
minutes later. A player who is paused for their own safety sees a welfare screen that points to
`totalfreedom.tf/pages/welfare` instead of a ban reason.

Module-ECC reads public chat, private messages and mail sent through EssentialsX, `/me`, `/nick`, signs, books, anvil
names, and module chat channels such as guild chat. Staff with `plex.ecc.chat.bypass` are never checked.

### Requirements

Module-ECC only sends what players say and carries out the result. ECC-Server makes every decision. It runs a
classifier on your machine and judges conversations it flags with a second model on Amazon Bedrock. You need:

- ECC-Server on the same machine as the game server, or on its host when the game server runs in a container
- A Weights & Biases API key, which ECC-Server uses to download its model files
- An Amazon Bedrock API key with access to the model ECC-Server calls

Chat safety needs none of this while it is off.

### Set up

ECC-Server is a Debian package for amd64 (Debian, Ubuntu) from the Telesphorepo apt repository.

1. Open `https://telesphorepo.com/debian/ecc-server` and use the "Use this repository" tab. It gives you the apt line and
   the signing key setup for your machine. Add both.
2. Install the package. It starts the `ecc-server` service.

   ```sh
   sudo apt update
   sudo apt install ecc-server
   ```

3. Store your keys. Each command asks for the key at a hidden prompt, checks it, and stores it encrypted on this machine.

   ```sh
   sudo ecc-server wandb login
   sudo ecc-server bedrock login
   ```

4. Run `sudo ecc-server status`. On first start, ECC-Server downloads its model files, about 3 GB, so the status
   reports not ready until the download finishes. Wait for it to report ready.
5. If the game server runs in a Docker container, set `listen` in `/etc/ecc-server/config.toml` to the host's address
   on the container's network, such as `listen = "172.17.0.1:8790"` for the default bridge, then run
   `sudo systemctl restart ecc-server`. Keep that address off any network the game server does not need.
6. Run `sudo ecc-server token` and copy what it prints.
7. In the module's `config.yml`, set `chat_safety.token` to that token, set `chat_safety.model_host` if you changed
   `listen`, and set `chat_safety.enabled` to `true`. Then run `/plex modules reload` or restart the server.
8. Run `/ecc status` in game to confirm the link to ECC-Server.

Bedrock API keys expire. When ECC-Server reports that Bedrock refuses its key, run `sudo ecc-server bedrock login` again.

### Maintain ECC-Server

| Command | Use |
|---------|-----|
| `sudo ecc-server status` | Shows whether the server is ready, the model download, Bedrock, and the players it is checking. |
| `sudo ecc-server update` | Checks for new model files now. ECC-Server also checks every 10 minutes. |
| `sudo ecc-server token` | Prints the token the module needs in `chat_safety.token`. |
| `sudo -u ecc-server ecc-server rollback` | Switches back to the previous model files. |
| `sudo apt update && sudo apt upgrade` | Upgrades ECC-Server. Your `config.toml` and keys stay. |

ECC-Server reads `/etc/ecc-server/config.toml`. If the file has no `server` key, add one with a short name for this game
server, using only `a-z`, `0-9`, `-` and `_`. ECC-Server does not start without it.

### Chat safety configuration

| Key | Default | Description |
|-----|---------|-------------|
| chat_safety.enabled | false | Turns chat safety on. While false, the module reads no other chat safety setting. |
| chat_safety.model_host | `http://127.0.0.1:8790` | ECC-Server's address as the game server reaches it; it matches `listen` in ECC-Server's config. |
| chat_safety.token | (empty) | The output of `sudo ecc-server token`. Chat safety stays off while it is empty. |

### /ecc status

Shows whether the classifier is ready and how many messages wait to be scored; whether the Kimi review works and
whom it is checking or still unsure about; how many players are muted, and whether model updates work. While
ECC-Server is not answering, it shows for how long instead. Requires `plex.ecc.status`.

### Chat safety alerts

Every chat safety decision is shown as it happens, in the console and to online staff with `plex.ecc.alerts`:

- a player is muted, with the channel and the line that started the check
- a player stays muted while the check is not sure yet (once per check)
- a player is unmuted, and why: not involved, still not sure when the time limit ran out, or their ban's kick time came
- a player is banned, as an offender or at risk, with the cause and the minutes until the kick, or offline

Run `/ecc alerts` to stop seeing alerts until you leave the server; run it again to see them. Staff given
`plex.ecc.alerts` while online see alerts once they rejoin or run `/ecc alerts`. Requires `plex.ecc.alerts`.

On the ECC-Server machine, `journalctl -u ecc-server -f` shows each decision without the chat text.

### Chat safety permissions

| Permission | Access |
|------------|--------|
| `plex.ecc.status` | Use `/ecc status`. |
| `plex.ecc.alerts` | See chat safety alerts, and use `/ecc alerts`. Grant it to staff. |
| `plex.ecc.chat.bypass` | Never checked by chat safety. Grant it to staff. |

### When ECC-Server is unreachable

Chat is never blocked. The module keeps the messages and sends them when ECC-Server returns, and actions ECC-Server could
not deliver wait until the module confirms them. Players who are muted stay muted. `/ecc status` shows the link as
unreachable and how many messages are waiting.