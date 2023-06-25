import database from '../model';

const fs = require('fs');
const path = require('path');

function seedData() {
    const filePath = path.join(__dirname, 'seeddata.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    const seedPromises = data.map(async (playerData) => {
        const { playerSkills, ...playerInfo } = playerData;

        try {
            const createdPlayer = await database.Player.create(playerInfo);
            const skillPromises = playerSkills.map((skillData) =>
                database.PlayerSkill.create({ playerId: createdPlayer.id, ...skillData })
            );
            await Promise.all(skillPromises);
        } catch (error) {
            console.error(`Failed to seed player: ${playerInfo.name}`);
            console.error(error);
        }
    });

    Promise.all(seedPromises)
        .then(() => {
            console.log('Data seeding complete.');
        })
        .catch((error) => {
            console.error('Data seeding failed.');
            console.error(error);
        });
}

module.exports = seedData;
