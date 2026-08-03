---
title: Configuration and messages
description: Add a configuration file and a message file to a Plex module
---

## Configuration files

To ship a configuration file, put the default file in `src/main/resources`.

Create a `ModuleConfig` in your main class. The first path is the resource inside the JAR. The second path is where the
file goes inside the module data folder.

```java title="src/main/java/dev/plex/ExampleModule.java"
package dev.plex;

import dev.plex.config.ModuleConfig;
import dev.plex.module.PlexModule;

public class ExampleModule extends PlexModule
{
    private ModuleConfig config;

    @Override
    public void enable()
    {
        config = new ModuleConfig(this, "config.yml", "config.yml");
        config.load();
    }

    public ModuleConfig getConfig()
    {
        return config;
    }
}
```

Plex copies the default file to `plugins/Plex/modules/Module-Example/config.yml` on first run. Read values with the typed
getters.

```java
String message = getConfig().getString("messages.welcome");
boolean enabled = getConfig().getBoolean("feature.enabled", false);
int limit = getConfig().getInt("feature.limit", 10);
```

`ModuleConfig` has `getString`, `getInt`, `getLong`, `getDouble`, `getBoolean`, and `get`, each with an optional default
value. Use `set(path, value)` and `save()` to write changes back to disk.

## Messages

Keep user-facing text in a message file, so server owners can change it. Put the default file in `src/main/resources`.
Plex message files use
[MiniMessage](https://docs.advntr.dev/minimessage/format) formatting. Use `{0}`, `{1}`, and so on for replacement values.

```yaml title="src/main/resources/messages.yml"
welcome: "<gray>Welcome, <yellow>{0}</yellow>."
featureDisabled: "<red>That feature is disabled."
```

Load the file in `enable()` with `loadMessages`. Plex copies it to `plugins/Plex/modules/Module-Example/messages.yml`.

```java
@Override
public void enable()
{
    loadMessages("messages.yml");
}
```

Read a message as a component or as a string. These methods work in your main class and in any command that extends
`SimplePlexCommand`.

```java
Component welcome = messageComponent("welcome", player.getName());
String plain = messageString("featureDisabled");
```

If a key is missing from your file, Plex falls back to its own message with the same key. This lets your commands reuse
the standard Plex messages, such as `noPermissionNode` and `playerNotFound`, without redefining them.
