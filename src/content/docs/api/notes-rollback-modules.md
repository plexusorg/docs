---
title: Notes, rollback, and modules
description: Read and write player notes, roll back a player's changes, and list loaded modules with NotesApi, RollbackApi, and ModulesApi
---

This page covers three small services: player notes, block rollback, and information about loaded modules. Get each one
from the API facade in your module.

The examples on this page are methods in your `PlexModule` class, so `api()` and `getLogger()` come from the module.

| Service | Interface |
|---------|-----------|
| `api().notes()` | [`NotesApi`](/javadoc/dev/plex/api/note/NotesApi.html) |
| `api().rollback()` | [`RollbackApi`](/javadoc/dev/plex/api/rollback/RollbackApi.html) |
| `api().modules()` | [`ModulesApi`](/javadoc/dev/plex/api/module/ModulesApi.html) |

## Notes

Staff can attach notes to a player. Plex stores the notes in its database. `NotesApi` reads and writes the same notes
that the in-game note commands use.

| Method | What it does |
|--------|--------------|
| `list(UUID player)` | Returns the notes of a player, sorted by ID. |
| `add(UUID player, String content, UUID author)` | Adds a note. Pass `null` as the author for the console. |
| `remove(UUID player, int id)` | Removes one note. The future gives `true` if the note existed. |
| `clear(UUID player)` | Removes every note of a player. The future gives the number of notes removed. |

Each method returns a `CompletableFuture`. Plex runs the database work on its own I/O thread and completes the future
there.

Note IDs belong to one player. The first note of a player gets ID 1, and each new note gets the highest ID plus 1.
`add` fails its future with `IllegalArgumentException` if the content is longer than 2000 characters.

### PlayerNote

[`PlayerNote`](/javadoc/dev/plex/api/note/PlayerNote.html) is a record.

| Method | What it does |
|--------|--------------|
| `id()` | Returns the note ID for this player. |
| `player()` | Returns the UUID of the player that the note is about. |
| `content()` | Returns the note text. |
| `author()` | Returns the UUID of the author, or `null` for the console. |
| `timestamp()` | Returns the time of the note as a `ZonedDateTime`. |

### Example: add and list notes

```java
public void addNote(Player staff, UUID target, String text)
{
    api().notes().add(target, text, staff.getUniqueId()).whenComplete((ignored, failure) ->
    {
        if (failure != null)
        {
            getLogger().error("Unable to add a note to {}", target, failure);
            staff.sendMessage(Component.text("The note could not be saved."));
            return;
        }
        staff.sendMessage(Component.text("Note added."));
    });
}

public void showNotes(CommandSender sender, UUID target)
{
    api().notes().list(target).thenAccept(notes ->
    {
        if (notes.isEmpty())
        {
            sender.sendMessage(Component.text("This player has no notes."));
            return;
        }
        for (PlayerNote note : notes)
        {
            String author = note.author() == null ? "Console" : note.author().toString();
            sender.sendMessage(Component.text("#" + note.id() + " by " + author + ": " + note.content()));
        }
    });
}

public void removeNote(CommandSender sender, UUID target, int id)
{
    api().notes().remove(target, id).thenAccept(removed ->
            sender.sendMessage(Component.text(removed ? "Note removed." : "No note has that ID.")));
}
```

The callbacks run on the Plex I/O thread. Sending a message from there is safe. Schedule any player or world change on
the scheduler that owns it.

## Rollback

`RollbackApi` undoes the block changes of one player through a block-logging plugin. It uses Oasis if Oasis is
enabled, and CoreProtect if only CoreProtect is enabled.

| Method | What it does |
|--------|--------------|
| `isAvailable()` | Returns `true` if Oasis or CoreProtect is ready to run rollbacks. |
| `rollback(CommandSender sender, String playerName, int seconds)` | Rolls back the changes that the player made in the last `seconds` seconds. The future gives the number of changes rolled back. |
| `rollbackLastDay(CommandSender sender, String playerName)` | Rolls back the last 24 hours. It is the same as `rollback(sender, playerName, 86400)`. |

Call `isAvailable()` first. If no rollback plugin is ready, `rollback` returns a failed future with
`IllegalStateException`. A value of `seconds` that is 0 or less gives a failed future with `IllegalArgumentException`.

With Oasis, Plex looks up the player name in its own player data. If Plex does not know the name, the future gives 0.
Plex records the sender as the staff member who asked for the rollback. If Oasis does not finish the rollback, the
future fails with `IllegalStateException`.

With CoreProtect, Plex passes the player name to CoreProtect as you give it.

The future completes on a background thread. Send messages from the callback directly. Schedule any player or world
change on the scheduler that owns it.

### Example: undo a griefer's last day

```java
public void undoGrief(CommandSender sender, String playerName)
{
    RollbackApi rollback = api().rollback();
    if (!rollback.isAvailable())
    {
        sender.sendMessage(Component.text("Install Oasis or CoreProtect to use rollbacks."));
        return;
    }
    rollback.rollbackLastDay(sender, playerName).whenComplete((changes, failure) ->
    {
        if (failure != null)
        {
            getLogger().error("Rollback of {} failed", playerName, failure);
            sender.sendMessage(Component.text("The rollback failed."));
            return;
        }
        sender.sendMessage(Component.text("Rolled back " + changes + " changes by " + playerName + "."));
    });
}
```

## Modules

`ModulesApi` tells you which Plex modules are loaded. Each module is a
[`PlexModuleFile`](/javadoc/dev/plex/module/PlexModuleFile.html), the information from that module's `module.yml`.

| Method | What it does |
|--------|--------------|
| `loadedModules()` | Returns an immutable list of every loaded module. |
| `module(String name)` | Returns the module with this `module.yml` name, or an empty `Optional`. The name match ignores case. |

`PlexModuleFile` has `getName()`, `getVersion()`, `getDescription()`, `getMain()`, `getApiCompatibility()`,
`getLibraries()`, `getRepositories()`, `isUpdaterEnabled()`, and `getUpdateUrls()`.

Plex updates the list after every module finishes `enable()`. While your own `enable()` runs, the list does not show
the modules of the current load yet, and it does not show your module. Read it later, for example in a command. You can
call both methods from any thread.

### Example: list modules and check for one

```java
public void listModules(CommandSender sender)
{
    for (PlexModuleFile file : api().modules().loadedModules())
    {
        sender.sendMessage(Component.text(file.getName() + " " + file.getVersion()));
    }
}

public boolean guildsInstalled()
{
    return api().modules().module("Module-Guilds").isPresent();
}
```

Server owners install modules as described on the [Modules](/modules) page.
