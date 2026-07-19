---
title: Configuration
description: All of the configuration options for the config.yml file within Plex
---

This page shows you how to change the Plex configuration file. The file is at `/plugins/Plex/config.yml`.

## Default configuration

Below is the default `config.yml` file that Plex writes on first startup.

```yaml title="/plugins/Plex/config.yml"
# Plex Configuration File
# For documentation, please visit: https://plex.us.org

server:
  name: "Plexus"
  motd: "%servername% - Minecraft %mcversion%"
  colorize_motd: true
  sample:
    - "&cForums: https://forum.plex.us.org"
  # What timezone should various messages appear in (e.g. ban message end date)
  timezone: Etc/UTC

# Ban message is customized in the messages.yml file. The URL to appeal at is below.
banning:
  ban_url: "https://forum.plex.us.org"

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
  format: "{prefix} <white>{name} <gray>» <reset>{message}"

# You can define colors for each group which will appear in the tab list
colors:
  admin: '<aqua>'
  senior: '<light_purple>'
  executive: '<blue>'
  masterbuilder: '<dark_aqua>'

# Login Messages
loginmessages:
  # Should the player be required to put their name in the login message?
  name: true

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

# Mob limiter / Entity wiping config
# All entities listed here will NOT be wiped upon wiping entities
# By default this includes all mobs, as the mobpurge command can be used to purge mobs.
entitywipe_list:
  - "ITEM_FRAME"
  - "ALLAY"
  # ... the full list of mobs continues here
  - "ZOMBIFIED_PIGLIN"

# Automatically wipe the specified entities
autowipe:
  # Should we automatically wipe entities?
  enabled: true
  # How often, in seconds, to automatically wipe entities. Default is 5 minutes.
  interval: 300
  # Entities to automatically wipe
  entities:
    - "DROPPED_ITEM"

# What blocks should be blocked?
blocked_blocks:
  - "SPAWNER"
  - "STRUCTURE_BLOCK"
  - "JIGSAW"

# What entities should be blocked?
blocked_entities:
  - "WITHER"
  - "ENDER_DRAGON"
  - "MINECART_TNT"

# These commands will be blocked when a player is muted or when chat is toggled off.
block_on_mute:
  - me
  - say
  - msg
  - reply
  - mail

# Limit entities per chunk
entity_limit:
  # Is the mob limit enabled?
  mob_limit_enabled: true
  # The maximum number of mobs allowed in a chunk
  max_mobs_per_chunk: 50
  # The available ceiling for the maximum number of mobs
  mob_limit_ceiling: 500

# These gamerules apply to all worlds on the server
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
      # The gamerules here override the global gamerules
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

# Static updater metadata. The metadata can be hosted as plain JSON on Cloudflare Pages.
updater:
  # Update channel to use. stable only serves non-SNAPSHOT releases; dev serves development builds.
  channel: "stable"

# Additional logging for debugging
debug: false
```

The `entitywipe_list` in the real file names every mob type. The list above is shortened for space.

## Server

### server.name

The name of your server. Plex uses it throughout the plugin, including the `%servername%` placeholder.

### server.motd

The text that appears on the server list.

### server.colorize_motd

If `true`, Plex colorizes the MOTD at random. Set it to `false` to color the MOTD yourself.

### server.sample

A custom message that appears under the player count in the server list.

### server.timezone

The timezone for time-based messages, such as the end date in a ban message.

## Banning

### banning.ban_url

The appeal URL that the ban message shows. You change the full ban message in `messages.yml`.

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

**Default:** `"{prefix} <white>{name} <gray>» <reset>{message}"`

The chat format. Plex replaces `{prefix}` with the player prefix, `{name}` with the player name, and `{message}` with
the message.

## Colors

### colors.\<group\>

Sets a color for a group in your permissions plugin. The color appears in the tab list. The group name is the primary
group that Vault returns for the player. The four keys in the default file are examples. You can use your own group
names. Plex uses white for a group with no color.

## Login Messages

### loginmessages.name

**Default:** `true`

Requires players to include their name when they set a login message.

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

## Entity wiping

### entitywipe_list

Plex does not wipe the entities in this list. By default the list holds every mob, because you can remove mobs with the
`mobpurge` command.

## Autowiping

### autowipe.enabled

**Options:** `true` / `false`

Enables automatic entity wiping.

### autowipe.interval

**Default:** `300`

How often, in seconds, to wipe entities. The default is 5 minutes.

### autowipe.entities

The list of entities to wipe automatically.

## Blocking

### blocked_blocks

The blocks that players cannot place.

### blocked_entities

The entities that players cannot spawn.

### block_on_mute

The commands that Plex blocks when a player is muted or when chat is off.

## Entity limits

### entity_limit.mob_limit_enabled

**Default:** `true`

Enables the mob limiter.

### entity_limit.max_mobs_per_chunk

**Default:** `50`

The maximum number of mobs in a chunk.

### entity_limit.mob_limit_ceiling

**Default:** `500`

The highest value that you can set the mob limit to.

## Global gamerules

### global_gamerules

The gamerules for every world on the server. A per-world gamerule overrides the global value. Each entry is the gamerule
name, a semicolon, and `true` or `false`. Use the current Minecraft gamerule names, such as `advance_time`,
`keep_inventory`, and `spawn_mobs`.

## Worlds

You can generate as many worlds as you want from the configuration file. Plex generates a few by default. The format for
a new world is below.

```yaml title="/plugins/Plex/config.yml"
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

## Updates

### updater.channel

**Options:** `stable`, `dev`

The update channel that Plex checks. `stable` serves full releases. `dev` serves development builds. Run `/plex update`
to update Plex to the newest build on the channel.

## Debugging

### debug

**Options:** `true` / `false`

Enables extra logging in the console. This helps you diagnose problems. Keep it off during normal use.
