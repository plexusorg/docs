---
title: Listeners
description: Add an event listener to a Plex module
---

A listener extends `PlexListener`. It works like any Bukkit listener, with `@EventHandler` methods. A listener has no
built-in `api()` method, so pass the module to the listener if the listener needs the API.

```java title="src/main/java/dev/plex/listener/ExampleListener.java"
package dev.plex.listener;

import dev.plex.ExampleModule;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.PlayerJoinEvent;

public class ExampleListener extends PlexListener
{
    private final ExampleModule module;

    public ExampleListener(ExampleModule module)
    {
        this.module = module;
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event)
    {
        Player player = event.getPlayer();
        player.sendMessage(module.api().messages().miniMessage(
                "<gold>ExampleModule is awake!</gold> "
                        + "<click:run_command:'/examplemodule sparkle'>"
                        + "<hover:show_text:'<gray>Click for a tiny celebration</gray>'>"
                        + "<aqua>[Try a sparkle]</aqua>"
                        + "</hover></click>"));
    }
}
```

Register the listener in `enable()`. Pass the module so the listener can reach the API.

```java
registerListener(new ExampleListener(this));
```

One listener class can handle many events. Plex unregisters your Bukkit listeners for you when the module disables.

:::caution
Plex only tracks Bukkit listeners. If you register a listener with another system, such as PacketEvents, Plex cannot
remove it. Remove that listener yourself in `disable()`.
:::
