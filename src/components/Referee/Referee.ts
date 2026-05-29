import { PieceType, TeamType } from "../Chessboard";

export default class Referee {
  isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
  ) {
    console.log("checking the move");
    console.log(`prev location (${px} , ${py})`);
    console.log(`current location (${x},${y})`);
    console.log(`Piece type (${type})`);
    console.log(`Team type (${team})`);

    if (type === PieceType.PAWN) {
      if (team === TeamType.OUR) {
        if (py === 1) {
          if (px === x && (y - py === 1 || y - py === 2)) {
            console.log("valid move");
            return true;
          }
        } else {
          if (px === x && y - py === 1) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
