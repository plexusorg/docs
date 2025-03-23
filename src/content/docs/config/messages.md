---
title: Messages
description: All of the messages within the messages.yml file for Plex
---

Almost all the messages inside of Plex are fully customizable. This page will document how to change messages in the
```messages.yml``` file inside the Plex folder.

## Default file

The default `messages.yml` file is below.

```yaml title="/plugins/Plex/messages.yml"
# Plex Messages File
# This file uses the MiniMessage system.
# Documentation available at https://docs.adventure.kyori.net/minimessage/format.html

# Messages in here will be placed in for certain commands, actions, etc.
# Warning: not all commands have customizable messages

# Variables {number} - these are code-defined replacements for things that should be inserted into messages. (e.g. names, statuses, numbers)
# If any of these variables are supposed to be used within a message, some documentation is provided to give more context to what the variables indicate.
# If you are wishing to change these messages it's recommended you use the same amount of variables as stated in the documentation, however it's not required.

# 0 - Appeal URL
# 1 - Reason
# 2 - Expiry
# 3 - Punisher
banMessage: "<red>You have been banned! You may appeal at <gold>{0}.\n<red>Reason: <gold>{1}\n<red>End date: <gold>{2}\n<red>Banned by: <gold>{3}"
# 0 - Reason
# 1 - Punisher
kickMessage: "<red>You have been kicked! \n<red>Reason: <gold>{0}\n<red>Kicked by: <gold>{1}"
# 0 - The type of indefinite ban
# 1 - Appeal URL
indefBanMessage: "<red>Your {0} is indefinitely banned! You may appeal at <gold>{1}."
# 0 - The type of indefinite ban
# 1 - Appeal URL
# 2 - The reason
indefBanMessageReason: "<red>Your {0} is indefinitely banned! You may appeal at <gold>{1}.\n<red>Reason: <gold>{2}"
playerNotFound: "<red>Player not found!"
specifyPlayer: "<red>You must specify a player!"
worldNotFound: "<red>World not found!"
# This will always be used for punishments where the sanctioning administrator has not provided a reason. Will ignore MiniMessage tags.
noReasonProvided: "No reason provided."
# 0 - The world you have been teleported to
playerWorldTeleport: "<aqua>You have been teleported to {0}."
# 0 - The person who is freezing
# 1 - The person who has been frozen
frozePlayer: "<red>{0} - Froze {1}"
# 0 - The person who is unfreezing
# 1 - The person who has been unfrozen
unfrozePlayer: "<aqua>{0} - Unfroze {1}"
# 0 - The command sender
# 1 - The person who has been muted
mutedPlayer: "<red>{0} - Muted {1}"
# 0 - The command sender
# 1 - The person who has been unmuted
unmutedPlayer: "<aqua>{0} - Unmuted {1}"
invalidTimeFormat: "<red>Invalid time format. Use s, m, h, d, w, mo, or y (e.g., 1h30m)."
timeMustBeFuture: "<red>The specified time must be in the future."
# 0 - The command sender
# 1 - The person who has been muted
# 2 - The time that the person is muted for
tempMutedPlayer: "<red>{0} - Muted {1} for {2}"
maxTimeExceeded: "<red>The specified time must be under a week."
# 0 - The person who is locking up
# 1 - The person who has been locked up
lockedUpPlayer: "<aqua>{0} - Locking up {1}"
# 0 - The person who is unlocking
# 1 - The person who has been unlocked
unlockedPlayer: "<aqua>{0} - Unlocking {1}"
# 0 - The permission node required to use the command
noPermissionNode: "<red>You must have the permission: {0} <red>to use this command!"
noPermissionInGame: "<red>You must be in console to use this command!"
noPermissionConsole: "<red>You must be in-game to use this command!"
# 0 - The username of the name history
nameHistoryTitle: "<gold>Name History of {0}"
nameHistorySeparator: "<gold><strikethrough>-----------------------------"
# 0 - The name
# 1 - The date and time of the name change
nameHistoryBody: "<gold>{0} <dark_gray>- <gold>{1}"
# 0 - The gamemode
gameModeSetTo: "<gray>Your gamemode has been set to {0}."
# 0 - The player's name
# 1 - The gamemode
setOtherPlayerGameModeTo: "<gray>You set {0}'s gamemode to {1}."
# 0 - The command sender
# 1 - The gamemode
playerSetOtherGameMode: "<gray>{0} set your gamemode to {1}."
# 0 - The command sender
# 1 - The gamemode
setEveryoneGameMode: "<aqua>{0} - Changing everyone's gamemode to {1}"
consoleMustDefinePlayer: "<red>You must define a player since you are running this command from console."
# 0 - The command sender
# 1 - The player
newAdminAdded: "<aqua>{0} - Adding {1} to the admin list"
# 0 - The command sender
# 1 - The player
# 2 - The rank name
adminReadded: "<aqua>{0} - Re-adding {1} to the admin list as rank: {2}"
# 0 - The command sender
# 1 - The player
adminRemoved: "<red>{0} - Removing {1} from the admin list"
# 0 - The command sender
# 1 - The player
# 2 - The rank
adminSetRank: "<aqua>{0} - Setting {1}'s rank to {2}"
# 0 - The world name
teleportedToWorld: "<aqua>You have been teleported to the {0}."
higherRankThanYou: "<red>This player is an admin or a higher rank than you."
playerNotAdmin: "<red>That player is not an admin."
playerIsAdmin: "<red>That player is already an admin."
rankNotFound: "<red>The rank you entered was not found."
rankMustBeHigherThanAdmin: "<red>The rank you entered must be higher than Admin."
consoleOnly: "<red>This command can only be executed by the console."
# 0 - Rank
yourRank: "<aqua>Your rank is: {0}"
# 0 - Player name
# 1 - Rank
otherRank: "<aqua>{0}'s rank is: {1}"
# 0 - The command sender
# 1 - The player
banningPlayer: "<red>{0} - Banning {1}"
# 0 - The command sender
# 1 - The player
unbanningPlayer: "<aqua>{0} - Unbanning {1}"
playerNotBanned: "<red>That player is not banned!"
playerNotFrozen: "<red>That player is not frozen!"
playerNotMuted: "<red>That player is not muted!"
playerBanned: "<red>That player is already banned!"
playerFrozen: "<red>That player is already frozen!"
playerMuted: "<red>That player is already muted!"
playerLockedUp: "<red>That player is already locked up!"
muted: "<red>You are currently muted - STFU!"
pvpDisabled: "<red>PVP has been disabled!"
chatIsOff: "<red>Chat is currently toggled off!"
# 0 - The command sender
# 1 - The set value of the chat toggle
chatToggled: "<red>{0} - Toggled chat {1}"
# 0 - The command sender
# 1 - The player
kickedPlayer: "<red>{0} - Kicking {1}"
teleportedToWorldSpawn: "<aqua>Teleporting to the local spawn"
toggleCommandSpy: "<gray>CommandSpy has been"
enabled: "<gray>enabled."
disabled: "<gray>disabled."
# 0 - The admin / staff member
# 1 - The player's group's prefix if any
# 2 - The message
adminChatFormat: '<dark_gray>[<blue>AdminChat<dark_gray>] <dark_red>{0} {1} <gray>» <gold>{2}'
# 0 - Whether it was toggled on or off
adminChatToggled: '<gray>AdminChat was toggled {0}'
# 0 - Maximum length, configured in config.yml
maximumPrefixLength: "<red>The maximum length for a tag may only be {0}."
prefixCleared: "<aqua>Your prefix has been cleared."
# 0 - The player name
otherPrefixCleared: "<aqua>You have cleared {0}'s prefix."
# 0 - The new prefix
prefixSetTo: "<aqua>Your prefix has been set to {0}"
# 0 - The action (blocked / unblocked)
# 1 - The amount of players
blockeditSize: "<gray>{0} all block modification abilities for {1} players."
# The action (blocked or restored)
editsModified: "<gray>Your block modification abilities have been {0}."
listOfPlayersBlocked: "<gray>The following have block modification abilities restricted:"
# 0 - The player name
editsBlocked: "<gray>Blocked block modification abilities for {0}"
# 0 - The command sender
# 1 - The player name
blockingEdits: "<red>{0} - Blocking block modification abilities for {1}"
# 0 - The command sender
# 1 - The player
unblockingEdits: "<aqua>{0} - Unblocking block modification abilities for {1}"
# 0 - The player name
editsUnblocked: "<gray>Unblocked block modification abilities for {0}"
# 0 - The command sender
# 1 - Number of entities removed
removedEntities: "<red>{0} - Removed {1} entities"
# 0 - The command sender
# 1 - Number of entities removed
# 2 - Entity type(s) removed
removedEntitiesOfTypes: "<red>{0} - Removed {1} entities of type(s) {2}"
# 0 - The command sender
# 1 - Number of entities removed
# 2 - Entity type removed
removedEntitiesOfType: "<gray>Removed {1} {2}"
# 0 - Entity type that is invalid
invalidEntityType: "<gray>Notice: Entity type {0} is invalid!"
noRemovedEntities: "<gray>No entities were removed."
# 0 - Number of mobs removed
# 1 - Type of mob removed
amountOfMobsRemoved: "<gray>{0} {1} removed."
notAValidMob: "<red>That is not a valid mob."
notAValidMobButValidEntity: "<red>That is a valid entity, but is not a valid mob."
# 0 - The command sender
# 1 - Number of mobs removed
removedMobs: "<red>{0} - Removed {1} mobs"
autoWipeDisabled: "<gray>Item wiping is currently disabled in the config!"
# 0 - The boolean for whether the limit is enabled or disabled
mobLimitToggle: "<gray>The mob limit has been {0}"
# 0 - The amount that the mob limit has been set to
mobLimitSet: "<gray>The mob limit has been set to: <em><white>{0}"
# 0 - The boolean for whether the limit is enabled or disabled
# 1 - The current amount of mobs in the world
# 2 - The current set mob limit
# 3 - Chunk x value
# 4 - Chunk z value
mobLimitStatus: "<gray>({0}<gray>) <em><white>{1} <reset><gray>/ <em><white>{2} <reset><gray>per chunk (<em><white>Chunk<gray>: <reset>{3}, {4}<gray>)"
# 0 - The max set limit in config
mobLimitCeiling: "<gray>The limit you have entered is too high. Defaulting to the ceiling value from config"
commandBlocked: "<gray>That command is blocked."
# 0 - The command sender
# 1 - The message being said
sayMessage: "<blue>[Server: {0}] {1}"
# 0 - The command sender
# 1 - The message being said
consoleSayMessage: "<gray>[Console: {0}] <white>{1}"
# 0 - The number attempted to be parsed
unableToParseNumber: "<red>Unable to parse {0} as a number!"
noNotes: "<red>This player has no notes!"
noteAdded: "<green>Note added."
noteNotFound: "<red>A note with this ID could not be found."
# 0 - The ID of the note removed
removedNote: "<green>Removed note with ID: {0}"
# 0 - The number of notes cleared
clearedNotes: "<green>Cleared {0} notes."
invalidToggle: "<red>That is not a valid toggle."
specifyLoginMessage: "<red>Please specify a login message."
# 0 - The login message
setOwnLoginMessage: "<gray>Your login message is now:<newline><gray>> <reset>{0}"
# 0 - The player
# 1 - The login message
setOtherPlayersLoginMessage: "<gray>{0}'s login message is now:<newline><gray>> <reset>{1}"
removedOwnLoginMessage: "<gray>Your login message has been removed."
# 0 - The player
removedOtherLoginMessage: "<gray>You removed {0}'s login message."
nameRequired: "<red>Policy requires that you must state your player name in your login message. You can either do this by inserting your name or %player%."
rankRequired: "<red>Policy requires that you must state your rank in your login message. You can do this by using %rank% in your login message."
# 0 - The material name
# 1 - The players who have the material in their inventory
playersWithMaterial: "<gray>Players with {0} in their inventory: {1}"
# 0 - The material name
# 1 - The players who have the material in their inventory
playersMaterialCleared: "<gray>{0} has been removed from the following players: {1}"
nobodyHasThatMaterial: "<gray>No one online has that in their inventory."
# 0 - The attempted material name
materialNotFound: "<red>{0} is not a valid item/block name."
# 0 - The players name
loginMessage: "<yellow><translate:multiplayer.player.joined:{0}>"
# 0 - The string that wasn't a valid integer
notANumber: "<red>{0} is not a valid number!"
# 0 - Players currently online
# 1 - Max players
listHeader: "<gray>There is currently <yellow>{0}<gray> player online out of <yellow>{1}<gray> players."
# 0 - Players currently online
# 1 - Max players
listHeaderPlural: "<gray>There are currently <yellow>{0}<gray> players online out of <yellow>{1}<gray> players."
# 0 - Player who is having their notes fetched
notesHeader: "Player notes for: <green>{0}"
# 0 - Note ID
# 1 - Author of the note
# 2 - Timestamp
notePrefix: "<gold><!italic>{0} - Written by: {1} on {2}"
# 0 - The content of the note
noteLine: "<newline><yellow># {0}"
# 0 - The player
# 1 - The number of notes logged for said player
playerNoteAlert: "<gold>{0} has {1} note. <click:run_command:/notes {0} list><underlined>Click here to view their note."
# 0 - The player
# 1 - The number of notes logged for said player
playerNoteAlertPlural: "<gold>{0} has {1} notes. <click:run_command:/notes {0} list><underlined>Click here to view their notes."
smiteTitleHeader: "<red>You've been smitten."
# 0 - The reason for the smite. Will default to noReasonProvided if no reason is specified.
# 1 - The admin / staff member
smiteTitleMessage: "<yellow>Be sure to follow the rules!"
# 0 - The player
# 1 - The reason for the smite. Will default to noReasonProvided if no reason is specified.
# 2 - The admin / staff member
smiteBroadcast: "<red>{0} has been a naughty, naughty boy.<newline><red> - Reason: <yellow>{1}<newline><red> - Smitten by: <yellow>{2}"
# 0 - The player
smittenQuietly: "<gray>Smitten {0} quietly."
# 0 - The reason for being smitten
smitten: "<red>You've been smitten. Reason: <yellow>{0}"
nukerKickMessage: "Please turn off your nuker!"
antiSpamMessage: "<gray>Please refrain from spamming messages."
# 0 - The player
banExpiredBroadcast: "Plex - Automatically unbanning {0}"
# 0 - The player
redisResetSuccessful: "<yellow>Successfuly reset {0}'s Redis punishments!"
redisResetPlayerNotFound: "Couldn't find player in Redis punishments."
reappliedGamerules: "<aqua>All game rules have been re-applied!"
commandNotFound: "<red>That command could not be found!"
# 0 - The command
# 1 - A list of aliases found
commandAliases: "<aqua>Aliases for {0} are: {1}"
```

## MiniMessage

The `messages.yml` file uses MiniMessage for coloring messages. For example, writing `<aqua>`, will color the text aqua.
This is not like HTML, and you should not close the tag (`</aqua>`). There are some special functions as well, such as
`<rainbow>`. The default color will be gray. For a complete guide on using MiniMessage,
visit: [https://docs.advntr.dev/minimessage/format.html](https://docs.advntr.dev/minimessage/format.html).

## Troubleshooting

If you receive `No message.` when executing a command, it is likely you need to regenerate your `messages.yml` file. The
default configuration file is also available
on [GitHub](https://raw.githubusercontent.com/PlexDevelopment/Plex/master/src/main/resources/messages.yml). As of Plex
0.6 (Beta 6), your `messages.yml` file should automatically update with new entries.
