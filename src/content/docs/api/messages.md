---
title: Messages and logging
description: Format messages, broadcast announcements, send staff chat, and write to the Plex log
---

Plex gives modules two services for text. `MessageApi` turns MiniMessage text into components and sends broadcasts.
`LoggingApi` writes lines to the server console and log.

Get each service from the Plex API. In your module class and in a command that extends `SimplePlexCommand`, call
`api()`. In other classes, keep a reference to your module and call `module.api()`. See the [API overview](/api) for
more about `api()`.

```java
MessageApi messages = api().messages();
LoggingApi logging = api().logging();
```

## MessageApi

Javadoc: [MessageApi](/javadoc/dev/plex/api/message/MessageApi.html)

| Method | What it does |
|--------|--------------|
| `messageComponent(String entry, TagResolver... placeholders)` | Reads the key `entry` from the Plex `messages.yml` and returns it as a component. Plex fills each tag from the placeholders. |
| `messageString(String entry)` | Returns the raw MiniMessage text of the key `entry` from the Plex `messages.yml`. Plex does not parse it. |
| `miniMessage(String input, TagResolver... placeholders)` | Parses your own MiniMessage text into a component. |
| `playerText(String input)` | Parses text that a player wrote. Plex allows only visual formatting. |
| `chatLine(Player player, Component message)` | Builds the public chat line of a player, with the configured chat format, prefix, and display name. It does not send the line. |
| `broadcast(String miniMessage)` | Parses MiniMessage text and sends it to every online player and the console. |
| `broadcast(Component component)` | Sends a component to every online player and the console. |
| `captureActionBroadcast(CommandSender sender)` | Records who may see an announcement about an action by `sender`. Returns an `ActionBroadcast`. |
| `sendAdminChat(String senderName, Component prefix, Component message)` | Sends a message to staff chat on this server. |

### Placeholders

Plex messages use named MiniMessage tags, such as `<player>`. Numbered placeholders such as `{0}` do not work in
messages. Give one `TagResolver` for each tag:

- `Placeholder.unparsed("player", name)` inserts plain text. Tags in the value stay as literal text.
- `Placeholder.component("reason", component)` inserts a component that you already built.

`messageComponent` and `messageString` read only the Plex `messages.yml`. To read your module's own message file, use
`messageComponent` on your module. That method falls back to the Plex file when your file does not have the key. See
[Configuration and messages](/docs/create_module/configuration). The keys and tags of the Plex file are on the
[Messages](/config/messages) page.

If the key does not exist in the Plex `messages.yml`, `messageComponent` and `messageString` throw a
`NullPointerException`.

```java
import dev.plex.api.message.MessageApi;
import net.kyori.adventure.text.minimessage.tag.resolver.Placeholder;

MessageApi messages = module.api().messages();
staff.sendMessage(messages.messageComponent("bannedPlayerJoined",
        Placeholder.unparsed("player", bannedName)));
```

### Text that players write

`miniMessage` and `messageComponent` accept every MiniMessage tag, which includes click, hover, and insertion tags. Do
not add player text to the `input` string. A player could add a click event that runs a command. Pass player text in a
placeholder instead.

Use `playerText` when a player may color their own text, for example a nickname or a report reason. It allows colors,
gradients, rainbow text, fonts, and the bold, italic, underlined, and strikethrough decorations. It keeps all other tags
as literal text. If the text has legacy `&` color codes, Plex reads the legacy codes instead of MiniMessage and removes
obfuscation.

```java
MessageApi messages = module.api().messages();
Component line = messages.miniMessage("<gold><reporter></gold> <gray>reported:</gray> <reason>",
        Placeholder.unparsed("reporter", reporter),
        Placeholder.component("reason", messages.playerText(reason)));
staff.sendMessage(line);
```

### Chat lines

`chatLine` gives the same line that Plex shows in public chat for that player. It uses `chat.format` from the Plex
`config.yml`. Plex calls `PlayerPrefixEvent` with the `CHAT` target while it builds the line, so prefixes from other
modules are included. See [Events](/api/events). Call `chatLine` on a thread that can read the player, for example the
command thread of that player.

