---
title: Configuration
description: All of the configuration options for the config.yml file within Plex
---

This page will show you how to modify the configuration file. The configuration file is located at:
```/plugins/Plex/config.yml```.

## Default configuration

Below is the default `config.yml` file when Plex is loaded for the first time.

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
  central:
    storage: sqlite # Use mariadb, or sqlite here
    user: ""
    password: ""
    hostname: 127.0.0.1
    port: 27017
    db: "plex"
  side: # This is Redis, leave password blank if auth is false
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

# See https://docs.plex.us.org/docs/customization/config#worlds for documentation
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

# If you are running a custom fork of Plex, you may wish to check for updates from a different repository.
update_repo: "plexusorg/Plex"

# What branch should Plex fetch updates from?
update_branch: "master"

# Additional logging for debugging
debug: false
```

## Server

### server.name

The name of your server goes here and is used throughout Plex.

### server.motd

The text here will appear on the server list.

### server.colorize_motd

This determines if the message of the day should randomly be colorized. You can disable this option and manually
colorize your MOTD.

### server.sample

This lets you specify a custom message under the player count in the server list.

### server.timezone

This lets you customize which timezone various messages appear in (e.g. ban message end date)

## Banning

### banning.ban_url

The URL to be used when a player sees the ban message. The full ban message can be changed in `messages.yml`.

## Punishments

### punishments.mute-timer

**Default:** `500`

The time in minutes for a mute to expire

### punishments.freeze-timer

**Default:** `500`

The time in minutes for a freeze to expire

## Chat

### chat.enabled

**Default:** `true`

Determines if the chat system should be enabled. It's useful to turn this off if you're using permissions and want to
use prefixes from another plugin instead.

### chat.max_tag_length

**Default:** `64`

The maximum length a tag may be in game. This does not include MiniMessage tags, just characters

### chat.format

**Default:** `"{prefix} <white>{name} <gray>» <reset>{message}"`

This allows you to customize the chat format for Plex. The `{prefix}` placeholder will be replaced with whatever prefix
the player has. The `{name}` prefix will be substituted with the player's display name. The `{message}` placeholder will
be replaced by the actual message of the player.

## Colors

### colors.\<group\>

This allows you to define colors for your groups in your permission plugin. These colors will show up in tab. For
example, if a person is in the admin group, their color will be aqua. This can be changed and customized based on your
group names. You do not have to use the ones provided in the configuration.

## Login Messages

### loginmessages.name

**Default:** `true`

This enforces a requirement that players include their name when they set a login message.

## Data

### data.central.storage

**Options:** `sqlite`, `mariadb`, `mongodb`

Select which database software you would like to use. `sqlite` is the default. Note that if you change which data
storage you use, no data will be transferred.

### data.central.user

This is the username for whichever database software you use. Note that `sqlite` does not require a username.

### data.central.password

This is the password for whichever database software you use. Note that `sqlite` does not require a password.

### data.central.hostname

This is the hostname for whichever database software you use. Note that `sqlite` does not require a hostname.

### data.central.port

This is the port for whichever database software you use. Note that `sqlite` does not require a port.

:::info
The default port for MySQL/MariaDB is 3306. Ensure you change it to that if you are using MySQL/MariaDB.
The default is 27017 which is the MongoDB default.
:::

### data.central.db

This is the name for whichever database software you use. Note that `sqlite` does not require a name.

### data.side.enabled

**Options:** `true` / `false`

This will enable Plex's Redis functionality.

### data.side.auth

**Options:** `true` / `false`

This is whether authentication mode for Redis is turned on or not.

:::info
It is highly recommended to have Redis authentication turned on.
:::

### data.side.hostnane

This is the hostname for Redis. This is required for Redis to work.

### data.side.port

This is the port that Redis is listening on. This is requird for Redis to work.

### data.side.password

This is the password for your Redis instance. Note that this can be left blank if authentication is turned off.

## Entity wiping

### entitywipe_list

All items in the list will not be wiped. By default, this includes all mobs as these can be purged with the `mobpurge`
command.

## Autowiping

### autowipe.enabled

**Options:** `true` / `false`

Should autowiping be enabled?

### autowipe.interval

**Default:** 300

How often, in seconds, to automatically wipe entities. Default is 5 minutes.

### autowipe.entities

A list of entities to automatically wipe.

## Blocking

### blocked_blocks

A list of blocks that should be blocked.

### blocked_entities

A list of entities that should be blocked.

### block_on_mute

A list of commands that are blocked when a player is muted or when chat is toggled off.

## Entity limits

### entity_limit.mob_limit_enabled

**Default:** `true`

This determines if the mob limiter is enabled

### entity_limit.max_mobs_per_chunk

**Default:** `50`

This allows you to set the maximum number of mobs allowed in a chunk

### entity_limit.mob_limit_ceiling

**Default:** `500`

This is the maximum amount of mobs allowed.

## Global gamerules

### global_gamerules

These gamerules apply to all worlds on the server. Gamerules in the generated worlds will override the global gamerules.

## Worlds

An infinite amount of worlds can be generated from the configuration file. A few are automatically generated by default.
The format for generating new worlds is as follows:

```yaml title=/plugins/Plex/config.yml
  <world name>:
    name: "Human readable world name"
    entry:
      # The permission required to enter the world, optional
      permission: "plex.world.worldname.enter"
      # Minimum rank requirement, optional
      requiredLevels:
        - "Rank.ADMIN"
      # The message to be shown if a player does not have permission, optional
      message: "<red>You do not have permission to enter this world."
    modification:
      # The permission required to modify the world, optional
      permission: "plex.world.worldname.modify"
      # Minimum rank requirement, optional
      requiredLevels:
        - "Rank.ADMIN"
      # The message to be shown if a player does not have permission, optional
      message: "<red>You do not have permission to modify this world."
    gameRules:
      - "doWeatherCycle;false"
      - "doDaylightCycle;false"
    parameters:
      grass_block: 1
      dirt: 32
      stone: 16
      bedrock: 1
```

Note that in the `parameters` section, this is how the world should actually be generated. The order is from top to
bottom. In the example above, a world will generate with one grass layer, 32 layers of dirt, 16 layers of stone, and one
layer of bedrock.

The gamerule section is what gamerules are set for the world by default. The syntax is the official gamerule name, a
semicolon, and either `true` or `false`.

## Updates

update_repo
The repo to use for update checking.

update_branch
The branch to use for update checking.

## Debugging

**Options:** `true` / `false`

The `debug` option is standalone and enables additional logging. This may be useful for diagnosing issues as more
information will be displayed in the console. It is recommended to keep this option turned off.
