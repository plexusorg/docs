---
title: Commands and configuration
description: List Plex commands, run a command for a staff member, read the Plex configuration, and load module config files
---

This page covers three services. `CommandApi` tracks Plex commands and runs commands for a named staff member.
`ConfigurationApi` reads the Plex configuration files. `ModuleConfigApi` creates configuration files for your module.

Get each service from the Plex API. In your module class and in a command that extends `SimplePlexCommand`, call
`api()`. In other classes, keep a reference to your module and call `module.api()`. See the [API overview](/api).

```java
CommandApi commands = api().commands();
ConfigurationApi configuration = api().configuration();
ModuleConfigApi moduleConfigs = api().moduleConfigs();
```

To write a command, see [Commands](/docs/create_module/commands). To add a `config.yml` or `messages.yml` to your
module, see [Configuration and messages](/docs/create_module/configuration).

## CommandApi

Javadoc: [CommandApi](/javadoc/dev/plex/api/command/CommandApi.html)

| Method | What it does |
|--------|--------------|
| `register(PlexCommand command)` | Registers a command with Plex. |
| `unregister(PlexCommand command)` | Removes a command from Plex and removes its labels from Paper. |
| `registeredCommands()` | Returns a copy of the list of commands that Plex tracks. The list has the Plex commands and the commands of every module. |
| `requiresLifecycleReload()` | Returns `true` if commands changed after Paper built its command list. Paper must then rebuild the list. |
| `dispatchAsConsole(UUID identityId, String identityName, String command, Consumer<? super Component> feedback)` | Runs a command line as the console and names the given player as the actor. Returns `true` if Paper accepted the command. |

### Register commands from a module

In a module, call `registerCommand` and `unregisterCommand` on your module, not `register` and `unregister` on
`CommandApi`. The module methods record the command, so Plex removes it when your module unloads. Register commands in
`load()`. Paper builds its command list after that.

If commands change later, `requiresLifecycleReload()` returns `true`. When Plex reloads modules on Paper, Plex reloads
the datapacks to rebuild the list. Folia needs a server restart.

### List the commands

```java
import dev.plex.command.PlexCommand;

public List<String> commandsFor(CommandSender sender)
{
    List<String> names = new ArrayList<>();
    for (PlexCommand command : api().commands().registeredCommands())
    {
        String permission = command.getPermission();
        if (permission.isEmpty() || sender.hasPermission(permission))
        {
            names.add(command.getName());
        }
    }
    return names;
}
```

An empty permission means that everyone can use the command.

### Run a command for a staff member

Use `dispatchAsConsole` when a staff member runs a command from outside the game, for example from a web panel. Plex
runs the command line as the console. A Plex command then uses `identityName` and `identityId` as the sender name and
UUID in its messages and records. Write the command line without a leading slash.

Plex sends the command output to `feedback`. The method returns `false` when Paper does not accept the command, for
example when the command does not exist.

Call `dispatchAsConsole` on the global region thread.

```java
public void runForStaff(UUID staffId, String staffName, String commandLine, Consumer<Component> reply)
{
    ownTask(Bukkit.getGlobalRegionScheduler().run(plugin(), task ->
    {
        boolean accepted = api().commands().dispatchAsConsole(staffId, staffName, commandLine, reply);
        if (!accepted)
        {
            reply.accept(Component.text("Unknown command."));
        }
    }));
}
```

## CommandExecutionIdentity

Javadoc: [CommandExecutionIdentity](/javadoc/dev/plex/api/command/CommandExecutionIdentity.html)

`CommandExecutionIdentity` holds the actor name and UUID while `dispatchAsConsole` runs a command. Plex reads it when a
Plex command starts. It is an internal class. Use `dispatchAsConsole` instead of calling it.

| Method | What it does |
|--------|--------------|
| `call(UUID uniqueId, String name, Supplier<T> action)` | Runs `action` on the current thread with the given actor. |
| `currentName(String fallback)` | Returns the current actor name, or `fallback` when no name is set. |
| `currentUniqueId()` | Returns the current actor UUID, or `null`. |

## ConfigurationApi

Javadoc: [ConfigurationApi](/javadoc/dev/plex/api/config/ConfigurationApi.html)

`ConfigurationApi` gives read access to the shared Plex files in `plugins/Plex`.

