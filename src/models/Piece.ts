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

export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
}
