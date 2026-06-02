import {
  PieceType,
  TeamType,
  type Piece,
  type Position,
} from "../../models/Piece";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find(
      (p) => p.position.x === x && p.position.y === y,
    );
    if (piece) {
      return true;
    } else {
      return false;
    }
  }
  tileIsOccupiedByOpponent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType,
  ): boolean {
    const piece = boardState.find(
      (p) => p.position.x === x && p.position.y === y && p.team !== team,
    );
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  isEnPassantMove(
    initialPosition: Position,
    desiredPostion: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPostion.x - initialPosition.x === -1 ||
          desiredPostion.x - initialPosition.x === 1) &&
        desiredPostion.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPostion.x &&
            p.position.y === desiredPostion.y - pawnDirection &&
            p.enPassant,
        );
        if (piece) {
          return true;
        }
      }
    }
    return false;
  }

  isValidMove(
    initialPosition: Position,
    desiredPostion: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
  ) {
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;

      //movement logic
      if (
        initialPosition.x === desiredPostion.x &&
        initialPosition.y === specialRow &&
        desiredPostion.y - initialPosition.y === 2 * pawnDirection
      ) {
        if (
          !this.tileIsOccupied(
            desiredPostion.x,
            desiredPostion.y,
            boardState,
          ) &&
          !this.tileIsOccupied(
            desiredPostion.x,
            desiredPostion.y - pawnDirection,
            boardState,
          )
        ) {
          return true;
        }
      } else if (
        initialPosition.x === desiredPostion.x &&
        desiredPostion.y - initialPosition.y === pawnDirection
      ) {
        if (
          !this.tileIsOccupied(desiredPostion.x, desiredPostion.y, boardState)
        ) {
          return true;
        }
      }
      //attack logic
      else if (
        desiredPostion.x - initialPosition.x === -1 &&
        desiredPostion.y - initialPosition.y === pawnDirection
      ) {
        //attack in upper or bottom left corner
        console.log("upper / bottom left");
        if (
          this.tileIsOccupiedByOpponent(
            desiredPostion.x,
            desiredPostion.y,
            boardState,
            team,
          )
        ) {
          return true;
        }
      } else if (
        desiredPostion.x - initialPosition.x === 1 &&
        desiredPostion.y - initialPosition.y === pawnDirection
      ) {
        //attack in upper of bottom right corner
        console.log("upper / bottom right");
        if (
          this.tileIsOccupiedByOpponent(
            desiredPostion.x,
            desiredPostion.y,
            boardState,
            team,
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
