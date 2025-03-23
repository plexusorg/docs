---
title: NUSH
description: An overview of the NUSH module for Plex
---

The NUSH (New User Silent Hush) module prevents raids from happening on servers. When a new player joins, only admins
and themselves can see their chat messages. Admins can then choose to allow a player to chat where everyone can see it.
Alternatively, if they start spamming, they can be banned while regular players do not see their chat messages. You can
also set an expiration so that after a certain amount of time, they will be allowed to chat globally regardless of
manual intervention.

## Permissions

The `plex.nush.use` permission will grant access to the NUSH command and all subcommands. The `plex.nush.view` command
will allow people to view chat messages that are intercepted by NUSH. You would want to give both permissions to
moderators and none to regular players.

## Commands

### nush on

This turns the NUSH module on. New players will be subjected to a delay before their chat messages are globally seen.

### nush off

This turns the NUSH module off. This is the default state for the NUSH module. All new players will be able to chat
normally.

### nush status

This shows the status of NUSH. By default, it is turned off. You can check its status with this command.

### nush time \<duration\>

This sets the time that players must wait before they can chat and their messages are seen. This gives admins enough
time to react if they immediately spam when they join.

### nush remove \<player\>

This removes a player from the NUSH list. Only new players are added, but if they are a legitimate new player during a
raid, you can remove them, and they will be able to chat normally.