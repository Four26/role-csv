// require('dotenv').config();

// const discord = require('discord.js');
// const config = require('../config.json');
// const client = new discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
// const commandName = config.commandName;
// const { generateCSV } = require('./functions/csvGenerator');

// client.on('error', (error) => {
//     consoleLog(error.message, 'ERROR');
// });

// client.on('ready', () => {
//     console.log('Ready and connected to Discord.')
// });

// client.on('messageCreate', async (message) => {
//     if (!message.content.startsWith(config.commandPrefix) || message.author.bot) {
//         return; //Ignore messages that don't start with the command prefix or are sent by bots.
//     };

//     const [command, ...commandArguments] = message.content.slice(config.commandPrefix.length).trim().split(/ +/g).map(arg => arg.toLowerCase());

//     switch (command) {
//         case `${commandName}`:
//             if (!message.member.roles.cache.some(role => config.allowedRoles.includes(role.name))) {
//                 return; //Ignore commands sent by users without allowed roles.
//             }
//             await generateCSV(message);
//             console.log(`Generating CSV file for ${message.guild.name} server. "${message.member.user.username} requested this file."`);
//             message.delete({ timeout: 250 });
//             break;
//         default:
//             return; //Ignore any other commands.
//     }
// });

// client.login(process.env.BOT_TOKEN);

require('dotenv').config();

const discord = require('discord.js');
const config = require('../config.json');
const client = new discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
const commandName = config.commandName;
const { generateCSV } = require('./functions/csvGenerator');

client.on('error', (error) => {
    consoleLog(error.message, 'ERROR');
});

client.on('ready', () => {
    console.log('Ready and connected to Discord.')
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.commandPrefix) || message.author.bot) {
        return; //Ignore messages that don't start with the command prefix or are sent by bots.
    };

    const [command, ...commandArguments] = message.content.slice(config.commandPrefix.length).trim().split(/ +/g).map(arg => arg.toLowerCase());

    switch (command) {
        case `${commandName}`:
            if (!commandArguments.length) {
                const roles = message.guild.roles.cache.map(role => role.name);
                message.channel.send(`Please provide at least one role name to generate the CSV file. Available roles: ${roles.join(', ')}`);
                return;
            }

            const requestedRoles = commandArguments.join(' ').split(',').map(role => role.trim());
            await generateCSV(message, requestedRoles);
            console.log(`Generating CSV file for ${message.guild.name} server. "${message.member.user.username} requested this file."`);
            break;
        default:
            return; //Ignore any other commands.
    }
});

client.login(process.env.BOT_TOKEN);
