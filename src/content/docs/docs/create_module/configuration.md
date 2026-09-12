---
title: Configuration and messages
description: Add a configuration file and a message file to a Plex module
---

## Configuration files

To ship a configuration file, put the default file in `src/main/resources`.

Create a `ModuleConfiguration` in your main class with `api().moduleConfigs().create(...)`, then load it. The file name
is both the resource inside the JAR and the file inside the module data folder.

```java title="src/main/java/dev/plex/ExampleModule.java"
package dev.plex;

import dev.plex.api.config.ModuleConfiguration;
import dev.plex.module.PlexModule;

public class ExampleModule extends PlexModule
{
    private ModuleConfiguration config;

    @Override
    public void load()
    {
        config = api().moduleConfigs().create(this, "config.yml");
        config.load();
    }

    public ModuleConfiguration getConfig()
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

`ModuleConfiguration` extends the Bukkit `YamlConfiguration` class, so it has `getString`, `getInt`, `getLong`,
`getDouble`, `getBoolean`, and `get`, each with an optional default value. Use `set(path, value)` and `save()` to write
changes back to disk.

## Messages

Keep user-facing text in a message file, so server owners can change it. Put the default file in `src/main/resources`.
Plex message files use
[MiniMessage](https://docs.advntr.dev/minimessage/format) formatting. Write a replacement value as a named tag, such as
`<player>`.

```yaml title="src/main/resources/messages.yml"
welcome: "<gray>Welcome, <yellow><player></yellow>."
featureDisabled: "<red>That feature is disabled."
```

Load the file in `load()` with `loadMessages`. Plex copies it to `plugins/Plex/modules/Module-Example/messages.yml`.

```java
@Override
public void load()
{
    loadMessages("messages.yml");
}
```

Read a message as a component or as a string. These methods work in your main class and in any command that extends
`SimplePlexCommand`. Pass one `TagResolver` for each named tag, such as `Placeholder.unparsed`. `messageString` takes no
placeholders and returns the raw MiniMessage template.

```java
import net.kyori.adventure.text.minimessage.tag.resolver.Placeholder;

Component welcome = messageComponent("welcome", Placeholder.unparsed("player", player.getName()));
String plain = messageString("featureDisabled");
```

If a key is missing from your file, Plex falls back to its own message with the same key. This lets your commands reuse
the standard Plex messages, such as `noPermissionNode` and `playerNotFound`, without redefining them.
