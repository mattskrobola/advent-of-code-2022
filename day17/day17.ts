import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  return dropRocks(2022).floor;
}

function part2() {
  // for every 1715 rocks, the floor increases by 2574
  // use the commented out console log to find these numbers based on the input
  const ROCK_DIFF = 1715;
  const FLOOR_DIFF = 2574;
  // Rock where the pattern starts
  const STARTING_ROCK = 1723;
  // the floor at rock STARTING_ROCK
  const STARTING_FLOOR = 2605;

  const { rockToFloor } = dropRocks(STARTING_ROCK + ROCK_DIFF);

  let rock = STARTING_ROCK;
  let floor = STARTING_FLOOR;
  while (rock + ROCK_DIFF < 1000000000000) {
    floor += FLOOR_DIFF;
    rock += ROCK_DIFF;
  }
  // The pattern starts at
  const remainingRocks = 1000000000000 - rock;
  // The pattern starts at STARTING_ROCK so add it to the remaining rocks to get the index
  // Also remove the starting floor which is the floor at the start of the pattern
  const floorDiff =
    rockToFloor[remainingRocks + STARTING_ROCK] - STARTING_FLOOR;
  return floor + floorDiff;
}

interface IDropRockResult {
  floor: number;
  rockToFloor: { [key: number]: number };
}
function dropRocks(numRocks: number): IDropRockResult {
  let rockToFloor: { [key: number]: number } = {};
  const input = getInput()[0];

  // floor
  const grid: string[][] = [["#", "#", "#", "#", "#", "#", "#"]];
  let ptr = 0;
  let rock = 0;

  for (let i = 1; i <= numRocks; i++) {
    let floor = getFirstIndexWithBlock(grid);

    grid.push(Array(7).fill("."));
    grid.push(Array(7).fill("."));
    grid.push(Array(7).fill("."));
    grid.push(Array(7).fill("."));

    let coords = getRockCoords(rock, floor);
    rock++;
    if (rock > 4) {
      rock = 0;
    }

    // push left/right then fall;
    while (true) {
      if (input[ptr] === "<") {
        if (canMoveLeft(coords, grid)) {
          coords.forEach((c) => {
            c.col--;
          });
        }
      } else {
        if (canMoveRight(coords, grid)) {
          coords.forEach((c) => {
            c.col++;
          });
        }
      }
      ptr++;
      if (ptr >= input.length) {
        // Use this to find how a change in rock affects the floor for part 2
        // console.log("rock: ", i - 1, " floor", floor);
        ptr = 0;
      }
      if (canMoveDown(coords, grid)) {
        coords.forEach((c) => {
          c.row--;
        });
      } else {
        break;
      }
    }
    coords.forEach((c) => {
      grid[c.row][c.col] = "#";
    });

    rockToFloor[i] = getFirstIndexWithBlock(grid);
  }
  return { floor: getFirstIndexWithBlock(grid), rockToFloor };
}

function getFirstIndexWithBlock(grid: string[][]) {
  for (let i = grid.length - 1; i > 0; i--) {
    if (grid[i].includes("#")) {
      return i;
    }
  }
  return 0;
}

interface ICoordinate {
  row: number;
  col: number;
}

function canMoveDown(coords: ICoordinate[], grid: string[][]) {
  return coords.every((c) => grid[c.row - 1][c.col] === ".");
}

function canMoveLeft(coords: ICoordinate[], grid: string[][]) {
  return coords.every((c) => c.col > 0 && grid[c.row][c.col - 1] === ".");
}

function canMoveRight(coords: ICoordinate[], grid: string[][]) {
  return coords.every(
    (c) => c.col + 1 < grid[0].length && grid[c.row][c.col + 1] === "."
  );
}

function printGrid(grid: string[][]) {
  for (let i = grid.length - 1; i > 0; i--) {
    console.log(grid[i].join(""));
  }
}

function getRockCoords(rock: number, floor: number): ICoordinate[] {
  if (rock === 0) {
    return [
      { row: floor + 4, col: 2 },
      { row: floor + 4, col: 3 },
      { row: floor + 4, col: 4 },
      { row: floor + 4, col: 5 },
    ];
  } else if (rock === 1) {
    return [
      { row: floor + 6, col: 3 },
      { row: floor + 5, col: 2 },
      { row: floor + 5, col: 3 },
      { row: floor + 5, col: 4 },
      { row: floor + 4, col: 3 },
    ];
  } else if (rock === 2) {
    return [
      { row: floor + 6, col: 4 },
      { row: floor + 5, col: 4 },
      { row: floor + 4, col: 4 },
      { row: floor + 4, col: 3 },
      { row: floor + 4, col: 2 },
    ];
  } else if (rock === 3) {
    return [
      { row: floor + 7, col: 2 },
      { row: floor + 6, col: 2 },
      { row: floor + 5, col: 2 },
      { row: floor + 4, col: 2 },
    ];
  } else if (rock === 4) {
    return [
      { row: floor + 5, col: 2 },
      { row: floor + 5, col: 3 },
      { row: floor + 4, col: 2 },
      { row: floor + 4, col: 3 },
    ];
  }
  return [];
}

console.log(part1());
console.log(part2());
