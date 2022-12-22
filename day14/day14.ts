import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const { grid } = createGrid();
  let sand = 0;
  while (true) {
    const [row, col] = dropSand(0, 500, grid);
    if (sandIsOutOfBounds(row, col, grid)) {
      break;
    }
    grid[row][col] = "O";
    sand += 1;
  }
  return sand;
}

function part2() {
  const { grid, maxRow } = createGrid();
  // set floor
  grid[maxRow + 2] = new Array(1000).fill("#");

  let sand = 0;
  while (true) {
    const [row, col] = dropSand(0, 500, grid);
    grid[row][col] = "O";
    sand += 1;
    // sand can no longer be dropped
    if (row === 0 && col === 500) {
      break;
    }
  }
  return sand;
}

function createGrid(): { grid: string[][]; maxRow: number } {
  const input = getInput();
  const grid: string[][] = Array.from(new Array(600), () =>
    new Array(1000).fill(".")
  );
  let maxRow = 0;

  input.forEach((c) => {
    let prevCords: number[] | undefined;
    const coords = c.split(" -> ");

    coords.forEach((c) => {
      const [originalCol, originalRow] = c.split(",").map((n) => Number(n));
      let [row, col] = [originalRow, originalCol];
      maxRow = Math.max(maxRow, originalRow);

      if (prevCords == null) {
        grid[row][col] = "#";
      } else {
        if (prevCords[0] === col) {
          while (row !== prevCords[1]) {
            grid[row][col] = "#";
            row += prevCords[1] < row ? -1 : 1;
          }
        } else {
          while (col !== prevCords[0]) {
            grid[row][col] = "#";
            col += prevCords[0] < col ? -1 : 1;
          }
        }
      }
      prevCords = [originalCol, originalRow];
    });
  });
  return { grid, maxRow };
}

function sandIsOutOfBounds(row: number, col: number, grid: string[][]) {
  return row + 1 >= grid.length || col >= grid[0].length || col < 0;
}

function dropSand(row: number, col: number, grid: string[][]): number[] {
  if (sandIsOutOfBounds(row, col, grid)) {
    return [row, col];
  }

  while (grid[row + 1][col] === ".") {
    row++;
    if (sandIsOutOfBounds(row, col, grid)) {
      return [row, col];
    }
  }

  if (grid[row + 1][col - 1] === ".") {
    return dropSand(row, col - 1, grid);
  } else if (grid[row + 1][col + 1] === ".") {
    return dropSand(row, col + 1, grid);
  }
  return [row, col];
}

console.log(part1());
console.log(part2());
