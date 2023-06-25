// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------
import database from "../../db/model";

export default async (req, res) => {
  try {
    const { id } = req.params;

    // Find the player by ID
    const player = await database.Player.findByPk(id);

    if (!player) {
      return res.status(404).json({ message: `Player with the id was not found` });
    }

    // Delete the player
    await player.destroy();

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `An error occurred while deleting player: ${error}` });
  }
};








