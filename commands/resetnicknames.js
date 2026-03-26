const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetnicknames')
        .setDescription('Removes all of your current set nicknames.'),

    async execute(interaction, client) {
        client.logger?.info?.(`User ${interaction.user.username}:${interaction.user.id} sent /resetnicknames`);

        const user = await client.repos.userRepo.getById(interaction.user.id);
        if (user) client.logger?.info?.(`${user.name} guild sync: ${user.guildsync}`);

        const guildUser = await client.repos.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId);

        if (!guildUser) {
            await interaction.reply({
                content: `User ${interaction.user.username} is not opted in. Type \`/optin\` to set nicknames.`,
                ephemeral: true,
            });
            return;
        }

        const guildUserNicknames = await client.repos.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id);

        for (const row of guildUserNicknames) {
            await client.repos.guildUserNicknameRepo.delete(row.id);
        }

        await interaction.reply({
            content: `Your nicknames have been removed. To add nicknames again, type \`/addnicknames\`.`,
            ephemeral: true,
        });

        client.logger?.info?.(`Removed nicknames for userId=${interaction.user.id} guild=${interaction.guildId}`);
    },
};