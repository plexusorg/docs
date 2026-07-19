---
title: HTTPD
description: An overview of the HTTPD module for Plex
---

The HTTPD module runs a web server inside Plex. It serves a web dashboard and a JSON API. Staff can view server data and
manage players from a browser.

## What it does

The dashboard shows live server data and admin tools:
- The online player list and server statistics, which update live.
- A player view with inventory. Staff can view and edit a player's inventory.
- Punishment history and punishment lookup by name or UUID.
- The indefinite ban list.
- A command reference, built from the commands that are registered on the server.
- Schematic upload and download for WorldEdit and FastAsyncWorldEdit.

Staff can also issue punishments from the web. From the player view, staff can ban, mute, tempban, tempmute, and freeze
a player, and clear a player's inventory. Plex records these punishments the same way as in-game punishments, with the
web as the source.

## Access and login

The HTTPD module does not use Bukkit permission nodes. Instead, it uses staff login.

Some pages are public, such as the online player list and the command reference. The protected pages and all admin
actions need a signed-in user with the staff flag on their linked account. HTTPD uses XenForo for login through OAuth2.
A user signs in with their forum account, and HTTPD checks the staff flag from that account.

Login is off until you configure it. Set `authentication.enabled` to `true` and fill in your XenForo application
details. Until you do this, the protected pages stay locked.

## Configuration

The module writes a `config.yml` file to its data folder. The important settings are below.

| Key | Description |
|-----|-------------|
| server.port | The port that the web server listens on. The default is `27192`. |
| server.bind-address | The address that the web server binds to. |
| rate-limit.enabled | Turns rate limiting on or off. |
| authentication.enabled | Turns staff login on or off. The default is `false`. |
| authentication.provider.redirectUri | The OAuth2 redirect URL for your site. |
| authentication.provider.xenforo.domain | The domain of your XenForo forum. |
| authentication.provider.xenforo.clientId | The client ID of your XenForo OAuth2 application. |
| authentication.provider.xenforo.clientSecret | The client secret of your XenForo OAuth2 application. |
| authentication.provider.xenforo.sessionMinutes | How long a login session lasts, in minutes. |

## Requirements

To use the schematic features, install WorldEdit or FastAsyncWorldEdit on your server. Without one of them, the schematic
routes return an error.

To use login, the web punishments, and the inventory tools, set `authentication.enabled` to `true` and configure a
XenForo OAuth2 application.
