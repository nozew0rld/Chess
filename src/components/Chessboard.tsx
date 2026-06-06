import type React from "react";
import Tila from "./Tile/Tila";
import { useRef, useState } from "react";
import Referee from "./Referee/Referee";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
  PieceType,
  TeamType,
  type Piece,
  initialBoardState,
  type Position,
  samePosition,
} from "../models/Piece";

function Chessboard() {
  const activePiece = useRef<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY + chessboard.offsetTop - 800) / GRID_SIZE),
      );
      setGrabPosition({ x: grabX, y: grabY });

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      activePiece.current = element;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;

    if (activePiece.current && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY + chessboard.offsetTop - 800) / GRID_SIZE),
      );

      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition),
      );
      if (currentPiece) {
        const validMove = referee.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces,
        );

        const isEnPassantMove = referee.isEnPassantMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces,
        );
        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (
              !samePosition(piece.position, { x, y: y - pawnDirection })
            ) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);
          setPieces(updatedPieces);
        } else if (validMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              //special move
              piece.enPassant =
                Math.abs(grabPosition.y - y) === 2 &&
                piece.type === PieceType.PAWN;

              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);

          // setPieces((value) => {
          //   const pieces = value.reduce((results, piece) => {
          //     if (piece.x === currentPiece.x && piece.y === currentPiece.y) {
          //       piece.x = x;
          //       piece.y = y;
          //       results.push(piece);
          //     } else if (!(piece.x === x && piece.y === y)) {
          //       results.push(piece);
          //     }
          //     return results;
          //   }, [] as Piece[]);
          //   return pieces;
          // });
        } else {
          activePiece.current.style.position = "relative";
          activePiece.current.style.removeProperty("top");
          activePiece.current.style.removeProperty("left");
        }
      } else {
        activePiece.current.style.position = "relative";
        activePiece.current.style.removeProperty("top");
        activePiece.current.style.removeProperty("left");
      }
    }
    activePiece.current = null;
  } // ending of the function

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece.current && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;

      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;

      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.current.style.position = "absolute";

      if (x < minX) {
        activePiece.current.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.current.style.left = `${maxX}px`;
      } else {
        activePiece.current.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.current.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.current.style.top = `${maxY}px`;
      } else {
        activePiece.current.style.top = `${y}px`;
      }
    }
  }

  const board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        samePosition(p.position, { x: i, y: j }),
      );
      const image = piece ? piece.image : undefined;
      board.push(<Tila key={`${j},${i}`} image={image} number={number} />);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="w-[800px] h-[800px] grid grid-cols-8 grid-rows-8"
        id="chessBoard"
        ref={chessboardRef}
        onMouseDown={(e) => grabPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseUp={(e) => dropPiece(e)}
      >
        {board}
      </div>
    </div>
  );
}
export default Chessboard;
