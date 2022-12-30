import { readFileSync } from "fs";

interface ICoordiate {
  row: number;
  col: number;
}
type Direction = "up" | "down" | "left" | "right";
type IFace = "One" | "Two" | "Three" | "Four" | "Five" | "Six";

const directionToValue: { [direction: string]: number } = {
  right: 0,
  down: 1,
  left: 2,
  up: 3,
};

const FACE_SIZE = 50;

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const { grid, commands } = createGrid();
  let facing = "right" as Direction;
  let location: ICoordiate = {
    row: 0,
    col: Math.min(grid[0].indexOf("."), grid[0].indexOf("#")),
  };

  let ptr = 0;

  while (true) {
    const { updatedPtr, amount, turnDirection } = getNextCommand(commands, ptr);
    ptr = updatedPtr;

    location = move(location, facing, amount, grid);

    if (turnDirection !== "L" && turnDirection !== "R") {
      break;
    }
    facing = getNewFacing(facing, turnDirection);
  }
  return (
    1000 * (location.row + 1) +
    4 * (location.col + 1) +
    directionToValue[facing]
  );
}

function part2() {
  const input = getInput();
  const { rowtoWallLocations, commands } = createCube();

  let location = {
    col: Math.min(input[0].indexOf("."), input[0].indexOf("#")),
    row: 0,
  };
  let direction: Direction = "right";
  let ptr = 0;
  while (true) {
    const { updatedPtr, amount, turnDirection } = getNextCommand(commands, ptr);
    ptr = updatedPtr;

    [location, direction] = moveCube(
      location,
      direction,
      amount,
      rowtoWallLocations
    );

    // no more commands
    if (turnDirection !== "L" && turnDirection !== "R") {
      break;
    }
    direction = getNewFacing(direction, turnDirection);
  }

  return (
    1000 * (location.row + 1) +
    4 * (location.col + 1) +
    directionToValue[direction]
  );
}

function createGrid(): { grid: string[][]; commands: string } {
  const input = getInput();
  const grid: string[][] = [];
  let commands = "";
  input.forEach((line) => {
    if (line.indexOf("R") !== -1 || line.indexOf("L") !== -1) {
      commands = line;
    } else {
      grid.push(line.split(""));
    }
  });
  return { grid, commands };
}

function getNextCommand(
  command: string,
  ptr: number
): {
  amount: number;
  turnDirection: string; // "R" or "L"
  updatedPtr: number;
} {
  let number = "";
  if (ptr >= command.length) {
    return { amount: 0, turnDirection: "", updatedPtr: ptr };
  }
  while (!isNaN(Number(command[ptr]))) {
    number += command[ptr];
    ptr++;
  }
  const turnDirection = command[ptr];
  ptr++;
  return { amount: Number(number), turnDirection, updatedPtr: ptr };
}

function getFirstNonEmptySpace(
  grid: string[][],
  position: ICoordiate,
  direction: Direction
): ICoordiate {
  let { row, col } = position;
  while (grid[row][col] === " ") {
    switch (direction) {
      case "up":
        row--;
        break;
      case "down":
        row++;
        break;
      case "left":
        col--;
        break;
      case "right":
        col++;
        break;
    }
  }
  return { row, col };
}

function move(
  position: ICoordiate,
  facing: Direction,
  amount: number,
  grid: string[][]
): ICoordiate {
  amount++;
  const rows = grid.length;
  let { row, col } = position;

  switch (facing) {
    case "up":
      while (--amount) {
        if (row - 1 <= -1 || grid[row - 1][col] === " ") {
          const { row: newRow } = getFirstNonEmptySpace(
            grid,
            { row: grid.length - 1, col },
            "up"
          );
          // wrap isn't possible
          if (grid[newRow][col] === "#") {
            return { row, col };
          }
          row = newRow;
        } else if (grid[row - 1][col] === "#") {
          return { row, col };
        } else {
          row--;
        }
      }
      break;
    case "down":
      while (--amount) {
        if (row + 1 >= rows || grid[row + 1][col] === " ") {
          const { row: newRow } = getFirstNonEmptySpace(
            grid,
            { row: 0, col },
            "down"
          );
          // wrap isn't possible
          if (grid[newRow][col] === "#") {
            return { row, col };
          }
          row = newRow;
        } else if (grid[row + 1][col] === "#") {
          return { row, col };
        } else {
          row++;
        }
      }
      break;
    case "left":
      while (--amount) {
        if (col - 1 <= -1 || grid[row][col - 1] === " ") {
          const { col: newCol } = getFirstNonEmptySpace(
            grid,
            { row, col: grid[row].length - 1 },
            "left"
          );
          // wrap isn't possible
          if (grid[row][newCol] === "#") {
            return { row, col };
          }
          col = newCol;
        } else if (grid[row][col - 1] === "#") {
          return { row, col };
        } else {
          col--;
        }
      }
      break;
    case "right":
      while (--amount) {
        if (col + 1 >= grid[row].length || grid[row][col + 1] === " ") {
          const { col: newCol } = getFirstNonEmptySpace(
            grid,
            { row, col: 0 },
            "right"
          );
          // wrap isn't possible
          if (grid[row][newCol] === "#") {
            return { row, col };
          }
          col = newCol;
        } else if (grid[row][col + 1] === "#") {
          return { row, col };
        } else {
          col++;
        }
      }
      break;
  }
  return { row, col };
}

