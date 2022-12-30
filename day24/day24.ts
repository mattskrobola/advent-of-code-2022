import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c)
    .map((c) => c.split(""))
    .map((c) => c.map((c) => [c]));
}

function part1() {
  const grid = getInput();
  let [row, col] = [0, 1];
  const blizzards: { [key: number]: string[][][] } = [];
  blizzards[0] = runBlizzard(grid);

  for (let i = 1; i <= (grid.length - 2) * (grid[0].length - 2); i++) {
    blizzards[i] = runBlizzard(blizzards[i - 1]);
  }
  return dfs(row, col, 0, blizzards, {});
}

function part2() {
  const grid = getInput();
  let [row, col] = [0, 1];

  const blizzards = getAllPossibleBlizzards(grid);

  // Rotate the blizzards 180 degrees to use when going from end to start
  const flippedBlizzards: { [key: number]: string[][][] } = [];
  for (let i = 0; i <= (grid.length - 2) * (grid[0].length - 2); i++) {
    flippedBlizzards[i] = rotateMatrix(blizzards[i]);
  }

  const firstGoalMin = dfs(row, col, 0, blizzards, {});
  const backToStartMin =
    dfs(row, col, firstGoalMin, flippedBlizzards, {}) + firstGoalMin;
  return dfs(row, col, backToStartMin, blizzards, {}) + backToStartMin;
}

// Creates all possible blizzard maps
function getAllPossibleBlizzards(grid: string[][][]): {
  [key: number]: string[][][];
} {
  const blizzards: { [key: number]: string[][][] } = [];
  blizzards[0] = runBlizzard(grid);
  for (let i = 1; i <= (grid.length - 2) * (grid[0].length - 2); i++) {
    blizzards[i] = runBlizzard(blizzards[i - 1]);
  }
  return blizzards;
}

// Flip the blizzard map and all blizzards within it 180 degrees
function rotateMatrix(matrix: string[][][]): string[][][] {
  const newMatrix: string[][][] = Array.from(
    new Array(matrix.length),
    () => []
  );
  const rows = matrix.length - 1;
  const cols = matrix[0].length - 1;
  for (let i = rows; i >= 0; i--) {
    for (let j = cols; j >= 0; j--) {
      let value = matrix[i][j];
      value = value.map((v) => {
        switch (v) {
          case "^":
            return "v";
          case ">":
            return "<";
          case "<":
            return ">";
          case "v":
            return "^";
          default:
            return v;
        }
      });
      newMatrix[rows - i].push(value);
    }
  }
  return newMatrix;
}

// Moves the blizzard foward 1 minute
function runBlizzard(grid: string[][][]): string[][][] {
  const newGrid: string[][][] = Array.from(new Array(grid.length), () =>
    Array.from(new Array(grid[0].length), () => [])
  );
  const rows = grid.length - 1;
  const cols = grid[0].length - 1;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      grid[row][col].forEach((blizzard) => {
        switch (blizzard) {
          case "<":
            if (grid[row][col - 1][0] === "#") {
              newGrid[row][cols - 1].push("<");
            } else {
              newGrid[row][col - 1].push("<");
            }
            break;
          case ">":
            if (grid[row][col + 1][0] === "#") {
              newGrid[row][1].push(">");
            } else {
              newGrid[row][col + 1].push(">");
            }
            break;
          case "v":
            if (grid[row + 1][col][0] === "#") {
              newGrid[1][col].push("v");
            } else {
              newGrid[row + 1][col].push("v");
            }
            break;
          case "^":
            if (grid[row - 1][col][0] === "#") {
              newGrid[rows - 1][col].push("^");
            } else {
              newGrid[row - 1][col].push("^");
            }
            break;
          case "#":
            newGrid[row][col].push("#");
            break;
          case ".":
            break;
        }
      });
    }
  }
  return newGrid;
}

// returns minimum number of minutes to reach the goal
function dfs(
  row: number,
  col: number,
  minute: number,
  blizzards: { [key: number]: string[][][] },
  memo: { [key: number]: number[] }
): number {
  const numCols = blizzards[0][0].length;
  const numRows = blizzards[0].length;
  const uniqueBlizzards = (numRows - 2) * (numCols - 2);
  const blizzKey = minute % uniqueBlizzards;
  const blizzard = blizzards[blizzKey];

  // reached the goal
  if (col === numCols - 2 && row === numRows - 1) {
    return 1;
  }

  // cap minutes to prevent infinite recursion
  if (minute > 1000 || (row === 0 && col === 1 && minute > 600)) {
    return Infinity;
  }

  // out of bounds or hit a wall
  if (
    row < 0 ||
    col < 0 ||
    col >= numCols ||
    row >= numRows ||
    blizzard[row][col][0] === "#"
  ) {
    return Infinity;
  }

  // hit a blizzard
  if (blizzard[row][col].length > 0) {
    return Infinity;
  }

  const memoKey = row + col * numCols + blizzKey * numCols * numRows;
  if (memo[memoKey] !== undefined) {
    if (memo[memoKey][1] <= minute) {
      return memo[memoKey][0];
    } else {
      memo[memoKey][1] = minute;
    }
  }

  const min =
    1 +
    Math.min(
      dfs(row, col, minute + 1, blizzards, memo),
      dfs(row - 1, col, minute + 1, blizzards, memo),
      dfs(row + 1, col, minute + 1, blizzards, memo),
      dfs(row, col - 1, minute + 1, blizzards, memo),
      dfs(row, col + 1, minute + 1, blizzards, memo)
    );
  memo[memoKey] = [min, minute];
  return memo[memoKey][0];
}

console.log(part1());
console.log(part2());
