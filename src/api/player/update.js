// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import database from "../../db/model";


export default async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, playerSkills } = req.body;

    // Find the player by ID
    const player = await database.Player.findByPk(id, {
      include: database.PlayerSkill // Include associated PlayerSkills
    });

    if (!player) {
      return res.status(404).json({ message: `The player was not found` });
    }

    // Update player attributes
    player.name = name;
    player.position = position;

    // Delete existing PlayerSkills
    await database.PlayerSkill.destroy({
      where: {
        playerId: player.id
      }
    });

    // Create and associate new PlayerSkills async
    await Promise.all(playerSkills.map(async skill => {
      await database.PlayerSkill.create({
        skill: skill.skill,
        value: skill.value,
        playerId: player.id
      });
    }));

    // Save the updated player
    await player.save();

    // Send back updated entity
    const playerToReturn = await database.Player.findByPk(id, {
      include: database.PlayerSkill // Include associated PlayerSkills
    });

    res.json(playerToReturn);
  } catch (error) {
    res.status(500).json({ message: `An error occurred while updating player: ${error}` });
  }
}

