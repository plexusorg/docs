---
title: Players
description: Look up Plex players, read their state, save custom tags, and store module data for a player.
---

The players service gives a module read access to the players that Plex knows. A player is known after they join the
server once. Use the service to look up a player by UUID or name, read their tag, IP addresses, and punishments, save
a custom tag, and store your own data for each player.

Get the service from your module:

```java
PlayersApi players = api().players();
```

Javadoc: [`PlayersApi`](/javadoc/dev/plex/api/player/PlayersApi.html).

## Methods

| Method | What it does |
| --- | --- |
| `player(UUID uuid)` | Looks up a player by UUID. The future holds an empty `Optional` when Plex does not know the player. |
| `byName(String name)` | Looks up a player by exact name. Case does not matter. |
| `resolveCommandPlayer(String name)` | Looks up an exact name first. If there is no match, it looks for one online player whose name starts with the text. Case does not matter. The future fails with `AmbiguousPlayerException` when more than one online name matches. |
| `setTag(UUID uuid, Component tag)` | Saves a custom tag that Plex shows in chat and the tab list. The player can be online or offline. |
| `clearTag(UUID uuid)` | Removes the player's saved custom tag. |
| `onlineNames()` | Returns the names of the players online on this server, sorted without regard to case. |
| `moduleData(PlexModule module, UUID playerUuid)` | Returns a store for your module's own data about one player. See [Module data for a player](#module-data-for-a-player). |

`resolveCommandPlayer` takes names only. If your command also accepts a UUID, parse it yourself and call `player(UUID)`.

## PlexPlayerView

A lookup gives you a [`PlexPlayerView`](/javadoc/dev/plex/api/player/PlexPlayerView.html). You can only read it. To
change a player, use the service methods.

| Method | Value |
| --- | --- |
| `uuid()` | The player's UUID. |
| `name()` | The current name, or the last name Plex saw. |
| `tag()` | The saved custom tag. It is an empty component when the player has no tag. It does not include the rank prefix. |
| `ips()` | The IP addresses that Plex has seen for this player. |
| `punishments()` | The player's punishment history as a list of [`PunishmentView`](/api/punishments#punishmentview). |
| `frozen()` | `true` when the player has an active freeze. |
| `muted()` | `true` when the player has an active mute. |
| `lockedUp()` | `true` when the player is locked up. |
| `staffChat()` | `true` when the player has staff-chat mode on. |

When the player is online, the view reads Plex's live record, so each call shows the current state. When the player is
offline, the view shows the state that Plex loaded for the lookup.

Plex checks the `plex.ban.bypass` permission when it decides if a ban entry in `punishments()` is active. For an
offline player, the permission plugin can do slow work for this check. Read the history inside the future callback,
which does not run on a region thread when Plex loads an offline player.

## Example: show a player's punishments

```java
public final class PunishmentHistory
{
    private final PlexModule module;

    public PunishmentHistory(PlexModule module)
    {
        this.module = module;
    }

    public void show(CommandSender sender, String name)
    {
        module.api().players().byName(name).whenComplete((result, failure) ->
        {
            if (failure != null)
            {
                module.getLogger().error("Could not look up {}", name, failure);
                sender.sendMessage(Component.text("Player lookup failed.", NamedTextColor.RED));
                return;
            }
            if (result.isEmpty())
            {
                sender.sendMessage(Component.text("Plex does not know " + name + ".", NamedTextColor.RED));
                return;
            }

            PlexPlayerView player = result.get();
            sender.sendMessage(Component.text(player.name() + " (" + player.uuid() + ")", NamedTextColor.GOLD));
            if (player.muted())
            {
                sender.sendMessage(Component.text("This player is muted.", NamedTextColor.YELLOW));
            }
            for (PunishmentView punishment : player.punishments())
            {
                String state = punishment.active() ? "active" : "ended";
                sender.sendMessage(Component.text(punishment.type() + " by " + punishment.punisherDisplayName()
                        + ": " + punishment.reason() + " (" + state + ")", NamedTextColor.GRAY));
            }
        });
    }
}
```

The callback sends messages directly. Sending a message does not need a scheduler.

## Custom tags