function getNewFacing(facing: Direction, direction: string): Direction {
  switch (facing) {
    case "up":
      return direction === "L" ? "left" : "right";
    case "down":
      return direction === "L" ? "right" : "left";
    case "left":
      return direction === "L" ? "down" : "up";
    case "right":
      return direction === "L" ? "up" : "down";
  }
}

// cube / part 2 specific functions

function createCube(): {
  rowtoWallLocations: Map<number, number[]>;
  commands: string;
} {
  const rowtoWallLocations = new Map<number, number[]>();
  const input = getInput();
  let commands = "";
  input.forEach((line, idx) => {
    if (line.indexOf("R") !== -1 || line.indexOf("L") !== -1) {
      commands = line;
    } else {
      let startIndex = 0;
      let indexOfWall = -1;
      const wallPositions: number[] = [];
      while (true) {
        indexOfWall = line.indexOf("#", startIndex);
        if (indexOfWall > -1) {
          wallPositions.push(indexOfWall);
          startIndex = indexOfWall + 1;
        } else {
          break;
        }
      }
      rowtoWallLocations.set(idx, wallPositions);
    }
  });
  return { rowtoWallLocations, commands };
}

function getCubeFace(location: ICoordiate): IFace | undefined {
  const cubeHeight = Math.floor(location.row / FACE_SIZE);
  const cubeWidth = Math.floor(location.col / FACE_SIZE);

  if (cubeHeight === 0 && cubeWidth === 1) {
    return "One";
  } else if (cubeHeight === 0 && cubeWidth === 2) {
    return "Two";
  } else if (cubeHeight === 1 && cubeWidth === 1) {
    return "Three";
  } else if (cubeHeight === 2 && cubeWidth === 0) {
    return "Four";
  } else if (cubeHeight === 2 && cubeWidth === 1) {
    return "Five";
  } else if (cubeHeight === 3 && cubeWidth === 0) {
    return "Six";
  }
}

// starting row
const topRowOne = 0;
const topRowTwo = 0;
const topRowFour = FACE_SIZE * 2;
// ending row
const bottomRowTwo = FACE_SIZE - 1;
const bottomRowFive = FACE_SIZE * 3 - 1;
const bottomRowSix = FACE_SIZE * 4 - 1;
// starting col
const leftOfOne = FACE_SIZE;
const leftOfThree = FACE_SIZE;
const leftOfFour = 0;
const leftOfSix = 0;
// ending col
const rightOfTwo = FACE_SIZE * 3 - 1;
const rightOfThree = FACE_SIZE * 2 - 1;
const rightOfFive = FACE_SIZE * 2 - 1;
const rightOfSix = FACE_SIZE - 1;

const isOnBoundary = (location: ICoordiate, dir: Direction) => {
  if (dir === "left" && location.col % FACE_SIZE === 0) {
    return true;
  } else if (dir === "right" && location.col % FACE_SIZE === FACE_SIZE - 1) {
    return true;
  } else if (dir === "up" && location.row % FACE_SIZE === 0) {
    return true;
  } else if (dir === "down" && location.row % FACE_SIZE === FACE_SIZE - 1) {
    return true;
  }
  return false;
};

const getNewCoord = (offset: number, cubeOffset: number, reverse: boolean) => {
  if (!reverse) {
    return FACE_SIZE * cubeOffset + offset;
  } else {
    return FACE_SIZE * cubeOffset + (FACE_SIZE - offset - 1);
  }
};

