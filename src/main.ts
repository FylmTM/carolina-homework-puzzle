import "./main.css";
import { Piece } from "./piece";
import { solvePuzzle } from "./puzzleSolver";

const PIECE_WIDTH = 240;
const PIECE_HEIGHT = 135;

const PUZZLE_WIDTH = 16;
const PUZZLE_HEIGHT = 16;

const canvas = document.querySelector<HTMLCanvasElement>("#puzzle")!;
canvas.width = PUZZLE_WIDTH * PIECE_WIDTH;
canvas.height = PUZZLE_HEIGHT * PIECE_HEIGHT;

const ctx = canvas.getContext("2d")!;

console.log("Loading pieces...");
console.time("Load pieces");
const pieces = await Promise.all(
  Array.from({ length: PUZZLE_HEIGHT * PUZZLE_WIDTH }).map((_, i) =>
    Piece.load(`/peaces/peace-${i}.png`, PIECE_WIDTH, PIECE_HEIGHT)
  )
);
console.timeEnd("Load pieces");

console.log("Solving puzzle...");
console.time("Solve puzzle");
const grid = solvePuzzle(PUZZLE_WIDTH, PUZZLE_HEIGHT, pieces);
console.timeEnd("Solve puzzle");

console.log("Drawing puzzle...");
console.time("Draw puzzle");
for (let y = 0; y < 16; y++) {
  for (let x = 0; x < 16; x++) {
    let piece: Piece = grid[x][y];
    ctx.drawImage(piece.image, x * PIECE_WIDTH, y * PIECE_HEIGHT);
  }
}
console.timeEnd("Draw puzzle");
