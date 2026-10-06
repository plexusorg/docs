---
title: Events
description: Listen to the PlayerPrefixEvent and StaffChatMessageEvent that Plex fires
---

Plex fires two Bukkit events in the `dev.plex.api.event` package. Listen to them like any other Bukkit event, with an
`@EventHandler` method in a `Listener`.

- In a module, register the listener with `registerListener(listener)`. Plex unregisters it when the module disables.
  See [Listeners](/docs/create_module/listeners).
- In a plugin, register the listener with `getServer().getPluginManager().registerEvents(listener, plugin)`.

## PlayerPrefixEvent

Plex fires `PlayerPrefixEvent` before it draws a player's chat line or tab-list entry. Your listener can add prefixes
that Plex shows before the player's tag and name. Use it for markers such as `[AFK]` or a guild name.

### When Plex fires it

`getTarget()` tells you which output Plex draws:

| Target | When Plex fires the event | Thread |
|--------|---------------------------|--------|
| `Target.CHAT` | Once for each public chat message, before Plex renders it. Plex does not fire it for a message that goes to staff chat. | Usually asynchronous, because Paper's chat event is asynchronous. |
| `Target.CHAT` | When code calls `messages().chatLine(player, message)`. | Synchronous, on the thread that called `chatLine`. |
| `Target.TAB` | When the player joins, and then every 20 ticks while the player is online. | Synchronous, on the player's owning region. |

Call `isAsynchronous()` to check the thread at run time. Plex fires the event often, so keep your listener fast. Read
only data that you already hold in memory. Do not query a database or the network from the listener.

### What you can read and change

| Method | What it does |
|--------|--------------|
| `getPlayer()` | Returns the player whose chat line or tab-list entry Plex draws. |
| `getTarget()` | Returns `Target.CHAT` or `Target.TAB`. |
| `getName()` | Returns the name that Plex shows after the tag. For `TAB`, this is the display name, or the username in the rank color when the player has no display name. For `CHAT`, this is the display name. |
| `getTag()` | Returns the tag that Plex shows after the prefixes, or an empty component. For `TAB`, this is the player's custom tag. For `CHAT`, this is the custom tag, or the rank prefix when the player has no custom tag. |
| `addPrefix(Component)` | Adds a prefix after the prefixes of earlier listeners. Plex ignores an empty component. |
| `getPrefixes()` | Returns a copy of the prefixes added so far, in display order. |

You cannot change the name or the tag through this event. The event cannot be cancelled.

Every event starts with no prefixes. Add your prefix on each call for as long as it should show. To show a prefix in only one place, check `getTarget()` first.

### How Plex draws the prefixes

Plex shows the prefixes in listener order, then the tag, then the name. Plex puts one space after each prefix and after
the tag. In chat, the prefixes and the tag fill the `<prefix>` placeholder of `chat.format` in the Plex config. In the
tab list, Plex puts its ban marker before all prefixes when the player has a finite ban.

### Example

This listener shows `[AFK]` before the names of AFK players, in chat and in the tab list. Plex can fire the event off
the server thread, so the listener keeps its data in a thread-safe set.

```java
import dev.plex.api.event.PlayerPrefixEvent;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

public class AfkPrefixListener implements Listener
{
    // Plex can call the event off the server thread, so use a thread-safe set.
    private final Set<UUID> afkPlayers = ConcurrentHashMap.newKeySet();

    @EventHandler
    public void onPrefix(PlayerPrefixEvent event)
    {
        if (afkPlayers.contains(event.getPlayer().getUniqueId()))
        {
            event.addPrefix(Component.text("[AFK]", NamedTextColor.GRAY));
        }
    }
}
```

## StaffChatMessageEvent

Plex fires `StaffChatMessageEvent` before it sends a staff chat message on this server. Your listener can read the
message, replace it, or cancel it.

### When Plex fires it

`getSource()` tells you how the message entered staff chat:

| Source | When Plex fires the event | Sender |
|--------|---------------------------|--------|
| `Source.TOGGLED_CHAT` | A player with staff chat mode on sends a chat message. | The player. |
| `Source.COMMAND` | A player or the console runs `/adminchat <message>`, or one of its aliases `/o`, `/sc`, and `/staffchat`. | The player or the console. |
| `Source.API` | Code calls `messages().sendAdminChat(...)`. | `null` |

Plex does not fire the event for staff chat messages that arrive from other servers.

The event can be asynchronous. A `TOGGLED_CHAT` event is usually asynchronous, because Paper's chat event is
asynchronous. Call `isAsynchronous()` before you use an API that needs a server or region thread. Sending a message to a
player or the console is safe from any thread.

### What you can read and change

| Method | What it does |
|--------|--------------|
| `getSender()` | Returns the player or console that sent the message, or `null` for `Source.API`. |
| `getSource()` | Returns `TOGGLED_CHAT`, `COMMAND`, or `API`. |
| `getMessage()` | Returns the message that Plex will send. |
| `setMessage(Component)` | Replaces the message that Plex will send. The message must not be `null`. |
| `isCancelled()` | Returns `true` when a listener cancelled the event. |
| `setCancelled(boolean)` | Cancels or restores the message. |

When you cancel the event, Plex does not send the message to anyone. For `TOGGLED_CHAT`, the player's message does not
go to public chat either.

:::caution
For `Source.API`, Plex sends the original message. A message that you set with `setMessage` has no effect for that
source. Cancelling still works.
:::

### Example

This listener blocks staff chat messages that contain the word "password" and tells the sender why. For all other
messages, it replaces `:shrug:` with `¯\_(ツ)_/¯`.

```java
import dev.plex.api.event.StaffChatMessageEvent;
import java.util.Locale;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.serializer.plain.PlainTextComponentSerializer;
import org.bukkit.command.CommandSender;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

public class StaffChatFilter implements Listener
{
    @EventHandler(ignoreCancelled = true)
    public void onStaffChat(StaffChatMessageEvent event)
    {
        String text = PlainTextComponentSerializer.plainText().serialize(event.getMessage());
        if (text.toLowerCase(Locale.ROOT).contains("password"))
        {
            event.setCancelled(true);
            CommandSender sender = event.getSender();
            if (sender != null)
            {
                sender.sendMessage(Component.text("Do not post passwords in staff chat.", NamedTextColor.RED));
            }
            return;
        }
        event.setMessage(event.getMessage().replaceText(builder -> builder
                .matchLiteral(":shrug:")
                .replacement("¯\\_(ツ)_/¯")));
    }
}
```

See the Javadocs for [`PlayerPrefixEvent`](/javadoc/dev/plex/api/event/PlayerPrefixEvent.html) and
[`StaffChatMessageEvent`](/javadoc/dev/plex/api/event/StaffChatMessageEvent.html).
