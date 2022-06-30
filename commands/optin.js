const { SlashCommandBuilder } = require('@discordjs/builders')
//This probably doesn't work.

module.exports = {
        data: new SlashCommandBuilder()
            .setName('optin')
            .setDescription('Opts a user in to have their nickname randomly changed'),
    async execute(interaction,client){
        if(client.userRepo.getByDiscordId(interaction.user.id)){
            client.userRepo.create(interaction.user.username, interaction.user.id)
        }
    }
}