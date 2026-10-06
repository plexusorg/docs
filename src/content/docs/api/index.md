---
title: Plex API
description: Get the Plex API in a module or a plugin, and learn the rules that every service follows
---

The Plex API lets your code use Plex features: players, punishments, messages, notes, storage, and more. Two kinds of
code use it:

- **Plex modules.** A module is a JAR that Plex loads from `plugins/Plex/modules/`. See
  [Create a module](/docs/create_module/setup).
- **Bukkit and Paper plugins.** Any plugin on the server can get the API from Bukkit's services manager.

All services hang off one interface, `dev.plex.api.PlexApi`. The full reference is in the [Javadocs](/javadoc/index.html).

## Get the API in a module

Call `api()` on your `PlexModule`. It returns the same `PlexApi` object every time.

```java
api().logging().info("Hello from {0}", getPlexModuleFile().getName());
```

`api()` works from `load()` onward. A listener or command does not have its own `api()` method, so pass your module to
it. See [Listeners](/docs/create_module/listeners).

## Get the API in a plugin

Plex registers `PlexApi` in Bukkit's services manager when Plex loads. Get it in your `onEnable()` method.

```java
import dev.plex.api.PlexApi;
import org.bukkit.plugin.java.JavaPlugin;

public final class MyPlugin extends JavaPlugin
{
    private PlexApi plex;

    @Override
    public void onEnable()
    {
        plex = getServer().getServicesManager().load(PlexApi.class);
        if (plex == null)
        {
            getLogger().severe("Plex is not installed. Disabling.");
            getServer().getPluginManager().disablePlugin(this);
            return;
        }
        getLogger().info("Plex API compatibility version: " + plex.apiCompatibilityVersion());
    }
}
```

`load` returns `null` only when Plex is not on the server. If you declare Plex as a required dependency, the server
does not enable your plugin without Plex.

### Declare the dependency

Your plugin must load after Plex, and it must be able to see the Plex classes. The plugin name is `Plex`.

For a Paper plugin, add Plex to `paper-plugin.yml`:

```yaml title="paper-plugin.yml"
dependencies:
  server:
    Plex:
      load: BEFORE
      required: true
      join-classpath: true
```

`load: BEFORE` makes Plex load before your plugin. `join-classpath: true` gives your plugin access to the Plex classes.
Set `required: false` if your plugin can run without Plex. Then check `load` for `null` as in the example above.

For a Bukkit plugin, add Plex to `plugin.yml`:

```yaml title="plugin.yml"
depend: [Plex]
```

Use `softdepend: [Plex]` instead if your plugin can run without Plex.

### Gradle

Add the Plex repository and the API as a `compileOnly` dependency. Plex supplies the API classes at runtime, so do not
shade them into your JAR.

```kotlin title="build.gradle.kts"
repositories {
    maven {
        url = uri("https://repo.papermc.io/repository/maven-public/")
    }
    maven {
        url = uri("https://nexus.telesphoreo.me/repository/plex/")
    }
    mavenCentral()
}

dependencies {
    compileOnly("io.papermc.paper:paper-api:26.2.build.+")
    compileOnly("dev.plex:api:2.0")
}
```

The API brings the Paper API, JDBI, and Gson onto your compile classpath, because its public types use them. Gradle
needs the Paper repository to resolve the Paper API. Modules use the same setup. See
[Project setup](/docs/create_module/setup).

## API compatibility version

`apiCompatibilityVersion()` returns the API version of the running Plex build, as an `int`. Plex 2.0 returns `1`.

The number changes only when the API changes in a way that breaks existing code. Plex uses it in two places:

- **Module loading.** Each module declares `apiCompatibility` in its `module.yml`. Plex loads the module only when the
  value is equal to `apiCompatibilityVersion()`. Plex skips any other module and writes a warning to the console.
- **Module updates.** The module updater downloads only module builds made for the same API version.

A plugin can read the value to check that it runs against an API version it supports.

## Rules that apply to every service

### Futures

Methods that read or write the database, or that do slow work, return a `CompletableFuture`. These include player
lookups, tag changes, ban checks, punishments, notes, player module data, and rollbacks. The method returns at once. The
result arrives later.

Do not call `join()` or `get()` on a server or region thread. Those calls block the thread until the database answers.
Attach a callback instead, such as `thenAccept`.

Your callback runs on one of these threads:

- **Your own thread**, when Plex already had the answer in memory. For example, Plex caches online players, so a lookup
  of an online player is often complete before the method returns.
- **A Plex worker thread**, when Plex had to read the database or do other slow work.
- **A thread of another plugin**, such as the rollback plugin that Plex calls.

Do not assume one of these. Treat every callback as if it runs off the server thread.

