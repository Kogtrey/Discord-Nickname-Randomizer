const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optin')
        .setDescription('Opts you in to having your nickname randomly changed.'),

    async execute(interaction, client) {
        client.logger?.info?.(
            `User ${interaction.user.username}:${interaction.user.id} guild=${interaction.guildId} sent /optin`
        );

        const existingUser = await client.repos.userRepo.getById(interaction.user.id);

        if (!existingUser) {
            await client.repos.userRepo.create(interaction.user.id, interaction.user.username);
            await client.repos.guildUserRepo.create(interaction.user.id, interaction.guildId);

            await interaction.reply({ content: `User ${interaction.user.username} opted in!`, ephemeral: true });
            return;
        }

        const guildUser = await client.repos.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId);

        if (!guildUser) {
            await client.repos.guildUserRepo.create(interaction.user.id, interaction.guildId);
            await interaction.reply({ content: `User ${interaction.user.username} opted in!`, ephemeral: true });
        } else {
            await interaction.reply({ content: `User ${interaction.user.username} already opted in.`, ephemeral: true });
        }
    },
};