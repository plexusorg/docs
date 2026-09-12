---
title: HTTPD
description: An overview of the HTTPD module for Plex
---

The HTTPD module runs a web server inside Plex. It serves a web dashboard and a JSON API. Staff can view server data and
manage players from a browser.

## What it does

The dashboard shows live server data and admin tools:
- The online player list and server statistics, which update live.
- A player view with a live inventory. Staff can watch the inventory, clear it completely, or clear one selected slot.
  The player must be online. Staff cannot edit the items.
- Punishment history and punishment lookup by name or UUID.
- The indefinite ban list.
- A command reference, built from the commands that are registered on the server.
- Schematic upload and download for WorldEdit and FastAsyncWorldEdit.

Staff can also issue punishments from the web. From the player view, staff can ban, mute, tempban, tempmute, and freeze
a player, and clear a player's inventory. Plex records these punishments the same way as in-game punishments, with the
web as the source.

## Access and login

The HTTPD module does not use Bukkit permission nodes. Instead, it uses staff login.

These pages are open to everyone: the overview, the online player list, the command reference, the punishment search and
history, and the schematic list and download. Anyone can read the punishment history, but only a signed-in staff user
sees the IP addresses.

The player view, the indefinite ban list, and the schematic upload page need a signed-in staff user. All admin actions
need one too. A staff user is a user with the staff flag on their linked account. HTTPD uses XenForo for login through
OAuth2. A user signs in with their forum account, and HTTPD checks the staff flag from that account.

Login is off until you configure it. Set `authentication.enabled` to `true` and fill in your XenForo application
details. The shipped file holds an example redirect URL and the `totalfreedom.tf` domain. Change both values before you
turn login on. Until you do this, the protected pages stay locked.

## Configuration

The module writes a `config.yml` file to its data folder. The important settings are below.

| Key | Description |
|-----|-------------|
| server.port | The port that the web server listens on. The default is `27192`. |
| server.bind-address | The address that the web server binds to. The default is `0.0.0.0`, which answers on all interfaces. |
| server.logging.file | Whether to write a web access log to a file. The default is `true`. |
| server.logging.file-path | The access log file. The default is `httpd.log` in the module data folder. |
| server.logging.console | Whether to also write the access log to the console. The default is `false`. |
| server.logging.max-bytes | The size at which the module starts a new log file. The default is 10 MiB. |
| server.logging.retained-files | How many old log files to keep. The default is `5`. |
| server.sse.max-connections | How many live connections each live feed accepts. The default is `32`. |
| rate-limit.enabled | Turns rate limiting on or off. The default is `true`. |
| authentication.enabled | Turns staff login on or off. The default is `false`. |
| authentication.provider.redirectUri | The OAuth2 redirect URL for your site. |
| authentication.provider.xenforo.domain | The domain of your XenForo forum. |
| authentication.provider.xenforo.clientId | The client ID of your XenForo OAuth2 application. |
| authentication.provider.xenforo.clientSecret | The client secret of your XenForo OAuth2 application. |
| authentication.provider.xenforo.sessionMinutes | How long a login session lasts, in minutes. |

## Schematics

An upload must be 5 MiB or smaller. The name must end in `.schem` or `.schematic`. The part before the extension can
hold up to 30 letters, numbers, spaces, and the characters `'`, `!`, `,`, `_`, and `-`. The module refuses a name that
already exists, and a file that is not a valid schematic.

A download must be 25 MiB or smaller. The module serves four downloads at a time.

## Live pages

The server statistics, the online player list, and the player inventory update live. Each open browser tab holds one
connection for each live feed. The module accepts 32 connections at a time for each feed and refuses the rest. The
`server.sse.max-connections` key sets this number.

## Requirements

To use the schematic features, install WorldEdit or FastAsyncWorldEdit on your server. Without one of them, the schematic
routes return an error.

To use login, the web punishments, and the inventory tools, set `authentication.enabled` to `true` and configure a
XenForo OAuth2 application.
