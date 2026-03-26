// util/shard.js
function isShard0(client) {
    if (!client.shard) return true; // not sharded -> treat as shard0
    return Array.isArray(client.shard.ids) && client.shard.ids.includes(0);
}

module.exports = { isShard0 };