| Method | What it does |
|--------|--------------|
| `mainConfig()` | Returns `config.yml`. |
| `messages()` | Returns `messages.yml`. |
| `indefiniteBans()` | Returns `indefbans.yml`. |
| `toggles()` | Returns `toggles.yml`. |

Each method returns a `PlexConfiguration`. You cannot change the file through it. Each read gives the value that is
loaded now. After a server owner runs `/plex reload`, the same object returns the new values. To keep a value that you
use often, read it in `load()` or `enable()`.

The keys are described on the [config.yml](/config/config), [messages.yml](/config/messages), and
[indefbans.yml](/config/indefinitebans) pages.

## PlexConfiguration

Javadoc: [PlexConfiguration](/javadoc/dev/plex/api/config/PlexConfiguration.html)

| Method | What it does |
|--------|--------------|
| `getString(String path)` | Returns the string at `path`, or `null` if the path does not exist. |
| `getString(String path, String fallback)` | Returns the string at `path`, or `fallback` if the path does not exist. |
| `getBoolean(String path)` | Returns the boolean at `path`, or `false` if the path does not exist. |
| `getBoolean(String path, boolean fallback)` | Returns the boolean at `path`, or `fallback` if the path does not exist. |
| `getInt(String path)` | Returns the integer at `path`, or `0` if the path does not exist. |
| `getInt(String path, int fallback)` | Returns the integer at `path`, or `fallback` if the path does not exist. |
| `getStringList(String path)` | Returns the string list at `path`, or an empty list if the path does not exist. |
| `getStringList(String path, List<String> fallback)` | Returns the string list at `path`, or `fallback` if the path does not exist. |

The lists that these methods return cannot be changed.

```java
PlexConfiguration plexConfig = api().configuration().mainConfig();
ZoneId zone = ZoneId.of(plexConfig.getString("server.timezone", "Etc/UTC"));
boolean chatEnabled = plexConfig.getBoolean("chat.enabled", true);
List<String> blockedWhileMuted = plexConfig.getStringList("block_on_mute");
boolean pvp = api().configuration().toggles().getBoolean("pvp", true);
```

## ModuleConfigApi

Javadoc: [ModuleConfigApi](/javadoc/dev/plex/api/config/ModuleConfigApi.html)

| Method | What it does |
|--------|--------------|
| `create(PlexModule module, String fileName)` | Returns a `ModuleConfiguration` for one file of your module. It does not read the file. |

`fileName` is two paths at the same time. It is the path of the default file in your module JAR, and the path of the
file in your module data folder, `plugins/Plex/modules/<module name>/`. You can use a folder, such as `data/homes.yml`.
The path must be relative and must stay inside the data folder. If it does not, `create` throws an
`IllegalArgumentException`.

## ModuleConfiguration

Javadoc: [ModuleConfiguration](/javadoc/dev/plex/api/config/ModuleConfiguration.html)

`ModuleConfiguration` extends the Bukkit `YamlConfiguration`. You read and change values with the usual Bukkit methods,
such as `getString`, `getInt`, and `set`.

| Method | What it does |
|--------|--------------|
| `load()` | Reads the file from disk. If the file does not exist, Plex first copies the default file from your JAR. |
| `save()` | Writes the current values to the file. |

When you call `load()`, Plex also compares the file with the default file in your JAR. Plex adds each key that is only
in the default file to the file on disk, and logs the keys that it added. Keys that the server owner set stay as they
are.

`load()` throws an `IllegalStateException` if your JAR has no default file at that path, or if Plex cannot read the
file. `save()` throws an `IllegalStateException` if Plex cannot write the file.

Both methods read or write a file on disk. Call them in `load()`, `enable()`, or `disable()`, or on your own executor.
Do not call them on a player or region thread during play.

```java
private ModuleConfiguration config;
private ModuleConfiguration homes;

@Override
public void load()
{
    config = api().moduleConfigs().create(this, "config.yml");
    config.load();
    homes = api().moduleConfigs().create(this, "data/homes.yml");
    homes.load();
}

public void setHome(UUID owner, String location)
{
    homes.set("homes." + owner, location);
}

@Override
public void disable()
{
    try
    {
        homes.save();
    }
    catch (IllegalStateException ex)
    {
        getLogger().error("Could not save data/homes.yml", ex);
    }
}
```

For this example, your JAR must contain `src/main/resources/config.yml` and `src/main/resources/data/homes.yml`.
