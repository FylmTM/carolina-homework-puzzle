import { Piece } from "./piece";

function findInStack(set: Set<Piece>, predicate: (piece: Piece) => boolean) {
  for (const item of set) {
    if (predicate(item)) {
      return item;
    }
  }
  throw new Error("Item not found");
}

export function solvePuzzle(
  puzzleWidth: number,
  puzzleHeight: number,
  pieces: Piece[]
): Piece[][] {
  const grid = Array.from({ length: puzzleWidth }, () =>
    new Array(puzzleHeight).fill(null)
  );
  const stack = new Set(pieces);

  const findTopLeft = () => findInStack(stack, (piece) => piece.isTopLeft());
  const findBottomPiece = (top: Piece) =>
    findInStack(stack, (bottom) => top.overlapsOnBottom(bottom));
  const findRightPiece = (left: Piece) =>
    findInStack(stack, (right) => left.overlapsOnRight(right));

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      let piece: Piece;

      if (x === 0 && y === 0) {
        // Top left corner
        piece = findTopLeft();
      } else if (x === 0) {
        // Left column
        const topPiece = grid[x][y - 1]!;
        piece = findBottomPiece(topPiece);
      } else {
        // Every other piece
        const leftPiece = grid[x - 1][y]!;
        piece = findRightPiece(leftPiece);
      }

      grid[x][y] = piece;
      stack.delete(piece); // Remove used pieces
    }
  }

  return grid;
}
