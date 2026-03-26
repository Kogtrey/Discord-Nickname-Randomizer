// commands/mynicknames.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mynicknames')
        .setDescription('Displays current nicknames you have set.'),

    async execute(interaction, client) {
        client.logger?.info?.(`User ${interaction.user.username} : ${interaction.user.id} sent /mynicknames`);

        const user = await client.repos.userRepo.getById(interaction.user.id);
        if (user) {
            client.logger?.info?.(`${interaction.user.username} guild sync: ${user.guildsync}`);
        }

        const guildUser = await client.repos.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId);

        if (!guildUser) {
            await interaction.reply({
                content: `User ${interaction.user.username} is not opted in. Type \`/optin\` to set nicknames.`,
                ephemeral: true,
            });
            return;
        }

        const nicknames = await client.repos.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id);

        if (!nicknames || nicknames.length === 0) {
            await interaction.reply({
                content: `There are no nicknames on record for **${interaction.user.username}**. Use \`/addnicknames\` to set a list.`,
                ephemeral: true,
            });
            return;
        }

        const list = nicknames.map(n => `- ${n.nickname}`).join('\n');
        await interaction.reply({
            content: `We have the following nicknames on record for **${interaction.user.username}**:\n\n${list}`,
            ephemeral: true,
        });
    },
};