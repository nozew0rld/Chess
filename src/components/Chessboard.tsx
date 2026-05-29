import type React from "react";
import Tila from "./Tile/Tila";
import { useRef, useState } from "react";
import Referee from "./Referee/Referee";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

export const TeamType = {
  OPPONENT: 0,
  OUR: 1,
} as const;

export type TeamType = (typeof TeamType)[keyof typeof TeamType];

export const PieceType = {
  PAWN: 0,
  BISHOP: 1,
  KNIGHT: 2,
  ROOK: 3,
  QUEEN: 4,
  KING: 5,
} as const;

export type PieceType = (typeof PieceType)[keyof typeof PieceType];

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
  const type = teamType === TeamType.OPPONENT ? "b" : "w";
  const y = teamType === TeamType.OPPONENT ? 7 : 0;

  initialBoardState.push({
    image: `./src/assets/${type}r.png`,
    x: 0,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `./src/assets/${type}r.png`,
    x: 7,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });

  initialBoardState.push({
    image: `./src/assets/${type}n.png`,
    x: 1,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `./src/assets/${type}n.png`,
    x: 6,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });

  initialBoardState.push({
    image: `./src/assets/${type}b.png`,
    x: 2,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `./src/assets/${type}b.png`,
    x: 5,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });

  initialBoardState.push({
    image: `./src/assets/${type}q.png`,
    x: 3,
    y,
    type: PieceType.QUEEN,
    team: teamType,
  });
  initialBoardState.push({
    image: `./src/assets/${type}k.png`,
    x: 4,
    y,
    type: PieceType.KING,
    team: teamType,
  });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "./src/assets/bp.png",
    x: i,
    y: 6,
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "./src/assets/wp.png",
    x: i,
    y: 1,
    type: PieceType.PAWN,
    team: TeamType.OUR,
  });
}

function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(
        Math.abs(Math.ceil((e.clientY + chessboard.offsetTop - 800) / 100)),
      );

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;

    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY + chessboard.offsetTop - 800) / 100),
      );

      // Update the piece position
      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            const validMove = referee.isValidMove(
              gridX,
              gridY,
              x,
              y,
              p.type,
              p.team,
            );
            if (validMove) {
              p.x = x;
              p.y = y;
            } else {
              activePiece.style.position = "relative";
              activePiece.style.removeProperty("top");
              activePiece.style.removeProperty("left");
            }
          }
          return p;
        });
        return pieces;
      });
      setActivePiece(null);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;

      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;

      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;

      let image = undefined;

      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      });

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
