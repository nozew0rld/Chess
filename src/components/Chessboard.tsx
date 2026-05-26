import type React from "react";
import Tila from "./Tile/Tila";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
  image: string;
  x: number;
  y: number;
}
const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const type = p === 0 ? "b" : "w";
  const y = p === 0 ? 7 : 0;

  pieces.push({ image: `./src/assets/${type}r.png`, x: 0, y });
  pieces.push({ image: `./src/assets/${type}r.png`, x: 7, y });

  pieces.push({ image: `./src/assets/${type}n.png`, x: 1, y });
  pieces.push({ image: `./src/assets/${type}n.png`, x: 6, y });

  pieces.push({ image: `./src/assets/${type}b.png`, x: 2, y });
  pieces.push({ image: `./src/assets/${type}b.png`, x: 5, y });

  pieces.push({ image: `./src/assets/${type}q.png`, x: 3, y });
  pieces.push({ image: `./src/assets/${type}k.png`, x: 4, y });
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: "./src/assets/bp.png", x: i, y: 6 });
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: "./src/assets/wp.png", x: i, y: 1 });
}

let activePiece: HTMLElement | null = null;

function grabPiece(e: React.MouseEvent) {
  const element = e.target as HTMLElement;
  if (element.classList.contains("chess-piece")) {
    console.log(e);

    const x = e.clientX - 50;
    const y = e.clientY - 50;
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    activePiece = element;
  }
}

function dropPiece(e: React.MouseEvent) {
  if (activePiece) {
    activePiece = null;
  }
}

function movePiece(e: React.MouseEvent) {
  const element = e.target as HTMLElement;

  if (activePiece) {
    const x = e.clientX - 50;
    const y = e.clientY - 50;
    activePiece.style.position = "absolute";
    activePiece.style.left = `${x}px`;
    activePiece.style.top = `${y}px`;
  }
}

function Chessboard() {
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
