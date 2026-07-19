---
title: Project setup
description: Set up the Gradle project, the module descriptor, and the main class
---

The fastest way to start is the [ExampleModule](https://github.com/plexusorg/ExampleModule) template. On GitHub, select
"Use this template" to create your own repository from it, then clone that repository. It ships the Gradle files, a
`module.yml`, and an example command and listener, so you can build it right away and change it to fit your module.

To adapt the template, change the project name in `settings.gradle.kts`, the `archiveBaseName` in `build.gradle.kts`, and
the fields in `module.yml`. The sections below explain each of these files. You can also read the source of an official
module, such as [Module-NUSH](https://github.com/plexusorg/Module-NUSH) or
[Module-FalseOp](https://github.com/plexusorg/Module-FalseOp), for a larger working example.

## settings.gradle.kts

Set the project name. All official modules use the name format `Module-<name>`.

```kotlin title="settings.gradle.kts"
rootProject.name = "Module-Example"
```

## build.gradle.kts

Plex runs on Java 25, so set the Java toolchain to 25. Add the Paper API and the Plex API as `compileOnly`
dependencies. Plex provides both at runtime, so you must not shade them into your JAR.

```kotlin title="build.gradle.kts"
plugins {
    java
    `maven-publish`
}

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
    compileOnly("io.papermc.paper:paper-api:26.1.2.build.+")
    compileOnly("dev.plex:api:2.0-SNAPSHOT")
}

group = "dev.plex"
version = "2.0-SNAPSHOT"
description = "Module-Example"

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(25))
}

tasks.getByName<Jar>("jar") {
    archiveBaseName.set("Module-Example")
    archiveVersion.set("")
}
```

The `archiveBaseName` sets the name of your JAR file. Keep the `Module-` prefix. The `archiveVersion.set("")` call removes
the version from the file name, so the built file is `Module-Example.jar`. A stable file name lets the module updater
replace the JAR in place. The ExampleModule template also includes Lombok and a Maven publishing block, which you can keep
or remove.

Build the project once with Gradle to confirm that everything resolves.

## The module descriptor

Create `src/main/resources/module.yml`. Plex reads this file to load your module.

```yaml title="src/main/resources/module.yml"
name: Module-Example
main: dev.plex.ExampleModule
description: An example module for Plex
version: 2.0-SNAPSHOT
apiCompatibility: 1
```

The fields are as follows.

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | The module name. Plex uses it for the data folder and for `/plex modules` commands. |
| `main` | Yes | The full class name of your main module class. |
| `description` | No | A short description. The default is `A Plex module`. |
| `version` | No | The module version. The default is `1.0`. |
| `apiCompatibility` | Yes | The Plex API version that your module needs. This must be an integer. |

The `apiCompatibility` value must match the API version of the Plex build that loads the module. Plex provides API
version `1`. If the numbers do not match, Plex skips the module and writes a warning to the console. When the module API
changes in a way that breaks modules, this number increases, and a module must set the new value to match.

Two optional blocks control extra libraries and the updater. See [Libraries and storage](/docs/create_module/libraries)
and [Build and install](/docs/create_module/install).

## The main class

Your main class extends `PlexModule`. Register your commands and listeners in `enable()`. Pass `this` to a command or
listener that needs the module, so it can reach `api()` and your config.

```java title="src/main/java/dev/plex/ExampleModule.java"
package dev.plex;

import dev.plex.command.ExampleCommand;
import dev.plex.listener.ExampleListener;
import dev.plex.module.PlexModule;

public class ExampleModule extends PlexModule
{
    @Override
    public void enable()
    {
        registerCommand(new ExampleCommand());
        registerListener(new ExampleListener(this));
        api().logging().info("{0} enabled with Plex API compatibility {1}",
                getPlexModuleFile().getName(),
                api().compatibility().version());
    }

    @Override
    public void disable()
    {
        // Unregistering listeners / commands is handled by Plex
    }
}
```

`PlexModule` also gives you these helper methods.

| Method | Description |
|--------|-------------|
| `api()` | Returns the Plex API facade. |
| `registerCommand(PlexCommand)` | Registers a command owned by this module. |
| `registerListener(Listener)` | Registers a listener owned by this module. |
| `unregisterCommand(PlexCommand)` / `unregisterListener(Listener)` | Removes a command or listener. |
| `getDataFolder()` | Returns the module data folder, `plugins/Plex/modules/<name>/`. |
| `getLogger()` | Returns the module logger. |
| `getResource(String)` | Opens a file from the module JAR. |
| `loadMessages(String)` | Loads the module message file. See [Messages](/docs/create_module/configuration#messages). |

Plex removes tracked commands and listeners for you when the module disables. You only need `disable()` for resources that
Plex does not track, such as an external connection or a third-party listener.