### Broadcasts

`broadcast` sends to every online player and the console.

```java
module.api().messages().broadcast("<green>The build contest starts in 5 minutes.");
```

## ActionBroadcast

Javadoc: [ActionBroadcast](/javadoc/dev/plex/api/message/ActionBroadcast.html)

Use an `ActionBroadcast` to announce a staff action, such as "Alice put out Bob". It keeps a vanished staff member
hidden.

| Method | What it does |
|--------|--------------|
| `send(Component message)` | Sends the announcement to the audience that `captureActionBroadcast` recorded. |

`captureActionBroadcast(sender)` decides the audience when you call it:

- If the sender is the console, or a player who is not vanished, `send` goes to every online player and the console.
- If the sender is a vanished player, `send` goes to that player, the console, and the online players who can see that
  player at the time of the capture. Players who join later do not receive it.
- If the server has no SuperVanish or PremiumVanish, `send` goes to everyone.

Call `captureActionBroadcast` on the command thread of the sender, before you schedule work on another entity or region,
or start asynchronous work. You can call `send` from any thread, including the completion of a future. Call `send`
only after the action succeeds. Use one `ActionBroadcast` for one action.

```java
import dev.plex.api.message.ActionBroadcast;

private Component extinguish(CommandSender sender, Player target)
{
    // Capture on the command thread, before the work moves to the target's thread.
    ActionBroadcast announcement = api().messages().captureActionBroadcast(sender);
    Component message = api().messages().miniMessage("<aqua><actor> put out <target>.",
            Placeholder.unparsed("actor", sender.getName()),
            Placeholder.unparsed("target", target.getName()));
    ownTask(target.getScheduler().run(taskOwner(), task ->
    {
        target.setFireTicks(0);
        announcement.send(message);
    }, null));
    return null;
}
```

## Staff chat

`sendAdminChat` sends a message to staff chat on this server. Plex formats it with the `adminChatFormat` message, which
has the `<sender>`, `<prefix>`, and `<message>` tags. Online players with the `plex.adminchat` permission receive it.
Plex does not send it to the console or to other servers.

Before Plex sends the message, it calls `StaffChatMessageEvent` with the source `API`. If a listener cancels the event,
Plex sends nothing. See [Events](/api/events).

```java
MessageApi messages = module.api().messages();
messages.sendAdminChat(reporter,
        messages.miniMessage("<red>[Report]"),
        messages.playerText(reason));
```

## LoggingApi

Javadoc: [LoggingApi](/javadoc/dev/plex/api/logging/LoggingApi.html)

`LoggingApi` writes to the server console and log through the Plex logger. Each line starts with a Plex label, such as
`[Plex]` or `[Plex Error]`. You can call these methods from any thread.

| Method | What it does |
|--------|--------------|
| `info(String message, Object... args)` | Writes an information line with the `[Plex]` label. |
| `debug(String message, Object... args)` | Writes a line with the `[Plex Debug]` label, only when `debug` is `true` in the Plex `config.yml`. |
| `warn(String message, Object... args)` | Writes a warning line with the `[Plex Warning]` label. |
| `error(String message, Object... args)` | Writes an error line with the `[Plex Error]` label. |

Log messages use numbered placeholders. Plex replaces `{0}` with the first argument, `{1}` with the second, and so on.
Plex then parses the full line as MiniMessage, so you can add color tags.

```java
LoggingApi log = api().logging();
log.info("Loaded {0} homes in {1} ms", count, millis);
log.debug("Time zone: {0}", zone);
```

### Log an exception

`LoggingApi` has no exception parameter. If you pass an exception as an argument, Plex does not write its stack trace.
To log an exception with its stack trace, use your module logger. `getLogger()` on your module returns a Log4j `Logger`
with the name of your module. Put the exception last.

```java
try
{
    homes.save();
}
catch (IllegalStateException ex)
{
    getLogger().error("Could not save data/homes.yml", ex);
}
```
