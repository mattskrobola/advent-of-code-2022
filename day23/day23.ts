import { readFileSync } from "fs";

interface Coordinate {
  row: number;
  col: number;
}

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  return runRounds(10);
}
function part2() {
  return runRounds(1000000);
}

function runRounds(rounds: number) {
  const input = getInput();

  // arbitrary size 500, just need enough space to fit the elves after X rounds
  const coords: Coordinate[][][] = Array.from(new Array(500), () =>
    Array.from(new Array(500), () => [])
  );
  const start = 200;
  input
    .map((line) => line.split(""))
    .forEach((r, row) => {
      r.forEach((c, col) => {
        if (c === "#") {
          coords[row + start][col + start].push({
            row: row + start,
            col: col + start,
          });
        }
      });
    });

  let direction = 0; // 0 is up 1 is down 2 is left 3 is right

  for (let i = 0; i < rounds; i++) {
    // first get elf coords
    let elves: Coordinate[] = [];
    coords.forEach((r, row) => {
      r.forEach((c, col) => {
        if (c.length === 1) {
          elves.push(c[0]);
        }
      });
    });
    // elves with no adjacent elves can't move
    elves = elves.filter((e) => hasAdjacentElves(e.row, e.col, coords));

    elves.forEach((c) => {
      const { row, col } = c;
      let dirCopy = direction;
      for (let i = 0; i < 4; i++) {
        const dest = canMoveInDirection(row, col, dirCopy, coords);
        if (dest !== undefined) {
          dest.push(c);
          break;
        }
        dirCopy++;
        if (dirCopy === 4) {
          dirCopy = 0;
        }
      }
    });

    let oneElfHasMoved = false;
    coords.forEach((row, i) => {
      row.forEach((elf, j) => {
        // If 2 elfs are in target location wipe the array
        if (elf.length > 1) {
          coords[i][j] = [];
          return;
        }

        // if 1 elf is in a target location remove its old location and update its target
        if (elf.length === 1 && (elf[0].row !== i || elf[0].col !== j)) {
          oneElfHasMoved = true;
          coords[elf[0].row][elf[0].col] = [];
          elf[0].row = i;
          elf[0].col = j;
        }
      });
    });

    direction++;
    if (direction === 4) {
      direction = 0;
    }

    // For part 2
    if (!oneElfHasMoved) {
      return i + 1;
    }
  }

  // For part 1, find the top, bottom, left, and right most elf to calculate rectangle
  let [top, bottom, left, right] = [0, 0, 0, 0];
  for (let i = 0; i < coords.length; i++) {
    const row = coords[i];
    if (row.some((c) => c.length > 0)) {
      top = i;
      break;
    }
  }
  for (let i = coords.length - 1; i > -1; i--) {
    const row = coords[i];
    if (row.some((c) => c.length > 0)) {
      bottom = i;
      break;
    }
  }
  for (let i = 0; i < coords[0].length; i++) {
    if (coords.some((r) => r[i].length > 0)) {
      left = i;
      break;
    }
  }
  for (let i = coords[0].length - 1; i > -1; i--) {
    if (coords.some((r) => r[i].length > 0)) {
      right = i;
      break;
    }
  }

  // count empty spaces within rectangle
  let count = 0;
  for (let i = top; i <= bottom; i++) {
    for (let j = left; j <= right; j++) {
      if (coords[i][j].length === 0) {
        count++;
      }
    }
  }
  return count;
}

function canMoveInDirection(
  row: number,
  col: number,
  dirCopy: number,
  coords: Coordinate[][][]
): Coordinate[] | undefined {
  const { destRow, destCol } = getDest(row, col, dirCopy);
  const [diagOneRow, diagOneCol] =
    dirCopy <= 1 ? [destRow, destCol - 1] : [destRow - 1, destCol];
  const [diagTwoRow, diagTwoCol] =
    dirCopy <= 1 ? [destRow, destCol + 1] : [destRow + 1, destCol];

  const destTarget = coords[destRow][destCol];
  const diagTargetOne = coords[diagOneRow][diagOneCol];
  const diagTargetTwo = coords[diagTwoRow][diagTwoCol];
  // Check the dest and the diag targets don't contain any eleves
  if (
    (destTarget.length === 0 ||
      destTarget[0].row !== destRow ||
      destTarget[0].col !== destCol) &&
    (diagTargetOne.length === 0 ||
      diagTargetOne[0].row !== diagOneRow ||
      diagTargetOne[0].col !== diagOneCol) &&
    (diagTargetTwo.length === 0 ||
      diagTargetTwo[0].row !== diagTwoRow ||
      diagTargetTwo[0].col !== diagTwoCol)
  ) {
    return destTarget;
  }
}

function getDest(row: number, col: number, dir: number) {
  if (dir === 0) {
    return { destRow: row - 1, destCol: col };
  } else if (dir === 1) {
    return { destRow: row + 1, destCol: col };
  } else if (dir === 2) {
    return { destRow: row, destCol: col - 1 };
  }
  return { destRow: row, destCol: col + 1 };
}

function hasAdjacentElves(row: number, col: number, coords: Coordinate[][][]) {
  return (
    coords[row - 1][col].length === 1 ||
    coords[row + 1][col].length === 1 ||
    coords[row][col - 1].length === 1 ||
    coords[row][col + 1].length === 1 ||
    coords[row - 1][col - 1].length === 1 ||
    coords[row - 1][col + 1].length === 1 ||
    coords[row + 1][col - 1].length === 1 ||
    coords[row + 1][col + 1].length === 1
  );
}

console.log(part1());
console.log(part2());
