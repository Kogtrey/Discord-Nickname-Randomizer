// client/AppClient.js
const { Client, Collection } = require('discord.js');

module.exports = class AppClient extends Client {
  constructor({ intents, partials, config, repos, services, logger }) {
    super({ intents, partials });

    this.config = config;
    this.logger = logger;

    this.repos = repos;
    this.services = services;

    this.commands = new Collection();
  }
};