---
title: Build and install
description: Build a Plex module and install it on a server
---

Build the module with Gradle.

```bash
./gradlew build
```

The JAR is in `build/libs/`. Copy it into the `plugins/Plex/modules/` folder on your server. Restart the server, or run
`/plex modules reload` in game. Plex reads the new module and enables it.

You can also manage modules in game.

| Command | Description |
|---------|-------------|
| `/plex modules` | Lists the loaded modules. |
| `/plex modules install <name>` | Downloads and installs an official module by name. |
| `/plex modules update` | Updates every module that the updater manages. |
| `/plex modules reload` | Reloads all modules from disk. |
| `/plex modules uninstall <name> [-rmdir]` | Removes a module. Add `-rmdir` to also delete its data folder. |

## Updater metadata

By default, Plex updates a module through its first-party updater, which serves the official modules. A third-party
module should set its own `updater.url` or turn updates off. You control this behavior with an optional `updater` block in
`module.yml`.

```yaml title="module.yml"
updater:
  enabled: true
  url: https://updates.example.com/module-example
```

Set `enabled` to `false` to remove the module from `/plex modules update`. Set `url` to serve updates from your own
location instead of the first-party updater. Use `urls` with a list if you serve from more than one location.

```yaml title="module.yml"
updater:
  enabled: false
```

## Need help

If you get stuck, join the [Plex Discord](https://discord.plex.us.org) and ask in the development channels.