A callback can send messages directly. Adventure messaging needs no scheduler. To change server state, such as an
inventory, a block, or a world, move only that change to the scheduler that owns the state:

| State you change | Scheduler |
|------------------|-----------|
| A player or other entity | `entity.getScheduler()` |
| A block, a chunk, or a location | `Bukkit.getRegionScheduler()` |
| Global state, such as world settings | `Bukkit.getGlobalRegionScheduler()` |

These schedulers work on Paper and on Folia. In a module, pass `plugin()` as the task owner and give the task to
`ownTask(...)`, so Plex cancels it when the module unloads. This module gives a player a kit once:

```java
import dev.plex.api.player.PlayerModuleData;
import dev.plex.module.PlexModule;
import org.bukkit.Material;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;

public class StarterKitModule extends PlexModule
{
    public void giveStarterKit(Player player)
    {
        PlayerModuleData data = api().players().moduleData(this, player.getUniqueId());
        data.getBoolean("kit_claimed", false).thenAccept(claimed ->
        {
            // This callback runs on a Plex worker thread or on the calling thread.
            if (claimed)
            {
                return;
            }
            // The inventory belongs to the player, so change it on the player's scheduler.
            ownTask(player.getScheduler().run(plugin(), task ->
                    player.getInventory().addItem(new ItemStack(Material.BREAD, 16)), null));
            data.set("kit_claimed", true);
        }).exceptionally(failure ->
        {
            getLogger().error("Could not read the starter kit state", failure);
            return null;
        });
    }
}
```

A future can fail. For example, it fails when the database is not available, when you pass an invalid key, or when you
punish a player that Plex does not know. Handle failures with `exceptionally`, `handle`, or `whenComplete`. If you do
not, the error is lost.

### Missing values

- A lookup that can find nothing returns an `Optional`, or a future of an `Optional`. For example,
  `players().player(uuid)` returns `CompletableFuture<Optional<PlexPlayerView>>`.
- A getter that can return `null` has the `@Nullable` annotation. For example, `PunishmentView.endDate()` is `null` for
  a punishment with no end date.
- Do not pass `null` to a parameter without `@Nullable`. Plex throws a `NullPointerException`.

### Returned objects

- **Lists and collections** are copies that you cannot change. Plex does not update them later. Call the method again to
  get fresh data.
- **Views**, such as `PlexPlayerView` and `PunishmentView`, are read-only. You change data only through service methods,
  such as `players().setTag(...)` or `punishments().punish(...)`.
- A `PlexPlayerView` for an online player reads Plex's live record of that player, so its values can change between
  calls. A view for an offline player holds the data that Plex read from the database. Look the player up again when you
  need current data, and do not keep views for a long time.

### Module-only methods

Three methods take your `PlexModule` as an argument: `players().moduleData(...)`, `moduleConfigs().create(...)`, and
`storage().forModule(...)`. Plex uses the module name to keep each module's data apart. A plugin has no `PlexModule`, so
these methods are for modules only.

## Services

| Method | What it does |
|--------|--------------|
| [`players()`](/api/players) | Looks up players, sets player tags, lists online names, and stores per-module player data. |
| [`punishments()`](/api/punishments) | Checks bans, removes bans, issues punishments, and reads indefinite bans. |
| [`messages()`](/api/messages) | Formats MiniMessage and Plex messages, renders chat lines, broadcasts, and sends staff chat. |
| [`commands()`](/api/commands-and-configuration) | Registers commands, lists the commands that Plex tracks, and runs a command as the console. |
| [`configuration()`](/api/commands-and-configuration) | Reads the Plex config, messages, indefinite bans, and toggles files. |
| [`moduleConfigs()`](/api/commands-and-configuration) | Creates a configuration file for a module. |
| [`storage()`](/api/storage) | Gives a module SQL access and migrations, and tells you the SQL dialect. |
| [`notes()`](/api/notes-rollback-modules) | Lists, adds, removes, and clears player notes. |
| [`rollback()`](/api/notes-rollback-modules) | Rolls back the blocks that a player changed, through the rollback plugin on the server. |
| [`modules()`](/api/notes-rollback-modules) | Lists the loaded modules and reads their `module.yml` data. |
| [`logging()`](/api/messages) | Writes `info`, `debug`, `warn`, and `error` messages to the Plex log. |
| `apiCompatibilityVersion()` | Returns the API version of this Plex build. See [above](#api-compatibility-version). |

Plex also fires two Bukkit events that you can listen to. See [Events](/api/events).

For every class and method, see the [Javadocs](/javadoc/index.html). Start at
[`PlexApi`](/javadoc/dev/plex/api/PlexApi.html).
