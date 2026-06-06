import {
  PieceType,
  samePosition,
  TeamType,
  type Piece,
  type Position,
} from "../../models/Piece";

export default class Referee {
  tileIsEmpyOrOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType,
  ) {
    return (
      !this.tileIsOccupied(position, boardState) ||
      this.tileIsOccupiedByOpponent(position, boardState, team)
    );
  }

  tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position));
    if (piece) {
      return true;
    } else {
      return false;
    }
  }
  tileIsOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType,
  ): boolean {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team,
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
    //PAWN MOVEMENT
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
          !this.tileIsOccupied(desiredPostion, boardState) &&
          !this.tileIsOccupied(
            { x: desiredPostion.x, y: desiredPostion.y - pawnDirection },
            boardState,
          )
        ) {
          return true;
        }
      } else if (
        initialPosition.x === desiredPostion.x &&
        desiredPostion.y - initialPosition.y === pawnDirection
      ) {
        if (!this.tileIsOccupied(desiredPostion, boardState)) {
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
        if (this.tileIsOccupiedByOpponent(desiredPostion, boardState, team)) {
          return true;
        }
      } else if (
        desiredPostion.x - initialPosition.x === 1 &&
        desiredPostion.y - initialPosition.y === pawnDirection
      ) {
        //attack in upper of bottom right corner
        console.log("upper / bottom right");
        if (this.tileIsOccupiedByOpponent(desiredPostion, boardState, team)) {
          return true;
        }
      }
      //MOVEMENT FOR KNIGTH
    } else if (type === PieceType.KNIGHT) {
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          //top and bottom side
          if (desiredPostion.y - initialPosition.y === 2 * i) {
            if (desiredPostion.x - initialPosition.x === j) {
              if (
                this.tileIsEmpyOrOccupiedByOpponent(
                  desiredPostion,
                  boardState,
                  team,
                )
              ) {
                return true;
              }
            }
          }
          // right and left side
          if (desiredPostion.x - initialPosition.x === 2 * i) {
            if (desiredPostion.y - initialPosition.y === j) {
              if (
                this.tileIsEmpyOrOccupiedByOpponent(
                  desiredPostion,
                  boardState,
                  team,
                )
              ) {
                return true;
              }
            }
          }
        }
      }
      //MOVEMENT FOR BISHOP
    } else if (type === PieceType.BISHOP) {
      for (let i = 1; i < 8; i++) {
        //TOP RIGHT MOVEMENT
        if (
          desiredPostion.x > initialPosition.x &&
          desiredPostion.y > initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y + i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move");
            break;
          }
        }
        if (
          desiredPostion.x - initialPosition.x === i &&
          desiredPostion.y - initialPosition.y === i
        ) {
          return true;
        }

        //BOTTOM RIGHT MOVEMENT
        if (
          desiredPostion.x > initialPosition.x &&
          desiredPostion.y < initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y - i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("illegal move");
            break;
          }
        }
        if (
          desiredPostion.x - initialPosition.x === i &&
          desiredPostion.y - initialPosition.y === -i
        ) {
          return true;
        }

        //BOTTOM LEFT MOVEMENT
        if (
          desiredPostion.x < initialPosition.x &&
          desiredPostion.y < initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y - i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("illegal move");
            break;
          }
        }
        if (
          desiredPostion.x - initialPosition.x === -i &&
          desiredPostion.y - initialPosition.y === -i
        ) {
          return true;
        }

        //TOP LEFT MOVEMENT
        if (
          desiredPostion.x < initialPosition.x &&
          desiredPostion.y > initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y + i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("illegal move");
            break;
          }
        }
        if (
          desiredPostion.x - initialPosition.x === -i &&
          desiredPostion.y - initialPosition.y === i
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
