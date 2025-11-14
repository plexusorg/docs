---
title: Introduction
description: Discover all officially supported modules that extend Plex's functionality
---

Plex's modular architecture allows server owners to customize their experience by adding optional features. These
modules integrate seamlessly with the core plugin while maintaining stability and performance.

## How Modules Work

You can download modules from the CI Server. Simply place the downloaded module files in the `/plugins/Plex/modules/`
directory. You can then run `/plex modules reload` in-game to load the new module in.

Once a module has been installed, you can update it to the latest build by running `/plex modules update`.

## Officially Supported Modules

Below is the complete list of Plex's official modules with their current versions:

| Module Name         | Description                                                                       | Version |
|---------------------|-----------------------------------------------------------------------------------|---------|
| **BukkitTelnet**    | Automatically connect to BukkitTelnet with a permission node                      | 1.6     |
| **FalseOp**         | Provides operator functionality                                                   | 1.6     |
| **HTTPD**           | Web server integration that shows server data                                     | 1.6     |
| **LibsDisguises**   | Administrative utilities for the LibsDisguises plugin                             | 1.6     |
| **NickMiniMessage** | Nickname formatting for EssentialsX with MiniMessage                              | 1.6     |
| **NUSH**            | Raid-prevention techniques to temporarily silence brand new players               | 1.6     |
| **TFMExtras**       | A port of many additional TotalFreedomMod features that don't fit the core plugin | 1.6     |

:::tip
For optimal performance, ensure all modules match your Plex core version. You should keep Plex and your modules up to
date.
:::