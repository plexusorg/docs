---
title: Storage
description: Store module data in the Plex database with StorageApi, ModuleStorage, ModuleMigrations, and SqlDialect
---

A module can keep its own tables in the database that Plex uses. Plex gives each module a table name prefix, a
migration runner, and a [Jdbi](https://jdbi.org/) handle. The server owner picks the database in
[`data.db.storage`](/config/config): SQLite, MariaDB, or PostgreSQL. Your module ships SQL for each of the three.

The [Libraries and storage](/docs/create_module/libraries) page explains where migration files go and how to name them.
This page covers the Java API.

## Get the service

Call `api().storage()` to get the [`StorageApi`](/javadoc/dev/plex/api/storage/StorageApi.html). Then call
`forModule(this)` to get the [`ModuleStorage`](/javadoc/dev/plex/api/storage/ModuleStorage.html) for your module. Do
this once in `enable()` and keep the object.

```java
ModuleStorage storage = api().storage().forModule(this);
```

### StorageApi

| Method | What it does |
|--------|--------------|
| `forModule(PlexModule module)` | Returns the `ModuleStorage` for that module. |
| `dialect()` | Returns the `SqlDialect` that the server uses. |

### ModuleStorage

| Method | What it does |
|--------|--------------|
| `prefix()` | Returns the table name prefix of your module. |
| `table(String localName)` | Returns the full table name for one of your tables, such as `homes` to `example_homes`. |
| `migrations()` | Returns the `ModuleMigrations` runner for your module. |
| `jdbi()` | Returns the `Jdbi` instance that Plex uses. All modules share it. |

The `dev.plex:api` dependency puts Jdbi core on your compile classpath, and Plex loads Jdbi on the server. Do not add
Jdbi to your build or declare it as a `plexLibrary`.

### ModuleMigrations

| Method | What it does |
|--------|--------------|
| `run()` | Applies the migration files of your module that the database does not have yet. Throws `SQLException` if a file is missing, has a bad name, or fails. |

### SqlDialect

[`SqlDialect`](/javadoc/dev/plex/api/storage/SqlDialect.html) has three values.

| Value | Database | `migrationDirectory()` |
|-------|----------|------------------------|
| `SQLITE` | SQLite | `sqlite` |
| `MARIADB` | MariaDB or MySQL | `mariadb` |
| `POSTGRES` | PostgreSQL | `postgres` |

Use `dialect()` when one SQL statement must differ between databases, such as an upsert. The migration runner picks
the folder by itself.

## Table names

Plex makes the prefix from the `name` in your `module.yml`. It changes the name to lowercase, removes a leading
`module-`, and replaces each run of other characters with one `_`. The prefix is at most 40 characters.
`Module-Example` gets the prefix `example`.

`table("homes")` then returns `example_homes`. A local name must start with a lowercase letter and use only lowercase
letters, digits, and `_`, up to 48 characters. Any other name makes `table()` throw `IllegalArgumentException`.

The name that `table()` returns has no quotes. You can put it into SQL as it is. In a migration file, write
`{{table:homes}}`. Plex replaces the token with the same name, already quoted for the dialect, so do not add quotes
around the token.

## Migrations

Your module runs its own migrations. Call `migrations().run()` in `enable()`, before your module reads or writes its
tables.

`run()` does these steps:

1. It reads the files in `db/migration/<dialect>/` of your module JAR.
2. It sorts the files by name, so `001_...` runs before `002_...`.
3. It skips each file that the database already recorded for your module.
4. It runs each statement of a new file, then records the file name.

Plex records only the file name. If you edit a file that a server already applied, that server does not run it again.
Add a new file, such as `002_add_home_icon.sql`, for each schema change.

Plex does not wrap a file in a transaction. If a statement fails, the statements before it stay applied, and Plex does
not record the file. The next `run()` starts that file again from the top. Use `CREATE TABLE IF NOT EXISTS` and similar
forms so a second try works.

If `run()` throws, throw an exception from `enable()`. Plex then disables your module and logs the error.

## Example: player homes

This module stores named homes. The table has one SQL file for each dialect.

```sql title="src/main/resources/db/migration/sqlite/001_create_homes.sql"
CREATE TABLE IF NOT EXISTS {{table:homes}} (
    uuid VARCHAR(36) NOT NULL,
    name VARCHAR(32) NOT NULL,
    world VARCHAR(64) NOT NULL,
    x REAL NOT NULL,
    y REAL NOT NULL,
    z REAL NOT NULL,
    PRIMARY KEY (uuid, name)
);
```

```sql title="src/main/resources/db/migration/mariadb/001_create_homes.sql"
CREATE TABLE IF NOT EXISTS {{table:homes}} (
    uuid VARCHAR(36) NOT NULL,
    name VARCHAR(32) NOT NULL,
    world VARCHAR(64) NOT NULL,
    x DOUBLE NOT NULL,
    y DOUBLE NOT NULL,
    z DOUBLE NOT NULL,
    PRIMARY KEY (uuid, name)
);
```

```sql title="src/main/resources/db/migration/postgres/001_create_homes.sql"
CREATE TABLE IF NOT EXISTS {{table:homes}} (
    uuid VARCHAR(36) NOT NULL,
    name VARCHAR(32) NOT NULL,
    world VARCHAR(64) NOT NULL,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL,
    z DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (uuid, name)
);
```

The module runs the migrations and creates one executor for its database work. It shuts the executor down in
`disable()`.

```java title="HomesModule.java"
import dev.plex.api.storage.ModuleStorage;
import dev.plex.module.PlexModule;
import java.sql.SQLException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HomesModule extends PlexModule
{
    private ExecutorService databaseExecutor;
    private HomeStore homes;

    @Override
    public void enable()
    {
        ModuleStorage storage = api().storage().forModule(this);
        try
        {
            storage.migrations().run();
        }
        catch (SQLException e)
        {
            throw new IllegalStateException("Unable to create the homes tables", e);
        }

        databaseExecutor = Executors.newSingleThreadExecutor(
                Thread.ofPlatform().name("Homes-Database").daemon(true).factory());
        homes = new HomeStore(this, storage, databaseExecutor);
    }

    @Override
    public void disable()
    {
        if (databaseExecutor != null)
        {
            databaseExecutor.shutdown();
            databaseExecutor = null;
        }
        homes = null;
    }

    public HomeStore homes()
    {
        return homes;
    }
}
```

`HomeStore` runs every query on the executor. `setHome` picks the upsert SQL for the dialect. `teleportHome` loads the
home on the executor, then moves the player on the player's own scheduler.

```java title="HomeStore.java"
import dev.plex.api.storage.ModuleStorage;
import dev.plex.module.PlexModule;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import net.kyori.adventure.text.Component;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.entity.Player;
import org.jdbi.v3.core.Jdbi;

public class HomeStore
{
    private final PlexModule module;
    private final Jdbi jdbi;
    private final String homesTable;
    private final String upsertSql;
    private final Executor executor;

    public HomeStore(PlexModule module, ModuleStorage storage, Executor executor)
    {
        this.module = module;
        this.jdbi = storage.jdbi();
        this.homesTable = storage.table("homes");
        this.executor = executor;
        this.upsertSql = switch (module.api().storage().dialect())
        {
            case SQLITE, POSTGRES -> "INSERT INTO " + homesTable + " (uuid, name, world, x, y, z)"
                    + " VALUES (:uuid, :name, :world, :x, :y, :z)"
                    + " ON CONFLICT (uuid, name) DO UPDATE SET world = excluded.world,"
                    + " x = excluded.x, y = excluded.y, z = excluded.z";
            case MARIADB -> "INSERT INTO " + homesTable + " (uuid, name, world, x, y, z)"
                    + " VALUES (:uuid, :name, :world, :x, :y, :z)"
                    + " ON DUPLICATE KEY UPDATE world = VALUES(world),"
                    + " x = VALUES(x), y = VALUES(y), z = VALUES(z)";
        };
    }

    public CompletableFuture<Void> setHome(UUID player, String name, Location location)
    {
        String world = location.getWorld().getName();
        double x = location.getX();
        double y = location.getY();
        double z = location.getZ();
        return CompletableFuture.runAsync(() -> jdbi.useHandle(handle -> handle.createUpdate(upsertSql)
                .bind("uuid", player.toString())
                .bind("name", name)
                .bind("world", world)
                .bind("x", x)
                .bind("y", y)
                .bind("z", z)
                .execute()), executor);
    }

    public void teleportHome(Player player, String name)
    {
        UUID uuid = player.getUniqueId();
        CompletableFuture.supplyAsync(() -> findHome(uuid, name), executor).whenComplete((home, failure) ->
        {
            if (failure != null)
            {
                module.getLogger().error("Unable to load home {} of {}", name, uuid, failure);
                player.sendMessage(Component.text("Your home could not be loaded."));
                return;
            }
            if (home.isEmpty())
            {
                player.sendMessage(Component.text("You have no home called " + name + "."));
                return;
            }
            module.ownTask(player.getScheduler().run(module.plugin(), task ->
            {
                World world = Bukkit.getWorld(home.get().world());
                if (world == null)
                {
                    player.sendMessage(Component.text("That world is not loaded."));
                    return;
                }
                player.teleportAsync(new Location(world, home.get().x(), home.get().y(), home.get().z()));
            }, null));
        });
    }

    private Optional<HomeRow> findHome(UUID player, String name)
    {
        return jdbi.withHandle(handle -> handle.createQuery(
                        "SELECT world, x, y, z FROM " + homesTable + " WHERE uuid = :uuid AND name = :name")
                .bind("uuid", player.toString())
                .bind("name", name)
                .map((rs, ctx) -> new HomeRow(rs.getString("world"), rs.getDouble("x"), rs.getDouble("y"), rs.getDouble("z")))
                .findOne());
    }

    private record HomeRow(String world, double x, double y, double z)
    {
    }
}
```

`setHome` reads the location values before it leaves the caller's thread. The executor thread then uses only plain
values.

## Threads

- `migrations().run()` blocks until every new file is applied. Call it in `enable()` only. Do not call it from a
  command or a listener.
- Every Jdbi call blocks until the database answers. Run your queries on an executor that your module owns. Never run a
  query on a player or region thread.
- The executor thread does not own any player, entity, or block. Send messages from it directly, but schedule a world
  or player change on the scheduler that owns that state. Pass the task to `ownTask(...)`, so Plex cancels it when your
  module unloads.
- On SQLite, Plex uses one database connection for everything. A long query or transaction in your module makes Plex
  wait too, so keep each handle short.
- Use `jdbi().inTransaction(...)` or `jdbi().useTransaction(...)` when several statements must succeed together.
