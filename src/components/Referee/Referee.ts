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

  pawnMove(
    initialPosition: Position,
    desiredPostion: Position,
    team: TeamType,
    boardState: Piece[],
  ): boolean {
    const specialRow = team === TeamType.OUR ? 1 : 6;
    const pawnDirection = team === TeamType.OUR ? 1 : -1;
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
    return false;
  }

  knightMove(
    initialPosition: Position,
    desiredPostion: Position,
    team: TeamType,
    boardState: Piece[],
  ): boolean {
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
    return false;
  }
  bishopMove(
    initialPosition: Position,
    desiredPostion: Position,
    team: TeamType,
    boardState: Piece[],
  ): boolean {
    for (let i = 1; i < 8; i++) {
      //TOP RIGHT MOVEMENT
      if (
        desiredPostion.x > initialPosition.x &&
        desiredPostion.y > initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x + i,
          y: initialPosition.y + i,
        };
        if (
          passedPosition.x === desiredPostion.x &&
          passedPosition.y === desiredPostion.y
        ) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }

      //BOTTOM RIGHT MOVEMENT
      if (
        desiredPostion.x > initialPosition.x &&
        desiredPostion.y < initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x + i,
          y: initialPosition.y - i,
        };
        if (
          passedPosition.x === desiredPostion.x &&
          passedPosition.y === desiredPostion.y
        ) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }

      //BOTTOM LEFT MOVEMENT
      if (
        desiredPostion.x < initialPosition.x &&
        desiredPostion.y < initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x - i,
          y: initialPosition.y - i,
        };
        if (
          passedPosition.x === desiredPostion.x &&
          passedPosition.y === desiredPostion.y
        ) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }

      //TOP LEFT MOVEMENT
      if (
        desiredPostion.x < initialPosition.x &&
        desiredPostion.y > initialPosition.y
      ) {
        const passedPosition: Position = {
          x: initialPosition.x - i,
          y: initialPosition.y + i,
        };
        if (
          passedPosition.x === desiredPostion.x &&
          passedPosition.y === desiredPostion.y
        ) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }
    }
    return false;
  }

  rookMove(
    initialPosition: Position,
    desiredPostion: Position,
    team: TeamType,
    boardState: Piece[],
  ): boolean {
    if (initialPosition.x === desiredPostion.x) {
      for (let i = 1; i < 8; i++) {
        const multiplier = desiredPostion.y < initialPosition.y ? -1 : 1;

        const passedPosition: Position = {
          x: initialPosition.x,
          y: initialPosition.y + i * multiplier,
        };
        if (
          passedPosition.x === desiredPostion.x &&
          passedPosition.y === desiredPostion.y
        ) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }
    }
    if (initialPosition.y === desiredPostion.y) {
      for (let i = 1; i < 8; i++) {
        const multiplier = desiredPostion.x < initialPosition.x ? -1 : 1;

        const passedPosition: Position = {
          x: initialPosition.x + i * multiplier,
          y: initialPosition.y,
        };
        if (
          passedPosition.x === desiredPostion.x &&
          passedPosition.y === desiredPostion.y
        ) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }
    }
    return false;
  }
  queenMove(
    initialPosition: Position,
    desiredPostion: Position,
    team: TeamType,
    boardState: Piece[],
  ): boolean {
    for (let i = 1; i < 8; i++) {
      //vertical
      if (desiredPostion.x === initialPosition.x) {
        const multiplier = desiredPostion.y < initialPosition.y ? -1 : 1;
        const passedPosition: Position = {
          x: initialPosition.x,
          y: initialPosition.y + i * multiplier,
        };
        if (samePosition(passedPosition, desiredPostion)) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }
      //horizontal
      if (desiredPostion.y === initialPosition.y) {
        const multiplier = desiredPostion.x < initialPosition.x ? -1 : 1;
        const passedPosition: Position = {
          x: initialPosition.x + i * multiplier,
          y: initialPosition.y,
        };
        if (samePosition(passedPosition, desiredPostion)) {
          if (
            this.tileIsEmpyOrOccupiedByOpponent(
              passedPosition,
              boardState,
              team,
            )
          ) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }
      //top right
      if (
        desiredPostion.y > initialPosition.y &&
        desiredPostion.x > initialPosition.x
      ) {
        console.log("top  right");
      }
      //top left
      if (
        desiredPostion.y > initialPosition.y &&
        desiredPostion.x < initialPosition.x
      ) {
        console.log("top  left");
      }
      //bottom left
      if (
        desiredPostion.y < initialPosition.y &&
        desiredPostion.x < initialPosition.x
      ) {
        console.log("bottom  left");
      }
      //bottom right
      if (
        desiredPostion.y < initialPosition.y &&
        desiredPostion.x > initialPosition.x
      ) {
        console.log("bottom  right");
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
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = this.pawnMove(
          initialPosition,
          desiredPostion,
          team,
          boardState,
        );
        break;
      case PieceType.KNIGHT:
        validMove = this.knightMove(
          initialPosition,
          desiredPostion,
          team,
          boardState,
        );
        break;
      case PieceType.BISHOP:
        validMove = this.bishopMove(
          initialPosition,
          desiredPostion,
          team,
          boardState,
        );
        break;
      case PieceType.ROOK:
        validMove = this.rookMove(
          initialPosition,
          desiredPostion,
          team,
          boardState,
        );
        break;
      case PieceType.QUEEN:
        validMove = this.queenMove(
          initialPosition,
          desiredPostion,
          team,
          boardState,
        );
        break;
      case PieceType.KING:
    }
    return validMove;
  }
}
