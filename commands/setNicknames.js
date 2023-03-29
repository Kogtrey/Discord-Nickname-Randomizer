const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('setnicknames')
            .setDescription('Sets the list of your nicknames that the bot will randomly select from.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /setnicknames`)
        let user = await client.userRepo.getById(interaction.user.id)     
        if(user){
            //Request a comma separated list of nicknames:
            await interaction.reply({
                content: `Check your direct messages for instructions.`
            })

            const message = await interaction.user.send({
                content: `Please send a message with nicknames in a comma separated list. For example, an acceptable list for me would be:

                \`Discman-Nickerbacker-Challenger,DooDoo-Niceboi-Chipset,DillyDally-Nifty-Cartoon\`
                
                \*\*Do:\*\*
                - Use appropriate names that follow server rules
                - Use funny names that will make you and others laugh
                
                \*\*Don't:\*\*
                - Don't use names with symbols in them or anything other than text (dashes (-) and underscores (_) are okay. Use discretion).
                `
            })

            const filter = m => m.author.id === interaction.user.id

            message.channel.awaitMessages({filter, max: 1, time: 600_000})
                .then( async (collected) => {
                    let list = collected.first().content.replace(/\s*,\s*/g, ",").split(',')
                    list.forEach(nickname => {
                        client.nicknameRepo.create(nickname,interaction.user.id)
                    });

                    await interaction.user.send(`Nicknames list has been set! No further action required.`)
                    console.log(`${interaction.user.username} added ${list.length} nicknames`)
                })
                .catch( async (collection) =>{
                    console.log(collection)
                    await interaction.user.send({
                        content: `Something went wrong. Try again or contact a developer.`
                    })
                })

        } else {
            await interaction.reply({
                content: `User ${interaction.user.username} is not opted in. Type \`/optin\` to set nicknames.`
            })
        }

    }
}