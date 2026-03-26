const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addnicknames')
        .setDescription('Adds to the list of your nicknames that the bot will randomly select from.'),

    async execute(interaction, client) {
        client.logger?.info?.(
            `User ${interaction.user.username}:${interaction.user.id} guild=${interaction.guildId} sent /addnicknames`
        );

        const user = await client.repos.userRepo.getById(interaction.user.id);
        if (user) client.logger?.info?.(`${user.name} guild sync: ${user.guildsync}`);

        const guildUser = await client.repos.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId);
        if (!guildUser) {
            await interaction.reply({
                content: `User ${interaction.user.username} is not opted in on this server. Type \`/optin\` to set nicknames.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({ content: `Check your direct messages for instructions.`, ephemeral: true });

        const prompt = await interaction.user.send({
            content:
                `Please send a message with nicknames in a comma separated list. For example:\n\n` +
                `\`Discman-Nickerbacker-Challenger,DooDoo-Niceboi-Chipset,DillyDally-Nifty-Cartoon\`\n\n` +
                `**Do:**\n` +
                `- Use appropriate names that follow server rules\n` +
                `- Use funny names that will make you and others laugh\n\n` +
                `**Don't:**\n` +
                `- Don't use names with symbols in them or anything other than text (dashes (-) and underscores (_) are okay).\n`,
        });

        const filter = (m) => m.author.id === interaction.user.id;

        prompt.channel
            .awaitMessages({ filter, max: 1, time: 600_000, errors: ['time'] })
            .then(async (collected) => {
                const raw = collected.first().content;
                const list = raw.replace(/\s*,\s*/g, ',').split(',').map(s => s.trim()).filter(Boolean);

                for (const nickname of list) {
                    const existingNickname = await client.repos.nicknameRepo.getExistingNickname(
                        nickname,
                        interaction.user.id
                    );

                    if (existingNickname) {
                        await client.repos.guildUserNicknameRepo.create(existingNickname.id, guildUser.id);
                    } else {
                        const created = await client.repos.nicknameRepo.create(nickname, interaction.user.id);
                        await client.repos.guildUserNicknameRepo.create(created.id, guildUser.id);
                    }
                }

                await interaction.user.send(`Nicknames have been added. No further action required.`);
                client.logger?.info?.(`${interaction.user.username} added ${list.length} nicknames`);
            })
            .catch(async () => {
                await interaction.user.send(`Timed out or failed. Try again or contact a developer.`);
            });
    },
};