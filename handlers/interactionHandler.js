// handlers/interactionHandler.js
function registerInteractionHandler(client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (err) {
            client.logger.error('Command execution error:', err);

            const payload = {
                content: 'There was an error trying to execute that command!',
                ephemeral: true,
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(payload).catch(() => { });
            } else {
                await interaction.reply(payload).catch(() => { });
            }
        }
    });
}

module.exports = { registerInteractionHandler };