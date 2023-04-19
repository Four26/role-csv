const fs = require('fs');
const { Parser } = require('json2csv');

const generateCSV = async (message) => {
    console.log(message);
    const guild = await message.guild.fetch();
    const members = await guild.members.fetch();
    const allMembers = members
        .filter(member => !member.user.bot)
        .map(member => ({
            Name: member.user.displayName,
            Tag: member.user.tag,
            UserID: `User ID: ${member.user.id}`,
            'Joined Date': member.joinedAt.toDateString(),
            Roles: member.roles.cache.map(role => role.name).join(', ')
        }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(allMembers);
    const filePath = `./csv_files/${guild.name}_members.csv`;

    fs.writeFileSync(filePath, csv, { flag: "a" }, (error) => {
        if (error) {
            console.log(`Error writing file: ${error.message}`)
        }
    });

    const stream = fs.createReadStream(filePath);
    message.channel.send({
        files: [{
            attachment: stream,
            name: `${guild.name}_members.csv`
        }]
    });
}

module.exports = { generateCSV };
