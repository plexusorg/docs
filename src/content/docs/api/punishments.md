---
title: Punishments
description: Ban, tempban, mute, freeze, kick, and smite players, check bans, and read indefinite bans from a Plex module.
---

The punishments service lets a module record punishments, check if a player is banned, remove bans, and read the
indefinite bans from `indefbans.yml`. Plex saves each punishment in its database and adds it to the player's history.

Get the service from your module:

```java
PunishmentsApi punishments = api().punishments();
```

Javadoc: [`PunishmentsApi`](/javadoc/dev/plex/api/punishment/PunishmentsApi.html).

## Methods

| Method | What it does |
| --- | --- |
| `punish(PunishmentRequest punishment)` | Saves a punishment and applies Plex's state for it. See [What punish does](#what-punish-does). |
| `isBanned(UUID uuid)` | Checks if the player has an active ban or tempban. |
| `isBanned(UUID uuid, String ip)` | Also checks bans that cover the IP address. Pass `null` to check only the UUID. |
| `unban(UUID uuid)` | Ends the player's active bans and tempbans. The future holds `true` when Plex ended at least one. |
| `indefiniteBans()` | Returns all indefinite bans. |
| `indefiniteBanByUuid(UUID uuid)` | Finds the indefinite ban that lists the UUID. |
| `indefiniteBanByName(String name)` | Finds the indefinite ban that lists the name. Case does not matter. |
| `indefiniteBanByIp(String ip)` | Finds the indefinite ban that covers the IP address. Ranges in `indefbans.yml` also match. |

## Punishment types

[`PunishmentType`](/javadoc/dev/plex/api/punishment/PunishmentType.html) lists the punishments that `punish` accepts.

| Type | End date | Effect |
| --- | --- | --- |
| `BAN` | Plex sets it to 24 hours after the issue time. | The player can join only in a restricted spectator state until the ban ends. |
| `TEMPBAN` | Required. It must be in the future. | The same as `BAN`, but it ends at the date you give. |
| `MUTE` | Required. It must be in the future and at most 7 days away. | The player cannot chat until the mute ends. |
| `FREEZE` | Required. It must be in the future. | The player cannot move until the freeze ends. |
| `KICK` | Must be `null`. | Plex records the kick only. Your module kicks the player. |
| `SMITE` | Must be `null`. | Plex records the smite only. Your module does the smite. |

`PunishmentType.STANDARD_BAN_DURATION` holds the 24-hour length of a `BAN`. `fixedDuration()` and `maximumDuration()`
give the limits of each type, and `isBan()` is `true` for `BAN` and `TEMPBAN`.

A ban or tempban from the API does not block login. The banned player can still join, in spectator mode. IP bans and name bans
from `/banip` and `/banname`, and indefinite bans, block login. The API cannot create those. Server owners manage
indefinite bans in [indefbans.yml](/config/indefinitebans).

## PunishmentRequest

[`PunishmentRequest`](/javadoc/dev/plex/api/punishment/PunishmentRequest.html) is a record that holds the details of
one punishment.

| Field | Value |
| --- | --- |
| `punished` | The UUID of the player to punish. Required. |
| `punisher` | The UUID of the staff member. Required when `source` is `PLAYER`. Otherwise it can be `null`. |
| `source` | Who issued the punishment: `PLAYER`, `CONSOLE`, or `WEB`. Required. |
| `punisherReference` | Your own text that names the issuer, such as a web account. Can be `null`. |
| `ip` | The player's IP address. Can be `null`. On a ban, it extends the ban to the address. |
| `type` | The `PunishmentType`. Required. |
| `reason` | The reason. Required. |
| `endDate` | When the punishment ends. See the table above for each type. |

The constructor checks the request. It throws `NullPointerException` when a required field is `null`. It throws
`IllegalArgumentException` when a `PLAYER` request has no punisher, or when the end date does not fit the type. Catch
these exceptions where you build the request.

For a `BAN`, the constructor ignores the end date that you pass and uses 24 hours from now.

## What punish does

`punish` runs these steps in order:

1. Plex finds the player. The future fails with `IllegalArgumentException` when Plex does not know the player.
2. For a ban or tempban, Plex checks if the player is already banned. The future fails with `IllegalStateException`
   when they are.
3. Plex saves the punishment in the database. A storage failure fails the future.
4. Plex adds the punishment to the player's history.
5. Plex applies its own state:
   - **Ban or tempban:** Plex puts the player in the restricted spectator state if they are online and do not have
     the `plex.ban.bypass` permission. When you give an
     `ip`, Plex also restricts other online players from that address. For IPv6, the address covers its /64 network.
     With [Redis](/docs/redis), Plex tells the other servers to refresh their ban state.
   - **Mute or freeze:** Plex marks the player as muted or frozen and ends the punishment at the end date.
   - **Kick or smite:** Plex does nothing more.

The future completes after these steps. For an online player who gets a ban, this means after Plex puts them in the
restricted state.

`punish` does not send messages, broadcast to the server, or kick anyone. Do those things in your module after the
future completes. Then nobody hears about a punishment that Plex did not save.

## PunishmentView