const moveUp = (location: ICoordiate): [ICoordiate, Direction] => {
  let col = location.col;
  let row = location.row;
  let dir: Direction = "up";

  if (isOnBoundary(location, dir)) {
    const xOffset = location.col % FACE_SIZE;
    switch (getCubeFace(location)) {
      case "One": {
        return [
          { col: leftOfSix, row: getNewCoord(xOffset, 3, false) },
          "right",
        ];
      }
      case "Two": {
        return [
          { col: getNewCoord(xOffset, 0, false), row: bottomRowSix },
          "up",
        ];
      }
      case "Four": {
        return [
          { col: leftOfThree, row: getNewCoord(xOffset, 1, false) },
          "right",
        ];
      }
      default: {
        return [{ col: col, row: row - 1 }, dir];
      }
    }
  } else {
    return [{ col: col, row: row - 1 }, dir];
  }
};

const moveRight = (location: ICoordiate): [ICoordiate, Direction] => {
  let col = location.col;
  let row = location.row;
  let dir: Direction = "right";

  if (isOnBoundary(location, dir)) {
    const xOffset = location.col % FACE_SIZE;
    const yOffset = location.row % FACE_SIZE;
    switch (getCubeFace(location)) {
      case "Two": {
        return [
          { col: rightOfFive, row: getNewCoord(yOffset, 2, true) },
          "left",
        ];
      }
      case "Three": {
        return [
          { col: getNewCoord(yOffset, 2, false), row: bottomRowTwo },
          "up",
        ];
      }
      case "Five": {
        return [
          { col: rightOfTwo, row: getNewCoord(yOffset, 0, true) },
          "left",
        ];
      }
      case "Six": {
        return [
          { col: getNewCoord(yOffset, 1, false), row: bottomRowFive },
          "up",
        ];
      }
      default: {
        return [{ col: col + 1, row: row }, dir];
      }
    }
  } else {
    return [{ col: col + 1, row: row }, dir];
  }
};

const moveDown = (location: ICoordiate): [ICoordiate, Direction] => {
  let col = location.col;
  let row = location.row;

  let dir: Direction = "down";

  if (isOnBoundary(location, dir)) {
    const xOffset = location.col % FACE_SIZE;
    switch (getCubeFace(location)) {
      case "Two": {
        return [
          { col: rightOfThree, row: getNewCoord(xOffset, 1, false) },
          "left",
        ];
      }
      case "Five": {
        return [
          { col: rightOfSix, row: getNewCoord(xOffset, 3, false) },
          "left",
        ];
      }
      case "Six": {
        return [
          { col: getNewCoord(xOffset, 2, false), row: topRowTwo },
          "down",
        ];
      }
      default: {
        return [{ col: col, row: row + 1 }, dir];
      }
    }
  } else {
    return [{ col: col, row: row + 1 }, dir];
  }
};

const moveLeft = (location: ICoordiate): [ICoordiate, Direction] => {
  let col = location.col;
  let row = location.row;
  let dir: Direction = "left";

  if (isOnBoundary(location, dir)) {
    const xOffset = location.col % FACE_SIZE;
    const yOffset = location.row % FACE_SIZE;
    switch (getCubeFace(location)) {
      case "One": {
        return [
          { col: leftOfFour, row: getNewCoord(yOffset, 2, true) },
          "right",
        ];
      }
      case "Three": {
        return [
          { col: getNewCoord(yOffset, 0, false), row: topRowFour },
          "down",
        ];
      }
      case "Four": {
        return [
          { col: leftOfOne, row: getNewCoord(yOffset, 0, true) },
          "right",
        ];
      }
      case "Six": {
        return [
          { col: getNewCoord(yOffset, 1, false), row: topRowOne },
          "down",
        ];
      }
      default: {
        return [{ col: col - 1, row: row }, dir];
      }
    }
  } else {
    return [{ col: col - 1, row: row }, dir];
  }
};

const moveCube = (
  location: ICoordiate,
  dir: Direction,
  amount: number,
  rowtoWallLocations: Map<number, number[]>
): [ICoordiate, Direction] => {
  let newLocation = { ...location };
  let newDir: Direction = dir;
  for (let i = 0; i < amount; i++) {
    switch (dir) {
      case "up":
        [newLocation, newDir] = moveUp(location);
        break;
      case "right":
        [newLocation, newDir] = moveRight(location);
        break;
      case "down":
        [newLocation, newDir] = moveDown(location);
        break;
      case "left":
        [newLocation, newDir] = moveLeft(location);
        break;
    }

    if (!rowtoWallLocations.get(newLocation.row)!.includes(newLocation.col)) {
      location = newLocation;
      dir = newDir;
    } else {
      // hit wall
      break;
    }
  }

  return [location, dir];
};

console.log(part1());
console.log(part2());
