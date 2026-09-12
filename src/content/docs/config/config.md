---
title: Configuration
description: All of the configuration options for the config.yml file within Plex
---

This page shows you how to change the Plex configuration files. The main file is at `/plugins/Plex/config.yml`. Plex
keeps entity settings, world settings, toggles, and protection presets in their own files in the same folder.

## Default configuration

Below is the default `config.yml` file that Plex writes on first startup.

```yaml title="/plugins/Plex/config.yml"
# Plex Configuration File
# For documentation, please visit: https://plex.us.org

server:
  name: "Plexus"
  motd: "<servername> - Minecraft <mcversion>"
  colorize_motd: true
  sample:
    - "&cForums: https://forum.plex.us.org"
  # What timezone should various messages appear in (e.g. ban message end date)
  timezone: Etc/UTC

# Ban message is customized in the messages.yml file. The URL to appeal at is below.
banning:
  ban_url: "https://forum.plex.us.org"
  admission-cache-seconds: 60
  admission-cache-size: 10000

punishments:
  mute-timer: 300
  freeze-timer: 300

chat:
  # Should the server use Plex's chat system? It is recommended to keep this on if you are using ranks.
  # If you are using permissions, you should turn this off and use Vault to handle prefixes with a different chat plugin
  enabled: true
  # The maximum amount of characters a player can have for their tag
  # This does not include color tags such as <red> or <rainbow>
  max-tag-length: 64
  # The chat format can be customized here if the Plex chat system is enabled
  format: "<prefix> <white><name> <gray>» <reset><message>"

# Group names must match the primary group returned by your permissions plugin.
# Colors appear in the tab list and in generated login messages.
# Groups without a configured title do not receive a generated login message.
groups:
  admin:
    color: '<aqua>'
    title: 'Admin'
  senior:
    color: '<light_purple>'
    title: 'Senior Admin'
  executive:
    color: '<blue>'
    title: 'Executive'
  masterbuilder:
    color: '<dark_aqua>'
    title: 'Master Builder'

# Login Messages
loginmessages:
  # Should custom login messages be required to contain the player's name?
  name: true
  # Should custom login messages be required to contain the player's configured group title?
  group: true
  # Format used for generated group login messages.
  # Available placeholders: <player>, <group>, <group_key>, <title>, <article>, and <group_color>.
  default-format: '<aqua><player> is <article> <group>'

data:
  db:
    storage: sqlite # Use mariadb, postgres, or sqlite here
    user: ""
    password: ""
    hostname: 127.0.0.1
    port: 3306
    name: "plex"
  redis: # Leave password blank if auth is false
    enabled: false
    auth: true
    hostname: 127.0.0.1
    port: 6379
    password: ""

# These commands will be blocked when a player is muted or when chat is toggled off.
block_on_mute:
  - me
  - say
  - msg
  - reply
  - mail

# Static updater metadata. The metadata can be hosted as plain JSON on Cloudflare Pages.
updater:
  enabled: true
  interval: 1800
  channel: "dev"

# Additional logging for debugging
debug: false
```

## Server

### server.name

The name of your server. Plex uses it throughout the plugin, including the `<servername>` placeholder.

### server.motd

The text that appears on the server list. Plex replaces `<servername>` with the server name and `<mcversion>` with the
Minecraft version.

### server.colorize_motd

If `true`, Plex colorizes the MOTD at random. Set it to `false` to color the MOTD yourself.

### server.sample

A custom message that appears under the player count in the server list.

### server.timezone

The timezone for time-based messages, such as the end date in a ban message.

## Banning

### banning.ban_url

The appeal URL that the ban message shows. You change the full ban message in `messages.yml`.

### banning.admission-cache-seconds

**Default:** `60`

How long, in seconds, Plex keeps a join decision in memory before it asks the database again.

### banning.admission-cache-size

**Default:** `10000`

How many join decisions Plex keeps in memory.

## Punishments

### punishments.mute-timer

**Default:** `300`

The default duration, in seconds, of a mute set with `/mute` when you do not give a time.

### punishments.freeze-timer

**Default:** `300`

The default duration, in seconds, of a freeze set with `/freeze` when you do not give a time.

## Chat

### chat.enabled

**Default:** `true`

