//TODO: Command to remove nicknames for given user.
//TODO: Command to list nicknames of current user
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
        data: new SlashCommandBuilder()
            .setName('resetnicknames')
            .setDescription('<NOT DEVELOPED>'),
    async execute(interaction,client){
        console.log(`User ${interaction.user.username} : ${interaction.user.id} sent /resetnicknames`)
        client.userRepo.getById(interaction.user.id)
            .then( async (user) => {
                if(user){
                    //User is Opted In:
                    await interaction.reply({
                        content: `:construction: This is command is under construction. Hold tight :construction:`
                    })

                } else {
                    //User is not Opted In:
                    await interaction.reply({
                        content: `:construction: This is command is under construction. Hold tight :construction:`
                    })
                }
            })
    }
}