interface Props {
  image?: string;
  number: number;
}

export default function Tila({ number, image }: Props) {
  if (number % 2 === 0) {
    return (
      <div className="bg-[#ba5645]">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="chess-piece w-[100px] h-[100px] bg-cover bg-center bg-no-repeat bg-size-[80px] cursor-grab active:cursor-grabbing "
          ></div>
        )}
      </div>
    );
  } else {
    return (
      <div className="bg-[#f5dcc4]">
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="chess-piece w-[100px] h-[100px] bg-cover bg-center bg-no-repeat bg-size-[80px] cursor-grab active:cursor-grabbing "
          ></div>
        )}
      </div>
    );
  }
}