Enables the Plex chat system. Turn this off if you use a permissions plugin and want another plugin to handle prefixes.

### chat.max-tag-length

**Default:** `64`

The maximum length of a tag in game. This counts characters only. It does not count MiniMessage tags.

### chat.format

**Default:** `"<prefix> <white><name> <gray>» <reset><message>"`

The chat format. Plex replaces `<prefix>` with the player prefix, `<name>` with the player name, and `<message>` with
the message.

## Groups

### groups.\<group\>.color

Sets a color for a group in your permissions plugin. The color appears in the tab list. Match the group name to the
primary group that your permissions plugin returns for the player. The four groups in the default file are examples. You
can use your own group names. Plex uses white for a group with no color.

### groups.\<group\>.title

The readable rank name that Plex puts in generated login messages, such as `Senior Admin`. A group with no title gets no
generated login message.

## Login Messages

### loginmessages.name

**Default:** `true`

Requires players to include their name when they set a login message.

### loginmessages.group

**Default:** `true`

Requires players to include their group title when they set a login message.

### loginmessages.default-format

The format of the generated group login message. You can use the placeholders `<player>`, `<group>`, `<group_key>`,
`<title>`, `<article>`, and `<group_color>`.

## Data

### data.db.storage

**Options:** `sqlite`, `mariadb`, `postgres`

The database that Plex uses for player data. `sqlite` is the default. Plex does not transfer data when you change the
storage type. SQLite writes to `plugins/Plex/database.db`.

### data.db.user

The database username. SQLite does not need a username.

### data.db.password

The database password. SQLite does not need a password.

### data.db.hostname

The database hostname. SQLite does not need a hostname.

### data.db.port

The database port. SQLite does not need a port.

:::info
The default port `3306` is the MySQL and MariaDB port. Change it to `5432` if you use PostgreSQL.
:::

### data.db.name

The database name. SQLite does not use this value.

### data.redis.enabled

**Options:** `true` / `false`

Enables the Plex Redis features.

### data.redis.auth

**Options:** `true` / `false`

Turns on authentication for Redis.

:::info
We recommend that you turn on Redis authentication.
:::

### data.redis.hostname

The Redis hostname. Redis needs this value to work.

### data.redis.port

The port that Redis listens on. Redis needs this value to work.

### data.redis.password

The Redis password. Leave this blank if authentication is off.

## Blocking

### block_on_mute

The commands that Plex blocks when a player is muted or when chat is off.

## Entity settings

Plex keeps the entity settings in `/plugins/Plex/entities.yml`. If your `config.yml` still holds these settings from an
older version, Plex moves them into `entities.yml` at the first startup.

