---
title: Commands
description: Add a command to a Plex module
---

Most module commands extend `SimplePlexCommand`. This base class builds the Brigadier command tree for you, checks the
permission and the sender type, and turns common errors into messages. You write two things: the command metadata and the
`execute` method.

You describe a command with a `CommandSpec`. You build it with the `command(...)` builder that `SimplePlexCommand`
provides.

The example below is the command from the ExampleModule template. It shows subcommands, tab completion, and calls to the
Plex API.

```java title="src/main/java/dev/plex/command/ExampleCommand.java"
package dev.plex.command;

import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;
import net.kyori.adventure.text.Component;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class ExampleCommand extends SimplePlexCommand
{
    public ExampleCommand()
    {
        super(command("examplemodule")
                .description("An example command provided by Plex's example module")
                .usage("/<command> [info | sparkle]")
                .aliases("example")
                .build());
    }

    @Override
    protected Component execute(@NotNull CommandSender sender, @Nullable Player player, @NotNull String[] args)
    {
        if (args.length == 0)
        {
            return help();
        }

        return switch (args[0].toLowerCase(Locale.ROOT))
        {
            case "info" -> info();
            case "sparkle" -> sparkle(player);
            default -> usage();
        };
    }

    @Override
    protected @NotNull List<String> suggestions(@NotNull CommandSender sender, @NotNull String alias, @NotNull String[] args)
    {
        if (args.length == 1)
        {
            return List.of("info", "sparkle");
        }
        return List.of();
    }

    private Component help()
    {
        return mmString("""
                <gold><bold>Plex Example Module</bold></gold>
                <gray>Try <yellow>/example info</yellow> or <light_purple>/example sparkle</light_purple>.</gray>
                """);
    }

    private Component info()
    {
        int compatibility = api().compatibility().version();
        int loadedModules = api().modules().loadedModules().size();
        return mmString("<gold>Plex API compatibility:</gold> <yellow>" + compatibility
                + "</yellow> <gold>Loaded modules:</gold> <yellow>"
                + loadedModules + "</yellow>");
    }

    private Component sparkle(@Nullable Player player)
    {
        if (player == null)
        {
            return mmString("<red>Only players can sparkle.</red>");
        }

        AtomicInteger bursts = new AtomicInteger();
        api().scheduler().runEntityTimer(player, task ->
        {
            int burst = bursts.incrementAndGet();
            Location origin = player.getLocation().add(0, 1, 0);
            player.getWorld().spawnParticle(Particle.END_ROD, origin, 12, 0.6, 0.7, 0.6, 0.02);
            player.playSound(origin, Sound.BLOCK_NOTE_BLOCK_CHIME, 0.7f, 1.2f + burst * 0.15f);
            if (burst >= 4)
            {
                task.cancel();
            }
        }, null, 1L, 5L);

        return mmString("<rainbow>A tiny celebration!</rainbow>");
    }
}
```

## Command metadata

You build the `CommandSpec` with these builder methods.

| Builder method | Description |
|----------------|-------------|
| `command("name")` | Starts the builder with the primary command name. |
| `.description("...")` | Sets a short description. |
| `.usage("/<command> ...")` | Sets the usage text. Plex replaces `<command>` with the command name. |
| `.aliases("a, b, c")` | Sets alternate names as a comma-separated string. |
| `.permission("plex.example")` | Sets the permission node. An empty value means no permission is needed. |
| `.source(RequiredCommandSource.IN_GAME)` | Restricts who can run the command. |
| `.build()` | Builds the `CommandSpec`. |

`RequiredCommandSource` has three values. `ANY` allows players and the console. `IN_GAME` allows only players. `CONSOLE`
allows only the console. The default is `ANY`.

## The execute method

`execute` receives the sender, the sender as a `Player` (or `null` for the console), and the arguments. Return a
`Component` to send back to the sender, or return `null` to send nothing.

`SimplePlexCommand` gives you helper methods for common work.

| Helper | Description |
|--------|-------------|
| `usage()` | Returns the formatted usage message. |
| `mmString("...")` | Turns MiniMessage text into a component. |
| `messageComponent("key", args...)` | Resolves a message from your message file. |
| `messageString("key", args...)` | Resolves a message as plain text. |
| `broadcast("...")` | Sends a MiniMessage broadcast to everyone. |
| `send(audience, message)` | Sends a message to an audience. |
| `getNonNullPlayer("name")` | Returns an online player, or throws `PlayerNotFoundException`. |
| `onlinePlayerNames()` | Returns the names of online players. |
| `checkPermission(sender, "node")` | Checks a permission, or throws `CommandFailException`. |
| `silentCheckPermission(sender, "node")` | Checks a permission without throwing. |

`SimplePlexCommand` catches a set of command exceptions and turns each one into a standard message. You can throw these
from `execute` to stop the command with a clear response.

| Exception | Result |
|-----------|--------|
| `PlayerNotFoundException` | Sends the `playerNotFound` message. |
| `PlayerNotBannedException` | Sends the `playerNotBanned` message. |
| `ConsoleOnlyException` | Sends the `consoleOnly` message. |
| `ConsoleMustDefinePlayerException` | Sends the `consoleMustDefinePlayer` message. |
| `CommandFailException` | Sends the message text that you supply. |

## Tab completion

Override `suggestions` to return completions. Plex filters your list by the current text and shows the matches. Return an
empty list when you have no suggestions. Check the permission with `silentCheckPermission` if the suggestions should be
hidden from players who cannot use the command.

## Register the command

Register the command in `enable()` in your main class.

```java
registerCommand(new ExampleCommand());
```

A module can register more than one command. Register each command with a separate call.

## Sub-commands

Plex does not provide a sub-command framework. A command like `/example info` and `/example sparkle` is one command that
reads `args[0]` and branches. The example above uses this pattern. Larger modules, such as Module-Guilds, keep each
branch in its own class and forward the remaining arguments to it, but that is a module convention, not a Plex feature.

## Advanced: a custom command tree

`SimplePlexCommand` builds a simple tree that accepts a single greedy string argument. This fits most commands. If you
need typed Brigadier arguments or nested nodes, override `configureCommand(LiteralArgumentBuilder)` and build the tree
yourself. If you need full control, implement the `PlexCommand` interface directly and return your own
`LiteralCommandNode` from `buildCommand()`. Most modules do not need this.
