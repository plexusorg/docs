---
title: HTTPD
description: An overview of the HTTPD module for Plex
---

The HTTPD module sets up a basic web server to display information from Plex.

## Endpoints

The endpoints are what allow you to query the server and see information. All endpoints are formatted in JSON.

### /api/commands

This endpoint shows a list of registered commands on the server. It is an automatically generated help page. It is up to
plugin authors to provide accurate information about their plugins and the commands they provide.

### /api/indefbans

Displays a list of indefinite players in JSON format. This page is only accessible if your IP address is linked to your
account in game. It will check if the player has the `plex.httpd.indefbans.access`.

### /api/list

This will display a list of online players in JSON format. This is accessible to everyone.

### /api/punishments

If you go this page, it will ask you to enter a UUID. When you enter a valid UUID in the search box, it will display
that user's punishments in JSON format. An example URL would be `/api/punishments/78408086-1991-4c33-a571-d8fa325465b2`.
If your IP is not registered to a user in game, it cannot determine if you have the necessary permissions. The player
will need to have the `plex.httpd.punishments.access` to see IP addresses.

### /api/schematics/download

This page allows anyone to download schematics from the server. No permission is required to access the page.

### /api/schematics/upload

This page allows players who have the permission `plex.httpd.schematics.upload` in game to upload schematics.
