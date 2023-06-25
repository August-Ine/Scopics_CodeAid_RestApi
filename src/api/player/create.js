// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import database from "../../db/model";

export default async (req, res) => {
  try {
    const { name, position, playerSkills } = req.body;

    // Create a new player using the Player model's create() method
    const newPlayer = await database.Player.create({
      name,
      position,
      playerSkills: playerSkills.map(skill => ({
        skill: skill.skill,
        value: skill.value
      }))
    }, {
      include: [database.PlayerSkill] // Include associated model PlayerSkill
    });

    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ message: `An error occurred while creating new player: ${error}` });
  }
}
