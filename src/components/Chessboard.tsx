import React from "react";

const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalAxis = ["a", "b", "c", "d", "d", "f", "g", "h"];
function Chessboard() {
  let board = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      (horizontalAxis[i], verticalAxis[j]);
      board.push(
        <span className="text-black">
          {horizontalAxis[i]} {verticalAxis[j]}
        </span>,
      );
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[801px] h-[801px] bg-amber-200">{board}</div>
    </div>
  );
}

export default Chessboard;
