import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  const treeGrid: number[][] = input.map((line) =>
    line.split("").map((c) => parseInt(c))
  );

  let numVisibleTreesFromEdge = 0;
  const numRows = treeGrid.length;
  const numCols = treeGrid[0].length;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (isEdge(treeGrid, row, col)) {
        // all edges are visible from the edge
        numVisibleTreesFromEdge += 1;
        continue;
      }

      if (
        (getNumVisibleTreesRight(treeGrid, row, col) === numCols - col - 1 &&
          treeGrid[row][numCols - 1] < treeGrid[row][col]) ||
        (getNumVisibleTreesLeft(treeGrid, row, col) === col &&
          treeGrid[row][0] < treeGrid[row][col]) ||
        (getNumVisibleTreesUp(treeGrid, row, col) === row &&
          treeGrid[0][col] < treeGrid[row][col]) ||
        (getNumVisibleTreesDown(treeGrid, row, col) === numRows - row - 1 &&
          treeGrid[numRows - 1][col] < treeGrid[row][col])
      ) {
        numVisibleTreesFromEdge += 1;
      }
    }
  }
  return numVisibleTreesFromEdge;
}

function part2() {
  const input = getInput();
  const treeGrid: number[][] = input.map((line) =>
    line.split("").map((c) => parseInt(c))
  );

  const numRows = treeGrid.length;
  const numCols = treeGrid[0].length;
  let maxVisibleTrees = -Infinity;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (isEdge(treeGrid, row, col)) {
        // edges not considered
        continue;
      }

      const right = getNumVisibleTreesRight(treeGrid, row, col);
      const left = getNumVisibleTreesLeft(treeGrid, row, col);
      const up = getNumVisibleTreesUp(treeGrid, row, col);
      const down = getNumVisibleTreesDown(treeGrid, row, col);

      maxVisibleTrees = Math.max(maxVisibleTrees, up * left * down * right);
    }
  }
  return maxVisibleTrees;
}

function getNumVisibleTreesRight(
  treeGrid: number[][],
  row: number,
  col: number
) {
  const numCols = treeGrid[0].length;
  // 1 tree is initially visible
  let numTrees = 1;
  while (
    col + numTrees < numCols &&
    treeGrid[row][col + numTrees] < treeGrid[row][col]
  ) {
    numTrees += 1;
  }

  // Remove a visible tree if we hit out of bounds
  if (col + numTrees === numCols) {
    numTrees -= 1;
  }
  return numTrees;
}

function getNumVisibleTreesLeft(
  treeGrid: number[][],
  row: number,
  col: number
) {
  // 1 tree is initially visible
  let numTrees = 1;
  while (
    col - numTrees > -1 &&
    treeGrid[row][col - numTrees] < treeGrid[row][col]
  ) {
    numTrees += 1;
  }

  // Remove a visible tree if we hit out of bounds
  if (col - numTrees === -1) {
    numTrees -= 1;
  }
  return numTrees;
}

function getNumVisibleTreesUp(treeGrid: number[][], row: number, col: number) {
  // 1 tree is initially visible
  let numTrees = 1;
  while (
    row - numTrees > -1 &&
    treeGrid[row - numTrees][col] < treeGrid[row][col]
  ) {
    numTrees += 1;
  }

  // Remove a visible tree if we hit out of bounds
  if (row - numTrees === -1) {
    numTrees -= 1;
  }
  return numTrees;
}

function getNumVisibleTreesDown(
  treeGrid: number[][],
  row: number,
  col: number
) {
  const numRows = treeGrid.length;

  // 1 tree is initially visible
  let numTrees = 1;
  while (
    row + numTrees < numRows &&
    treeGrid[row + numTrees][col] < treeGrid[row][col]
  ) {
    numTrees += 1;
  }

  // Remove a visible tree if we hit out of bounds
  if (row + numTrees === numRows) {
    numTrees -= 1;
  }
  return numTrees;
}

function isEdge(treeGrid: number[][], row: number, col: number) {
  const numRows = treeGrid.length;
  const numCols = treeGrid[0].length;

  return row === 0 || col === 0 || col === numCols - 1 || row === numRows - 1;
}

console.log(part1());
console.log(part2());