[`PlexPlayerView.punishments()`](/api/players#plexplayerview) returns the player's history as a list of
[`PunishmentView`](/javadoc/dev/plex/api/punishment/PunishmentView.html).

| Method | Value |
| --- | --- |
| `punished()` | The UUID of the punished player. |
| `punisher()` | The UUID of the staff member, or `null`. |
| `source()` | `PLAYER`, `CONSOLE`, or `WEB`. |
| `punisherReference()` | The issuer text from the request, or `null`. |
| `punisherDisplayName()` | A name to show for the issuer. For `PLAYER`, it is the staff member's name, or their UUID when Plex has no name. For `CONSOLE`, it is `CONSOLE`. For `WEB`, it is the `punisherReference`, or `WEB` when there is none. |
| `ip()` | The IP address from the request, or `null`. |
| `type()` | The `PunishmentType`. |
| `reason()` | The reason. |
| `active()` | `true` when the punishment is in effect now. It is `false` after the end date or after an unban. A ban is also not active for a player with the `plex.ban.bypass` permission. |
| `issueDate()` | When Plex recorded the punishment. |
| `endDate()` | When the punishment ends, or `null` for a kick or smite. |

## Example: tempban a player

```java
public void tempban(Player staff, UUID target, Duration length, String reason)
{
    PunishmentRequest request;
    try
    {
        request = new PunishmentRequest(target, staff.getUniqueId(), PunishmentSource.PLAYER, null, null,
                PunishmentType.TEMPBAN, reason, ZonedDateTime.now().plus(length));
    }
    catch (IllegalArgumentException invalid)
    {
        staff.sendMessage(Component.text(invalid.getMessage(), NamedTextColor.RED));
        return;
    }

    module.api().punishments().punish(request).whenComplete((ignored, failure) ->
    {
        if (failure == null)
        {
            staff.sendMessage(Component.text("Tempban saved.", NamedTextColor.GREEN));
            return;
        }
        Throwable cause = failure instanceof CompletionException && failure.getCause() != null
                ? failure.getCause() : failure;
        if (cause instanceof IllegalArgumentException || cause instanceof IllegalStateException)
        {
            staff.sendMessage(Component.text(cause.getMessage(), NamedTextColor.RED));
            return;
        }
        module.getLogger().error("Could not tempban {}", target, cause);
        staff.sendMessage(Component.text("Could not save the tempban.", NamedTextColor.RED));
    });
}
```

Plex already restricted the player when the future completes. The callback only sends a message, so it needs no
scheduler.

## Example: record a kick, then kick the player

Plex records a kick, but your module does the kick. A kick changes the player, so schedule it on the player's own
scheduler.

```java
public void kick(Player staff, Player target, String reason)
{
    InetSocketAddress address = target.getAddress();
    String ip = address == null ? null : address.getAddress().getHostAddress();
    PunishmentRequest request = new PunishmentRequest(target.getUniqueId(), staff.getUniqueId(),
            PunishmentSource.PLAYER, null, ip, PunishmentType.KICK, reason, null);

    module.api().punishments().punish(request).whenComplete((ignored, failure) ->
    {
        if (failure != null)
        {
            module.getLogger().error("Could not record a kick for {}", target.getName(), failure);
            staff.sendMessage(Component.text("Could not record the kick.", NamedTextColor.RED));
            return;
        }
        ScheduledTask task = target.getScheduler().run(module.plugin(), scheduled ->
        {
            target.kick(Component.text(reason));
            staff.sendMessage(Component.text("Kicked " + target.getName() + ".", NamedTextColor.GREEN));
        }, () -> staff.sendMessage(Component.text(target.getName() + " left before the kick.")));
        if (task == null)
        {
            staff.sendMessage(Component.text(target.getName() + " left before the kick."));
            return;
        }
        module.ownTask(task);
    });
}
```

`run` returns `null` when the player is already gone. Paper calls the second callback when the player leaves before
the task runs.

## Checking and removing bans

`isBanned(uuid)` checks the player's own bans and tempbans. `isBanned(uuid, ip)` also checks bans and tempbans on other
accounts that recorded the same address, and IP bans from `/banip`. Both return `false` for a player with the
`plex.ban.bypass` permission. Neither one checks indefinite bans or name bans. Use `indefiniteBanByUuid`,
`indefiniteBanByName`, or `indefiniteBanByIp` for indefinite bans.

`unban(uuid)` ends the player's active bans and tempbans in the database. Plex then lets restricted online players
leave the spectator state and gives back their earlier game mode. `unban` does not remove IP bans, name bans, or
indefinite bans.

## IndefiniteBanView

The indefinite ban methods return an [`IndefiniteBanView`](/javadoc/dev/plex/api/punishment/IndefiniteBanView.html).
Each view is one entry in `indefbans.yml`.

| Method | Value |
| --- | --- |
| `usernames()` | The names in the entry. |
| `uuids()` | The UUIDs in the entry. |
| `ips()` | The IP addresses and ranges in the entry. Plex leaves out entries that it cannot read. |
| `reason()` | The reason, or an empty string when the entry has none. |

You can only read indefinite bans through the API. Plex loads them from `indefbans.yml` at startup and on
`/plex reload`.

## Futures and threads

Read [the overview](/api) for the general rules. These points apply to the punishments service:

- The indefinite ban methods return at once from memory. You can call them from any thread.
- `punish`, `isBanned`, and `unban` complete on a Plex thread. That can be a database thread, a Plex worker thread, or
  the region thread of a player that Plex just restricted or released. Do not assume which one.
- A callback does not own any player, entity, or block. Sending a message is safe from any thread. To change a player,
  schedule only that change with `player.getScheduler().run(module.plugin(), ...)` and pass the task to
  `module.ownTask(...)`.
- Do not call `join()` or `get()` on these futures from a player or region thread. Use a callback.
- When a future fails inside a chain, the exception can arrive wrapped in `CompletionException`. Check `getCause()`
  before you test the exception type.