`setTag` saves the tag in the database and then updates the copy that Plex keeps in memory. The future completes after
both steps. Your module must check its own permissions before it calls `setTag`.

Plex cleans the tag before it saves it:

- A tag can contain text, sprites, and player heads.
- Plex removes click actions, hover text, insertion text, obfuscated formatting, and right-to-left text.
- Plex rejects other component types, such as translations, scores, and selectors.
- The visible text must fit in the `chat.max-tag-length` setting.

The future fails in these cases:

- `TagTooLongException` when the visible text is longer than the limit. Call `maximumLength()` to get the limit.
- `IllegalArgumentException` when the tag has a component type that Plex rejects, or when Plex does not know the UUID.
- A storage exception when the database write fails.

A tag is separate from the rank prefix. `setTag` and `clearTag` do not change the rank prefix or prefixes that other
modules add with `PlayerPrefixEvent`. See [Events](/api/events).

```java
Component tag = module.api().messages().miniMessage(miniMessage);
module.api().players().setTag(target, tag).whenComplete((ignored, failure) ->
{
    Throwable cause = failure instanceof CompletionException && failure.getCause() != null
            ? failure.getCause() : failure;
    if (cause == null)
    {
        sender.sendMessage(Component.text("Tag saved."));
    }
    else if (cause instanceof TagTooLongException tooLong)
    {
        sender.sendMessage(Component.text("Use at most " + tooLong.maximumLength() + " characters."));
    }
    else
    {
        module.getLogger().error("Could not save a tag for {}", target, cause);
        sender.sendMessage(Component.text("Could not save the tag."));
    }
});
```

Javadoc: [`TagTooLongException`](/javadoc/dev/plex/api/player/TagTooLongException.html).

## Module data for a player

`moduleData(module, uuid)` returns a [`PlayerModuleData`](/javadoc/dev/plex/api/player/PlayerModuleData.html) store.
Plex saves each value as JSON in its database. Each module has its own space, so two modules can use the same key.

| Method | What it does |
| --- | --- |
| `get(String key)` | Reads the raw `JsonElement`. The `Optional` is empty when the key has no value. |
| `get(String key, Class<T> type)` | Reads the value and converts it to `type` with Gson. The `Optional` is empty when the key has no value or the value does not convert. |
| `getString(key, fallback)`, `getLong(key, fallback)`, `getBoolean(key, fallback)` | Reads a simple value. You get the fallback when the key has no value or holds a different type. |
| `set(String key, JsonElement value)` | Saves a raw JSON value. |
| `set(String key, Object value)` | Converts the value to JSON with Gson and saves it. |
| `remove(String key)` | Deletes the value. |

A key must start with a lowercase letter. After that, it can contain lowercase letters, digits, and underscores. The
longest key has 64 characters. The future fails with `IllegalArgumentException` when the key does not follow these
rules.

```java
PlayerModuleData data = module.api().players().moduleData(module, player);
data.getLong("visits", 0L)
        .thenCompose(visits -> data.set("visits", visits + 1))
        .exceptionally(failure ->
        {
            module.getLogger().error("Could not save visits for {}", player, failure);
            return null;
        });
```

For data that is not about one player, see [Storage](/api/storage).

## Futures and threads

Read [the overview](/api) for the general rules. These points apply to the players service:

- `player`, `byName`, and `resolveCommandPlayer` complete at once when the UUID or exact name belongs to a player
  online on this server. Your callback then runs on the thread that called the method. In other cases, Plex reads the
  database, and your callback runs on a Plex database thread. Do not assume which one.
- `setTag`, `clearTag`, and the `PlayerModuleData` methods run on a Plex database thread. A tag that fails validation
  gives a future that has already failed.
- `onlineNames()` returns a copy at once. You can call it from any thread.
- Do not call `join()` or `get()` on these futures from a player or region thread. Use a callback.
- A callback does not own any player, entity, or block. To change Bukkit state, schedule only that change on the
  owner's scheduler. For a player, use `player.getScheduler().run(module.plugin(), ...)` and pass the task to
  `module.ownTask(...)`.
- When a future fails inside a chain, the exception can arrive wrapped in `CompletionException`. Check
  `getCause()` before you test the exception type.
