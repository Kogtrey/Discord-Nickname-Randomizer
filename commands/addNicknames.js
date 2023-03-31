const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
        data: new SlashCommandBuilder()
            .setName('addnicknames')
            .setDescription('Adds to the list of your nicknames that the bot will randomly select from.'),
    async execute(interaction,client){

        async function Reply(message){
            await interaction.reply({
                content: message
            })
        }

        console.log(`User ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} sent /addnicknames`)

        let user = await client.userRepo.getById(interaction.user.id)
        if(!user){
           await Reply(`User ${interaction.user.username} is not opted in globally. Type \`/optin\` to set nicknames.`)
           return
        }
        

        let guildUser = await client.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId)
        if(!guildUser){
            await Reply(`User ${interaction.user.username} is not opted in on this server. Type \`/optin\` to set nicknames.`)
            return
        }
        
        await Reply(`Check your direct messages for instructions.`)

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
                list.forEach(async nickname => {

                    let existingNickname = await client.nicknameRepo.getExistingNickname(nickname,interaction.user.id)

                    if(existingNickname){
                        client.guildUserNicknameRepo.create(existingNickname.id,guildUser.id)
                        console.log(`${interaction.user.username}:${interaction.user.id} at guild ${interaction.guildId} re-added an existing nickname.`)
                    } else {
                        let createdNickname = await client.nicknameRepo.create(nickname,interaction.user.id)
                        client.guildUserNicknameRepo.create(createdNickname.id,guildUser.id)
                    }
                });

                await interaction.user.send(`Nicknames list has been set! No further action required.`)
                console.log(`${interaction.user.username} added ${list.length} nicknames`)
            })
            .catch( async (collection) =>{
                console.log(collection)
                await Reply(`Something went wrong. Try again or contact a developer.`)
            })
    }
}