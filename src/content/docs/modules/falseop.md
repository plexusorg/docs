---
title: FalseOp
description: An overview of the FalseOp module for Plex
---

The FalseOp module makes clients think they have operator status. Plex uses a permissions plugin instead of real operator
status, so this module gives players the operator look without the risk. It changes the packets that the server sends, so
the client shows the operator effect. It also lets players place and break command blocks, structure blocks, and jigsaw
blocks under the normal gamemode rules.

This module has no commands, configuration, or permission nodes.

## Requirements

The FalseOp module needs the [PacketEvents](https://www.spigotmc.org/resources/packetevents-api.80279/) plugin. Install
PacketEvents on your server. If PacketEvents is missing, the module logs an error and does not start.
