import React from "react";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "d", "f", "g", "h"];
function Chessboard() {
  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;

      if (number % 2 === 0) {
        (horizontalAxis[i], verticalAxis[j]);
        board.push(<div className="bg-[#ba5645] w-[100px] h-[100px]"></div>);
      } else {
        (horizontalAxis[i], verticalAxis[j]);
        board.push(<div className="bg-[#f5dcc4] w-[100px] h-[100px]"></div>);
      }
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[800px] h-[800px] bg-amber-200 grid grid-cols-8 grid-rows-8">
        {board}
      </div>
    </div>
  );
}

export default Chessboard;
