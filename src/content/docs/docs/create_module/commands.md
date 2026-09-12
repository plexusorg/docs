---
title: Commands
description: Add a command to a Plex module
---

Most module commands extend `SimplePlexCommand`. This base class builds the root command literal, checks the permission
and the sender type, and turns common errors into messages. You write two things: the command metadata and the
`configureCommand` method, which builds the Brigadier tree.

You describe a command with a `CommandSpec`. You build it with the `command(...)` builder that `SimplePlexCommand`
provides.

The example below is the command from the ExampleModule template. It shows subcommands, tab completion, and calls to the
Plex API.

```java title="src/main/java/dev/plex/command/ExampleCommand.java"
package dev.plex.command;

import com.mojang.brigadier.builder.LiteralArgumentBuilder;
import io.papermc.paper.command.brigadier.CommandSourceStack;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;
import net.kyori.adventure.text.Component;
import org.bukkit.Location;
import org.bukkit.Particle;
import org.bukkit.Sound;
import org.bukkit.entity.Player;
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
    protected void configureCommand(LiteralArgumentBuilder<CommandSourceStack> command)
    {
        command.executes(context -> executeCommand(context, (sender, player) -> help()));
        command.then(word("action")
                .suggests((context, builder) -> suggestMatching(builder, List.of("info", "sparkle")))
                .executes(context -> executeCommand(context,
                        (sender, player) -> executeTyped(player, string(context, "action"))))
                .then(greedyString("ignored").executes(context -> executeCommand(context,
                        (sender, player) -> executeTyped(player, string(context, "action"))))));
    }

    private Component executeTyped(@Nullable Player player, String action)
    {
        return switch (action.toLowerCase(Locale.ROOT))
        {
            case "info" -> info();
            case "sparkle" -> sparkle(player);
            default -> usage();
        };
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
        int compatibility = api().apiCompatibilityVersion();
        int loadedModules = api().modules().loadedModules().size();
        return mmString("<gold>Plex API compatibility:</gold> <yellow>" + compatibility
                + "</yellow> <dark_gray>•</dark_gray> <gold>Loaded modules:</gold> <yellow>"
                + loadedModules + "</yellow>");
    }

    private Component sparkle(@Nullable Player player)
    {
        if (player == null)
        {
            return mmString("<red>Only players can sparkle.</red>");
        }

        AtomicInteger bursts = new AtomicInteger();
        ownTask(player.getScheduler().runAtFixedRate(taskOwner(), task ->
        {
            int burst = bursts.incrementAndGet();
            Location origin = player.getLocation().add(0, 1, 0);
            player.getWorld().spawnParticle(Particle.END_ROD, origin, 12, 0.6, 0.7, 0.6, 0.02);
            player.playSound(origin, Sound.BLOCK_NOTE_BLOCK_CHIME, 0.7f, 1.2f + burst * 0.15f);
            if (burst >= 4)
            {
                task.cancel();
            }
        }, null, 1L, 5L));

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

## Run the command

`configureCommand` receives the root command literal. Add an `.executes(...)` call to each node that runs the command,
and dispatch it through `executeCommand`. The function that you pass receives the sender and the sender as a `Player`
(or `null` for the console). Return a `Component` to send back to the sender, or return `null` to send nothing.

A command schedules Paper tasks directly. Pass `taskOwner()` as the task owner, and pass every retained or delayed task
to `ownTask(...)`, so module unload cancels it.

`SimplePlexCommand` gives you helper methods for common work.

| Helper | Description |
|--------|-------------|
| `executeCommand(context, (sender, player) -> ...)` | Runs the command body, checks the source and permission, and sends the returned component. |
| `word("name")` | Builds a single-word Brigadier argument. |
| `greedyString("name")` | Builds a Brigadier argument that takes the rest of the line. |
| `string(context, "name")` | Reads a string argument from the command context. |
| `suggestMatching(builder, values)` | Suggests the values that match the text the sender has typed. |
| `usage()` | Returns the formatted usage message. |
| `mmString("...")` | Turns MiniMessage text into a component. |
| `componentFromString("&a...")` | Turns ampersand-colorized legacy text into a component. |
| `messageComponent("key", Placeholder.unparsed("name", value))` | Resolves a message from your message file with named placeholders. |
| `messageString("key")` | Returns the raw MiniMessage template for a message key. |
| `permissionMessage()` | Returns the standard no-permission message for this command. |
| `broadcast("...")` | Sends a MiniMessage broadcast to everyone. |
| `send(audience, message)` | Sends a message to an audience. |
| `getNonNullPlayer("name")` | Returns an online player, or throws `PlayerNotFoundException`. |
| `onlinePlayerNames()` | Returns the names of online players. |
| `checkPermission(sender, "node")` | Checks a permission, or throws `CommandFailException`. |
| `silentCheckPermission(sender, "node")` | Checks a permission without throwing. |
| `taskOwner()` | Returns the Paper plugin that owns native tasks scheduled by this command. |
| `ownTask(task)` | Registers a native Paper task, so Plex cancels it when the module unloads. |

`SimplePlexCommand` catches a set of command exceptions and turns each one into a standard message. You can throw these
from the command body to stop the command with a clear response.

| Exception | Result |
|-----------|--------|
| `PlayerNotFoundException` | Sends the `playerNotFound` message. |
| `PlayerNotBannedException` | Sends the `playerNotBanned` message. |
| `ConsoleOnlyException` | Sends the `consoleOnly` message. |
| `ConsoleMustDefinePlayerException` | Sends the `consoleMustDefinePlayer` message. |
| `CommandFailException` | Sends the message text that you supply. |

## Tab completion

Add `.suggests(...)` to an argument node to return completions. `suggestMatching` filters your values by the text the
sender has typed and shows the matches.

```java
command.then(word("action")
        .suggests((context, builder) -> suggestMatching(builder, List.of("info", "sparkle"))));
```

Pass an empty collection when you have no suggestions. Check the permission with `silentCheckPermission` if the
suggestions should be hidden from players who cannot use the command.

## Register the command

Register the command in `load()` in your main class.

```java
registerCommand(new ExampleCommand());
```

A module can register more than one command. Register each command with a separate call.

## Sub-commands

Plex does not provide a sub-command framework. A command like `/example info` and `/example sparkle` is one command that
reads an argument and branches. The example above uses this pattern. Larger modules, such as Module-Guilds, keep each
branch in its own class and forward the argument to it, but that is a module convention, not a Plex feature.

## Advanced: a custom command tree

`SimplePlexCommand` builds only the root literal and the permission and source check. Every command builds the rest of
its tree in `configureCommand`, so typed Brigadier arguments and nested nodes need nothing extra. If you need full
control, implement the `PlexCommand` interface directly and return your own `LiteralCommandNode` from `buildCommand()`.
Most modules do not need this.
