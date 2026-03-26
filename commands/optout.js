const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('optout')
        .setDescription('Opts you out of having your nickname randomly changed, and deletes your set nicknames.'),

    async execute(interaction, client) {
        client.logger?.info?.(`User ${interaction.user.username}:${interaction.user.id} sent /optout`);

        const nicknameUser = await client.repos.userRepo.getById(interaction.user.id);
        if (!nicknameUser) {
            await interaction.reply({ content: `User ${interaction.user.username} is already opted out.`, ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Confirm in Direct Messages.', ephemeral: true });

        const message = await interaction.user.send({
            content: 'React with 👍 if you would like to erase all nickname data and opt out of nickname changing.',
            fetchReply: true,
        });

        const filter = (reaction, user) => user.id === interaction.user.id;

        message
            .awaitReactions({ filter, max: 1, time: 60_000, errors: ['time'] })
            .then(async (collected) => {
                const reaction = collected.first();

                if (reaction.emoji.name !== '👍') {
                    await interaction.user.send('You have canceled the opt out process.');
                    return;
                }

                const guildUser = await client.repos.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId);
                if (guildUser) {
                    await client.repos.guildUserRepo.delete(guildUser.id);
                    client.logger?.info?.(`Removed guildUser link guild=${interaction.guildId} user=${interaction.user.id}`);
                }

                const remaining = await client.repos.guildUserRepo.getByUserId(interaction.user.id);
                if (!remaining || remaining.length === 0) {
                    await client.repos.userRepo.delete(interaction.user.id);
                    client.logger?.info?.(`Removed user ${interaction.user.id} (no remaining guild links)`);
                }

                await interaction.user.send('You are now opted out of nickname changing.');
            })
            .catch(async () => {
                await interaction.user.send('No reaction detected. To opt out try again and be sure to react with 👍.');
            });
    },
};