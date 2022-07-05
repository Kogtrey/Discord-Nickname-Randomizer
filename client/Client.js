const {Client, Collection, Intents} = require('discord.js');
const DBM = require('../data/dbmanager')
const UserRepo = require('../data/Tables/UserRepo')
const NicknameRepo = require('../data/Tables/NicknameRepo')

const dbm = new DBM('./data/db.sqlite3')

module.exports = class extends Client {
  constructor(config) {
    super({
      intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES
      ],
    });

    this.userRepo = new UserRepo(dbm)
    this.nicknameRepo = new NicknameRepo(dbm)

    this.commands = new Collection();

    this.config = config;

  }
};
