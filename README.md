# Discord Nickname Randomizer (dev branch)

A Discord bot that randomizes user nicknames based on a list of preferred names.

This **dev** branch uses **discord.js v13** and starts via a **Shard Manager** (`shardmanager.js`).

---

## Requirements

- **Node.js:** `>=18 <23` (per `package.json` engines)
- A Discord application + bot token
- Server permissions:
  - The bot must have **Manage Nicknames**
  - The bot’s highest role must be above the roles/users it will rename (role hierarchy)

---

## Install

```bash
git clone https://github.com/Kogtrey/Discord-Nickname-Randomizer.git
cd Discord-Nickname-Randomizer
git checkout dev
npm install
```

---

## Configuration

Create/edit `config.json` in the project root.

```json
{
    "clientId": "PUT_CLIENT_ID_HERE",
    "token": "PUT_BOT_TOKEN_HERE",
    "jobs": {
        "timezone": "America/Denver",
        "nicknameRotationCron": "0 0 */1 * *",
        "workActivityCron": "0 6 * * *",
        "sleepActivityCron": "0 20 * * *"
    },
    "activity": {
        "nicknameSourceUserId": "PUT_USER_ID_HERE"
    }
}
```

> `shardmanager.js` reads your token from `./config.json` and spawns shards that run `./bot.js`.

---

## Running (dev)

### Start the bot (with nodemon)

The **dev** branch `start` script runs:

- `nodemon shardmanager.js`

Run:

```bash
npm start
```

---

## Deploy slash commands

The **dev** branch includes:

- `deploy:commands` → `node scripts/deploy-commands.js`

Run:

```bash
npm run deploy:commands
```

> If command deployment requires additional config (client ID, guild ID, etc.), check `scripts/deploy-commands.js` and mirror whatever it expects in your config/environment.

---

## Local build script (optional)

The **dev** branch includes:

- `build:local` → `pwsh -ExecutionPolicy Bypass -File scripts/build.ps1`

Run:

```powershell
npm run build:local
```

---

## Project entrypoints (dev)

- `shardmanager.js` — launches shards for `bot.js`
- `bot.js` — main bot process (spawned by shard manager)
- `scripts/deploy-commands.js` — registers slash commands

---

## Notes / troubleshooting

- If nicknames don’t change:
  - Confirm the bot has **Manage Nicknames**
  - Confirm role hierarchy allows it to rename the target user
- If shards fail to spawn, verify your `config.json` token is valid and the file is in the project root.