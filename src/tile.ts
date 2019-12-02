type Rect = Record<"x" | "y" | "w" | "h", number>;

export function* transpose(data: Generator<Rect>) {
  for (const { x: y, y: x, w: h, h: w } of data) {
    yield { x, y, w, h };
  }
}

export function *tile(width: number, height: number): Generator<Rect> {
  for (let y = 0; y < height - 2; y += 3) {
    for (let x = 0; x < width - 2; x += 3) {
      yield { x, y, w: 3, h: 3}
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x >= width - width % 3 || y >= height - height % 3) {
        yield { x, y, w: 1, h: 1 }
      }
    }
  }
}
