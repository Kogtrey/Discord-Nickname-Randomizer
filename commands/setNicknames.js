const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('setnicknames')
            .setDescription('<NOT DEVELOPED>Sets the list of nicknames that the bot will randomly select from.'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /setnicknames`)
        client.userRepo.getById(interaction.user.id)
            .then( async (user) => {
                if(user){
                    //Request a comma separated list of nicknames:
                    await interaction.reply({
                        content: `:construction: This is command is under construction. Hold tight :construction:.`
                    })
                } else {
                    await interaction.reply({
                        content: `:construction: This is command is under construction. Hold tight :construction:.`
                    })
                }
            })
    }
}