```yaml title="/plugins/Plex/entities.yml"
# Plex Entity Configuration

# All entities listed here will NOT be wiped by /entitywipe.
# By default this includes all mobs, as /mobpurge can be used to purge mobs.
entitywipe_list:
  - "ITEM_FRAME"
  - "ALLAY"
  - "ARMADILLO"
  - "AXOLOTL"
  - "BAT"
  - "BEE"
  - "BLAZE"
  - "BOGGED"
  - "BREEZE"
  - "CAMEL"
  - "CAMEL_HUSK"
  - "CAT"
  - "CAVE_SPIDER"
  - "CHICKEN"
  - "COD"
  - "COPPER_GOLEM"
  - "COW"
  - "CREAKING"
  - "CREEPER"
  - "DOLPHIN"
  - "DONKEY"
  - "DROWNED"
  - "ELDER_GUARDIAN"
  - "ENDER_DRAGON"
  - "ENDERMAN"
  - "ENDERMITE"
  - "EVOKER"
  - "FOX"
  - "FROG"
  - "GHAST"
  - "GIANT"
  - "GLOW_SQUID"
  - "GOAT"
  - "GUARDIAN"
  - "HAPPY_GHAST"
  - "HOGLIN"
  - "HORSE"
  - "HUSK"
  - "ILLUSIONER"
  - "IRON_GOLEM"
  - "LLAMA"
  - "MAGMA_CUBE"
  - "MULE"
  - "MUSHROOM_COW"
  - "NAUTILUS"
  - "OCELOT"
  - "PANDA"
  - "PARCHED"
  - "PARROT"
  - "PHANTOM"
  - "PIG"
  - "PIGLIN"
  - "PIGLIN_BRUTE"
  - "PILLAGER"
  - "POLAR_BEAR"
  - "PUFFERFISH"
  - "RABBIT"
  - "RAVAGER"
  - "SALMON"
  - "SHEEP"
  - "SHULKER"
  - "SILVERFISH"
  - "SKELETON"
  - "SKELETON_HORSE"
  - "SLIME"
  - "SNIFFER"
  - "SNOWMAN"
  - "SPIDER"
  - "SQUID"
  - "STRAY"
  - "STRIDER"
  - "TADPOLE"
  - "TRADER_LLAMA"
  - "TROPICAL_FISH"
  - "TURTLE"
  - "VEX"
  - "VILLAGER"
  - "VINDICATOR"
  - "WANDERING_TRADER"
  - "WARDEN"
  - "WITCH"
  - "WITHER"
  - "WITHER_SKELETON"
  - "WOLF"
  - "ZOGLIN"
  - "ZOMBIE"
  - "ZOMBIE_HORSE"
  - "ZOMBIE_NAUTILUS"
  - "ZOMBIE_VILLAGER"
  - "ZOMBIFIED_PIGLIN"

# Automatically wipe the specified entities.
autowipe:
  enabled: true
  # Interval in seconds. The default is five minutes.
  interval: 300
  entities:
    - "DROPPED_ITEM"

# Blocks that players may not place.
blocked_blocks:
  - "SPAWNER"
  - "STRUCTURE_BLOCK"
  - "JIGSAW"

# Entities that players may not spawn.
blocked_entities:
  - "WITHER"
  - "ENDER_DRAGON"
  - "MINECART_TNT"

# Limit living entities per chunk.
entity_limit:
  mob_limit_enabled: true
  max_mobs_per_chunk: 50
  mob_limit_ceiling: 500
```

### entitywipe_list

Plex does not wipe the entities in this list. By default the list holds every mob, because you can remove mobs with the
`mobpurge` command.

### autowipe.enabled

**Options:** `true` / `false`

Enables automatic entity wiping.

### autowipe.interval

**Default:** `300`

How often, in seconds, to wipe entities. The default is 5 minutes.

### autowipe.entities

The list of entities to wipe automatically.

### blocked_blocks

The blocks that players cannot place.

### blocked_entities

The entities that players cannot spawn.

### entity_limit.mob_limit_enabled

**Default:** `true`

Enables the mob limiter.

### entity_limit.max_mobs_per_chunk

**Default:** `50`

The maximum number of mobs in a chunk.

### entity_limit.mob_limit_ceiling

**Default:** `500`

The highest value that you can set the mob limit to.

## World settings

Plex keeps the world settings in `/plugins/Plex/worlds.yml`. If your `config.yml` still holds these settings from an
older version, Plex moves them into `worlds.yml` at the first startup.

```yaml title="/plugins/Plex/worlds.yml"
# Plex World Configuration
# See https://docs.plex.us.org/docs/customization/config#worlds for documentation.

# These gamerules apply to every world on the server.
global_gamerules:
  - "advance_weather;true"
  - "advance_time;true"
  - "spawn_mobs;false"
  - "spawn_monsters;false"
  - "spawn_patrols;false"
  - "spawn_phantoms;false"
  - "spawn_wandering_traders;false"
  - "spawn_wardens;false"
  - "keep_inventory;true"
  - "mob_drops;false"
  - "mob_griefing;false"
  - "block_drops;false"
  - "command_block_output;false"
  - "natural_health_regeneration;true"
  - "show_advancement_messages;false"
  - "show_death_messages;false"
  - "send_command_feedback;false"

worlds:
  flatlands:
    name: "Flatlands"
    modification:
      permission: "plex.world.flatlands.modify"
      message: "<red>You do not have permission to modify this world."
    gameRules:
      # These gamerules override the global gamerules.
      - "advance_weather;false"
      - "advance_time;false"
    parameters:
      grass_block: 1
      dirt: 32
      stone: 16
      bedrock: 1
  adminworld:
    name: "Admin World"
    entry:
      permission: "plex.world.adminworld.enter"
      message: "<red>You do not have permission to enter this world."
    modification:
      permission: "plex.world.adminworld.modify"
      message: "<red>You do not have permission to modify this world."
    gameRules:
      - "advance_weather;false"
      - "advance_time;false"
    parameters:
      grass_block: 1
      dirt: 32
      stone: 16
      bedrock: 1
  masterbuilderworld:
    name: "MasterBuilder World"
    entry:
      permission: "plex.world.masterbuilderworld.enter"
      message: "<red>You do not have permission to enter this world."
    modification:
      permission: "plex.world.masterbuilderworld.modify"
      message: "<red>You do not have permission to modify this world."
    gameRules:
      - "advance_weather;false"
      - "advance_time;false"
    parameters:
      grass_block: 1
      dirt: 32
      stone: 16
      bedrock: 1
```

