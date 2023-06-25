// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import Player from '../../db/model/player';
import PlayerSkill from '../../db/model/playerSkill';

export default async (req, res) => {
  try {
    // Retrieve all players from the database
    const players = await Player.findAll({
      include: PlayerSkill
    });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: `An error occurred while getting list of players: ${error}` });
  }
}
