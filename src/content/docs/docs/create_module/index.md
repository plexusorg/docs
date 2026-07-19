---
title: Creating a module
description: An overview of the Plex module system and how a module works
---

Modules add features to Plex without changing the core plugin. This guide shows you how to build one. You should know
Java, Git, and the Gradle build system before you start.

A module is a normal Paper plugin JAR with one difference. It carries a `module.yml` file instead of a `plugin.yml` file,
and it extends the Plex module API instead of the Bukkit `JavaPlugin` class. Plex loads the JAR, reads its metadata, and
calls the module through a small, stable API.

You do not talk to Plex internals. You talk to the `dev.plex:api` artifact only. This keeps modules working across Plex
updates, as long as the API compatibility number stays the same.

## How a module works

Plex loads every JAR in `plugins/Plex/modules/` at startup. For each module, Plex reads `module.yml`, creates an instance
of your main class, and gives it a data folder, a logger, and the Plex API. Plex then drives the module through three
lifecycle methods.

1. `load()` runs first, for every module, before any module is enabled. Most modules do not need it.
2. `enable()` runs next, for every module. Register your commands and listeners and read your configuration here.
3. `disable()` runs at shutdown or reload. Plex unregisters your commands and listeners for you. Release any other resources here.

You reach every supported feature through one method, `api()`. It returns the Plex API facade. From there you call
`api().players()`, `api().messages()`, `api().punishments()`, and the other services. The
[Plex API reference](/docs/create_module/api) page lists them all.

:::note
Register your commands and listeners in `enable()`. Plex adds them before Paper builds the server command list, so they
work as soon as the server starts. If you register a command after the server has started, it does not appear until the
next server restart.
:::

## Updates

Plex can update installed modules with `/plex modules update`. This command uses Plex's first-party updater, which serves
the official modules only. If you publish a third-party module, tell Plex where to find your updates, or turn updates off.

- Set `updater.url` in `module.yml` to serve updates from your own location.
- Set `updater.enabled: false` to keep your module out of `/plex modules update`.

The ExampleModule template turns updates off. See [Build and install](/docs/create_module/install) for the full updater
block.

## The rest of this guide

Read the pages in order to build a module from start to finish.

1. [Project setup](/docs/create_module/setup) starts from the ExampleModule template and sets up the Gradle files, the module descriptor, and the main class.
2. [Commands](/docs/create_module/commands) adds a command.
3. [Listeners](/docs/create_module/listeners) adds a listener.
4. [Configuration and messages](/docs/create_module/configuration) adds a config file and a message file.
5. [Libraries and storage](/docs/create_module/libraries) adds runtime libraries, database storage, and scheduled tasks.
6. [The Plex API](/docs/create_module/api) lists every service that a module can use.
7. [Build and install](/docs/create_module/install) builds the module and installs it on a server.
