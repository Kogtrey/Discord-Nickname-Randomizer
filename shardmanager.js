// shardmanager.js
const config = require('./config.json');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', {
    token: config.token,
    // totalShards: 'auto', // optional
});

manager.on('shardCreate', (shard) => {
    console.log(`Shard ${shard.id} launched`);
});

manager.spawn();