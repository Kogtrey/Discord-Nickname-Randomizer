//TODO: Command to list nicknames of current user
const { SlashCommandBuilder } = require('@discordjs/builders')

// TODO: SET UP GuildSync Logic

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mynicknames')
        .setDescription('Displays current nicknames you have set.'),
    async execute(interaction,client){

        function GenerateNicknameString(nicknames){
            let nicknameString = `We have the following nicknames on record for \*\*${interaction.user.username}\*\*:\n\n`
            nicknames.forEach((nickname)=>{
                nicknameString += `- ${nickname.nickname}\n`
            })
            return nicknameString
        }

        async function Reply(message){
            await interaction.reply({
                content: message
            })
        }

        // Start:
        console.log(`User ${interaction.user.username} : ${interaction.user.id} at guild ${interaction.guildId} sent /mynicknames`)

        // If No User:
        let user = await client.userRepo.getById(interaction.user.id)
        if(!user){
            await Reply(`User ${interaction.user.username} is not opted in globally. Type \`/optin\` to set nicknames.`)
            return
        }

        // If guild synced
        if (user.guildsync === 1){
            console.log(`${interaction.user.username} is guild synced`)
            //If no nicknames:
            let nicknames = await client.nicknameRepo.getNicknames(user.id)
            if(!(nicknames.length > 0)){
                await Reply(`There are no nicknames on record for \*\*${interaction.user.username}\*\* globally. Use \`/addnicknames\` to set a list.`)
                return
            }
            await Reply(GenerateNicknameString(nicknames))
            return
        }
        
        // If guild user:
        let guildUser = await client.guildUserRepo.getGuildUser(interaction.user.id, interaction.guildId)
        if(!guildUser){
            await Reply(`User ${interaction.user.username} is not opted in on this server. Type \`/optin\` to set nicknames.`)
            return
        }
            
        // If no nicknames:
        let nicknames = await client.guildUserNicknameRepo.getGuildUserNicknames(guildUser.id)
        if(!(nicknames.length > 0)){
            await Reply(`There are no nicknames on record for \*\*${interaction.user.username}\*\* on this Server. Use \`/addnicknames\` to set a list.`)
            return
        }
        
        await Reply(GenerateNicknameString(nicknames))
    }
}