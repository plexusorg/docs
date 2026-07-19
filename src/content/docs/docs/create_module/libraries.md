---
title: Libraries and storage
description: Add runtime libraries, database storage, and scheduled tasks to a Plex module
---

## Extra libraries

If your module needs a third-party library at runtime, do not shade it into the JAR. Declare it, and Plex downloads and
loads it before your module starts. The Plex Modules Gradle Plugin writes the library metadata into your `module.yml`
during the build.

Apply the plugin, then add the plugin repository so Gradle can resolve it.

```kotlin title="settings.gradle.kts"
pluginManagement {
    repositories {
        maven("https://nexus.telesphoreo.me/repository/gradle-plugins-releases/")
        gradlePluginPortal()
        mavenCentral()
    }
    resolutionStrategy {
        eachPlugin {
            if (requested.id.id == "dev.plex.module") {
                useModule("dev.plex:plex-modules-gradle-plugin:${requested.version}")
            }
        }
    }
}

rootProject.name = "Module-Example"
```

```kotlin title="build.gradle.kts"
plugins {
    java
    id("dev.plex.module") version "1.2"
}
```

Declare each runtime library with the `plexLibrary` configuration. Use fixed versions only. The plugin rejects version
ranges, dynamic versions, `latest.*` selectors, and classifiers, so the metadata stays exact.

```kotlin
dependencies {
    plexLibrary("org.eclipse.jetty:jetty-server:12.1.9")
}
```

The plugin injects a `libraries` list into `module.yml`. A `plexLibrary` dependency is also a compile dependency, so you
can use the classes directly.

Libraries on Maven Central resolve without extra setup. If a library is on another repository, tell the plugin to include
that repository in the metadata. Give the repository a name in `build.gradle.kts`, then reference the same name.

```kotlin title="build.gradle.kts"
repositories {
    maven {
        name = "myrepo"
        url = uri("https://repo.example.com/releases/")
    }
}

plexModule {
    includeRepository("myrepo")
}
```

The plugin writes a `repositories` map into `module.yml`, so Plex can find the library at runtime.

## Store data in the database

A module can use the same database that Plex uses. Plex supports SQLite, MariaDB, and PostgreSQL. Reach the database
through `api().storage()`.

`api().storage().forModule(this)` returns a `ModuleStorage` object scoped to your module. It gives you a table name prefix,
a helper to build prefixed table names, a migration runner, and a JDBI handle for queries. Ship your schema as versioned
SQL files and run them through `migrations()`, so the tables are created on first run and upgraded on later runs.

For simple per-player values, `api().players().moduleData(this, uuid)` returns a small key-value store for one player,
scoped to your module. It reads and writes strings, numbers, booleans, and JSON.

## Run tasks on a schedule

Reach the scheduler through `api().scheduler()`. The scheduler is Folia-aware, so use it instead of the Bukkit scheduler
when you need Folia support. It has methods for global tasks, asynchronous tasks, region tasks, and entity tasks, and an
`asyncExecutor()` for `CompletableFuture` work.

```java
api().scheduler().runAsync(task -> {
    // Runs off the main thread.
});
```
