interface Props {
  image: string;
  number: number;
}

export default function Tila({ number, image }: Props) {
  if (number % 2 === 0) {
    return (
      <div className="bg-[#ba5645]">
        <img src={image} />
      </div>
    );
  } else {
    return (
      <div className="bg-[#f5dcc4]">
        <img src={image} />
      </div>
    );
  }
}
