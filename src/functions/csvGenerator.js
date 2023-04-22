const fs = require('fs');
const { Parser } = require('json2csv');

const generateCSV = async (message, requestedRoles) => {
    console.log(message);
    const guild = await message.guild.fetch();
    const members = await guild.members.fetch();

    if (!requestedRoles.length) {
        return message.reply("Please provide at least one role name to generate the CSV file.");
    }

    const allMembers = members
        .filter(member => !member.user.bot && member.roles.cache.some(role => requestedRoles.includes(role.name.toLowerCase())))
        .map(member => ({
            Name: member.user.username,
            Tag: member.user.tag,
            DisplayName: member.displayName,
            UserID: `User ID: ${member.user.id}`,
            'Joined Date': member.joinedAt.toDateString(),
            Roles: member.roles.cache.map(role => role.name).join(', ')
        }));

    if (!allMembers.length) {
        return message.reply("No members found with the provided role name(s).");
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(allMembers);
    const filePath = `./csv_files/${guild.name}_${requestedRoles.join('_')}_members.csv`;

    fs.writeFileSync(filePath, csv, { flag: "w", encoding: "utf-8" }, (error) => {
        if (error) {
            console.log(`Error writing file: ${error.message}`)
        }
    });

    const stream = fs.createReadStream(filePath);
    message.channel.send({
        files: [{
            attachment: stream,
            name: `${guild.name}_${requestedRoles.join('_')}_members.csv`,
            type: 'text/csv'
        }]
    });

}

module.exports = { generateCSV };

// const fs = require('fs');
// const { Parser } = require('json2csv');

// const generateCSV = async (message) => {
//     console.log(message);
//     const guild = await message.guild.fetch();
//     const members = await guild.members.fetch();
//     const allMembers = members
//         .filter(member => !member.user.bot)
//         .map(member => ({
//             Name: member.user.displayName,
//             Tag: member.user.tag,
//             UserID: `User ID: ${member.user.id}`,
//             'Joined Date': member.joinedAt.toDateString(),
//             Roles: member.roles.cache.map(role => role.name).join(', ')
//         }));

//     const json2csvParser = new Parser();
//     const csv = json2csvParser.parse(allMembers);
//     const filePath = `./csv_files/${guild.name}_members.csv`;

//     fs.writeFileSync(filePath, csv, { flag: "a" }, (error) => {
//         if (error) {
//             console.log(`Error writing file: ${error.message}`)
//         }
//     });

//     const stream = fs.createReadStream(filePath);
//     message.channel.send({
//         files: [{
//             attachment: stream,
//             name: `${guild.name}_members.csv`
//         }]
//     });
// }

// module.exports = { generateCSV };