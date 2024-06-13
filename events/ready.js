const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        console.log(`${client.user.tag} is revved up!`)
        client.user.setActivity("MEOWWW MEOWWWW MEWOWOEOWWWWWWWWWW");
	},
};