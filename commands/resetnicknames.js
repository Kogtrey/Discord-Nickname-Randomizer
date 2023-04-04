//TODO: Command to remove nicknames for given user.
//TODO: Command to list nicknames of current user
const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
        data: new SlashCommandBuilder()
            .setName('resetnicknames')
            .setDescription('Removes all of your current set nicknames.'),
    async execute(interaction,client){

        async function Reply(message){
            await interaction.reply({
                content: message
            })
        }

        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /resetnicknames`)
        let user = await client.userRepo.getById(interaction.user.id)

        if(!user){
            await Reply(`User ${interaction.user.username} is not opted in globally. Type \`/optin\` to set nicknames.`)
            return
        }

        if(user.guildsync == 1){
            let nicknames = await client.nicknameRepo.getNicknames(user.id)
            
            if(!(nicknames.length > 0)){
                await Reply(`There are no nicknames to remove`)
                return
            }
            nicknames.forEach(async nickname=> {
                await client.nicknameRepo.delete(nickname.id)
            })
            await Reply(`Your nicknames have been removed. To add nicknames again, type \`/setnicknames\`.`)
            console.log(`Removed nicknames for User ${interaction.user.username} globally`)
            return
        }

        let guildUser = await client.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId)

        if(!guildUser){
            await Reply(`User ${interaction.user.username} is not opted in on this server. Type \`/optin\` to set nicknames.`)
            return
        }
        //Remove nicknames associated to user:
        let nicknames = await client.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id)
        if(!(nicknames.length > 0)){
            await Reply(`There are no nicknames to remove on this server`)
            return
        }
        nicknames.forEach( async nickname => {
            await client.guildUserNicknameRepo.delete(nickname.id)
        });

        await Reply(`Your nicknames have been removed. To add nicknames again, type \`/setnicknames\`.`)
        console.log(`Removed nicknames for User ${interaction.user.username} at guild ${interaction.guildId}`)

    }
}