### global_gamerules

The gamerules for every world on the server. A per-world gamerule overrides the global value. Each entry is the gamerule
name, a semicolon, and `true` or `false`. Use the current Minecraft gamerule names, such as `advance_time`,
`keep_inventory`, and `spawn_mobs`.

### worlds

You can generate as many worlds as you want from the configuration file. Plex generates a few by default. The format for
a new world is below.

```yaml title="/plugins/Plex/worlds.yml"
  <world name>:
    name: "Human readable world name"
    entry:
      # The permission required to enter the world, optional
      permission: "plex.world.worldname.enter"
      # The message to show if a player cannot enter, optional
      message: "<red>You do not have permission to enter this world."
    modification:
      # The permission required to modify the world, optional
      permission: "plex.world.worldname.modify"
      # The message to show if a player cannot modify the world, optional
      message: "<red>You do not have permission to modify this world."
    gameRules:
      - "advance_weather;false"
      - "advance_time;false"
    parameters:
      grass_block: 1
      dirt: 32
      stone: 16
      bedrock: 1
```

The `parameters` section sets how the world generates. The order runs from the top layer to the bottom layer. The example
above generates one grass layer, then 32 dirt layers, then 16 stone layers, then one bedrock layer.

The `gameRules` section sets the gamerules for the world. Each entry is the gamerule name, a semicolon, and `true` or
`false`.

## Toggles

Plex keeps the current state of each `/toggle` option in `/plugins/Plex/toggles.yml`. Plex saves a change to the file, so
the state survives a restart. You can also edit the file and run `/plex reload` to apply it.

```yaml title="/plugins/Plex/toggles.yml"
# Plex Toggles

# Should explosions be allowed to damage blocks?
explosions: false

# Should fluid spread be enabled?
fluidspread: true

# Should players be allowed to drop items?
drops: true

# Should redstone be enabled?
redstone: true

# Is chat enabled?
chat: true

# Is PVP enabled?
pvp: true
```

## Protection

Plex can create and keep WorldGuard regions. You need WorldGuard installed to use the `/protect` command. Plex keeps the
flag presets and the regions it manages in `/plugins/Plex/protection.yml`.

The file ships with the presets `spawn`, `pvp`, `safe-zone`, `town`, `protected-build`, `mob-free`, `private`, and
`creative-zone`. Each preset holds a description and a list of WorldGuard flags.

### Commands

- `/protect create <region> <preset>` creates a region from your current WorldEdit selection.
- `/protect create <region> <preset> <radius>` creates a full-height square around you instead.
- `/protect apply <region> <preset>` changes a region to another preset.
- `/protect remove <region>` removes a region from the world.
- `/protect list` lists the regions that Plex manages.
- `/protect presets` lists the presets and their descriptions.
- `/protect reload` reloads `protection.yml` and synchronizes the managed regions.

Plex writes the regions it manages back into `protection.yml` under the `regions` key. It restores those regions and
their flags when the server starts.

## Updates

### updater.enabled

**Default:** `true`

Enables the update check.

### updater.interval

**Default:** `1800`

How often, in seconds, Plex checks for an update. The lowest value is `60`.

### updater.channel

**Options:** `stable`, `dev`

The update channel that Plex checks. Plex sets this value itself at every startup. A development build uses `dev` and a
release build uses `stable`. Do not edit it. Run `/plex update` to install the newest build.

## Debugging

### debug

**Options:** `true` / `false`

Enables extra logging in the console. This helps you diagnose problems. Keep it off during normal use.
