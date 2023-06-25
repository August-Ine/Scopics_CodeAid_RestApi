// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import database from "../../db/model";

//check for duplicates in request
function validateRequirements(requirements) {
  const requestedCombinations = new Set();

  for (const requirement of requirements) {
    const { position, mainSkill } = requirement;

    // Create a unique key for the combination of position and mainSkill
    const combinationKey = `${position}:${mainSkill}`;

    // Check if the combination already exists
    if (requestedCombinations.has(combinationKey)) {
      // Handle the validation error, as the combination is already requested
      throw new Error(`Duplicate requirement: ${position} with ${mainSkill}`);
    }

    // Add the combination to the set
    requestedCombinations.add(combinationKey);
  }
}

function validatePlayerAvailability(requirements) {
  const requiredPositions = requirements.map((requirement) => requirement.position);
  const requiredPositionsCount = {};

  // Count the number of players available for each position
  for (const position of requiredPositions) {
    requiredPositionsCount[position] = (requiredPositionsCount[position] || 0) + 1;
  }

  // Retrieve players from the database based on the required positions
  database.Player.findAndCountAll({
    where: { position: requiredPositions },
  })
    .then((result) => {
      const availablePositionsCount = {};

      // Count the number of players available for each position
      for (const player of result.rows) {
        availablePositionsCount[player.position] = (availablePositionsCount[player.position] || 0) + 1;
      }

      // Check if all required positions have the required number of players
      for (const position in requiredPositionsCount) {
        const requiredCount = requiredPositionsCount[position];
        const availableCount = availablePositionsCount[position] || 0;

        if (availableCount < requiredCount) {
          throw new Error(`Insufficient number of players for position: ${position}`);
        }
      }

      // Proceed with the normal flow of your application
    })
    .catch((error) => {
      // Handle the error indicating insufficient number of players
      res.status(500).json({ message: `${error.message}` });
    });
}

export default async (req, res) => {
  try {
    const requirements = req.body;

    // validate requirements
    try {
      validateRequirements(requirements);
      validatePlayerAvailability(requirements);
      // The requirements are valid
      const bestPlayers = [];

      // Iterate over each requirement
      for (const requirement of requirements) {
        const { position, mainSkill, numberOfPlayers } = requirement;

        // Find the best players based on position and main skill
        const players = await database.Player.findAll({
          where: {
            position: position,
          },
          include: {
            model: database.PlayerSkill,
            where: {
              skill: mainSkill,
            },
          },
          order: [[{ model: database.PlayerSkill }, 'value', 'DESC']],
          limit: numberOfPlayers
        });

        if (players.length > 0) {
          // Players found append them to list
          bestPlayers.push(...players);
        }
        // No players found
        const highestSkillPlayer = await database.Player.findAll({
          where: { position: position },
          include: [database.PlayerSkill],
          order: [[database.PlayerSkill, 'value', 'DESC']],
          limit: numberOfPlayers
        });
        if (highestSkillPlayer.length > 1) {
          bestPlayers.push(...highestSkillPlayer);//append list if more than one
        }
        bestPlayers.push(highestSkillPlayer[0]);
      }
      res.json(bestPlayers);
    } catch (error) {
      // Handle the validation error
      res.status(500).json({ message: `Requirement validation error: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({ message: `An error occurred: ${error}` });
  }
}
