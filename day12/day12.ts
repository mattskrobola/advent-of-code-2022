import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  const grid: string[][] = input.map((row) => row.split("").map((c) => c));
  const steps: number[][] = input.map((row) =>
    row.split("").map((c) => Infinity)
  );
  let [startRow, startCol] = getCoords(grid, "S")[0];
  dfs(grid, steps, startRow, startCol, 0, "a");

  let [eRow, eCol] = getCoords(grid, "E")[0];
  return steps[eRow][eCol];
}

function part2() {
  const input = getInput();
  const grid: string[][] = input.map((row) => row.split("").map((c) => c));
  let [eRow, eCol] = getCoords(grid, "E")[0];

  let minSteps = Infinity;
  const coordinates = getCoords(grid, "a");
  // Try DFS starting at each 'a' coordinate on the grid
  coordinates.forEach((coordinate) => {
    // Reset steps before each DFS
    const steps: number[][] = input.map((row) =>
      row.split("").map((c) => Infinity)
    );
    dfs(grid, steps, coordinate[0], coordinate[1], 0, "a");
    minSteps = Math.min(minSteps, steps[eRow][eCol]);
  });
  return minSteps;
}

function dfs(
  grid: string[][],
  steps: number[][],
  curRow: number,
  curCol: number,
  curSteps: number,
  prevElevation: string
) {
  if (curRow < 0 || curRow >= grid.length) {
    return;
  }
  if (curCol < 0 || curCol >= grid[0].length) {
    return;
  }
  if (!canCross(prevElevation, grid[curRow][curCol])) {
    return;
  }
  if (steps[curRow][curCol] <= curSteps) {
    return;
  }

  const curElevation = grid[curRow][curCol];

  steps[curRow][curCol] = curSteps;
  dfs(grid, steps, curRow - 1, curCol, curSteps + 1, curElevation);
  dfs(grid, steps, curRow + 1, curCol, curSteps + 1, curElevation);
  dfs(grid, steps, curRow, curCol - 1, curSteps + 1, curElevation);
  dfs(grid, steps, curRow, curCol + 1, curSteps + 1, curElevation);
}

function getCoords(grid: string[][], targetLetter: string): number[][] {
  const coords: number[][] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === targetLetter) {
        coords.push([i, j]);
      }
    }
  }
  return coords;
}

function canCross(source: string, dest: string) {
  // special cases
  if (dest === "S" || source === "S") {
    return true;
  }
  if (dest === "E") {
    return source === "z";
  }

  // can only cross if the source is a most 1 level lower than the dest
  // e.g: a - b === -1 : true | a - c === -2 : false
  return source.charCodeAt(0) - dest.charCodeAt(0) >= -1;
}

console.log(part1());
console.log(part2());
