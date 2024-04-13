import { loadRawImage } from "./imageLoader";

export class Piece {
  readonly isTop: boolean;
  readonly isLeft: boolean;

  readonly topRow: Uint8ClampedArray;
  readonly bottomRow: Uint8ClampedArray;
  readonly leftColumn: Uint8ClampedArray;
  readonly rightColumn: Uint8ClampedArray;

  static async load(
    url: string,
    baseWidth: number,
    baseHeight: number
  ): Promise<Piece> {
    const { image, pixels } = await loadRawImage(url);
    return new Piece(baseWidth, baseHeight, image, pixels);
  }

  constructor(
    public readonly baseWidth: number,
    public readonly baseHeight: number,
    public readonly image: HTMLImageElement,
    pixels: Uint8ClampedArray
  ) {
    this.image = image;
    this.isTop = image.height === this.baseHeight;
    this.isLeft = image.width === this.baseWidth;

    // Get baseWidth pixels from top row
    this.topRow = pixels.slice(0, this.baseWidth * 4);

    // Get baseWidth pixels from bottom row
    const startBottomRow = image.width * (image.height - 1) * 4;
    this.bottomRow = pixels.slice(
      startBottomRow,
      startBottomRow + this.baseWidth * 4
    );

    // Get baseHeight pixels from left column
    this.leftColumn = new Uint8ClampedArray(this.baseHeight * 4);
    for (let y = 0; y < this.baseHeight; y++) {
      const start = y * image.width * 4;
      this.leftColumn.set(pixels.slice(start, start + 4), y * 4);
    }

    // Get baseHeight pixels from right column
    this.rightColumn = new Uint8ClampedArray(this.baseHeight * 4);
    for (let y = 0; y < this.baseHeight; y++) {
      const start = y * image.width * 4 + (image.width - 1) * 4;
      this.rightColumn.set(pixels.slice(start, start + 4), y * 4);
    }
  }

  public isTopLeft = (): boolean => {
    return this.isTop && this.isLeft;
  };

  public overlapsOnRight = (piece: Piece): boolean => {
    return compareBuffers(this.rightColumn, piece.leftColumn);
  };

  public overlapsOnBottom = (piece: Piece): boolean => {
    return compareBuffers(this.bottomRow, piece.topRow);
  };
}

function compareBuffers(a: Uint8ClampedArray, b: Uint8ClampedArray) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
