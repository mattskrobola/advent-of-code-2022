import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

interface ICoord {
  row: number;
  col: number;
}

function moveHead(oldHead: ICoord, dir: string, amount: number) {
  const head = { ...oldHead };
  if (dir === "R") {
    head.col += amount;
  } else if (dir === "L") {
    head.col -= amount;
  } else if (dir === "U") {
    head.row -= amount;
  } else if (dir === "D") {
    head.row += amount;
  }
  return head;
}

function part1() {
  const input = getInput();
  const grid: number[][] = Array.from(new Array(1000), () =>
    new Array(1000).fill(0)
  );
  let head: ICoord = { row: 500, col: 500 };
  let tail: ICoord = { row: 500, col: 500 };
  grid[500][500] = 1;

  input.forEach((line) => {
    const [dir, amount] = line.split(" ");
    head = moveHead(head, dir, parseInt(amount));

    while (!isTouching(tail, head)) {
      tail = moveTail(tail, head);
      grid[tail.row][tail.col] = 1;
    }
  });

  return getVisitedCount(grid);
}

function part2() {
  const input = getInput();
  const grid: number[][] = Array.from(new Array(1000), () =>
    new Array(1000).fill(0)
  );
  let head: ICoord = { row: 500, col: 500 };
  const tails: ICoord[] = Array.from(new Array(9), () => ({
    row: 500,
    col: 500,
  }));
  grid[500][500] = 1;

  input.forEach((line) => {
    const [dir, amount] = line.split(" ");
    head = moveHead(head, dir, parseInt(amount));

    while (!isTouching(tails[0], head)) {
      let prevTail = head;
      for (let i = 0; i < 9; i++) {
        let curTail = tails[i];
        if (!isTouching(curTail, prevTail)) {
          curTail = moveTail(curTail, prevTail);
          if (i === 8) {
            grid[curTail.row][curTail.col] = 1;
          }
          tails[i] = curTail;
        }
        prevTail = curTail;
      }
    }
  });
  return getVisitedCount(grid);
}

function getVisitedCount(grid: number[][]) {
  let result = 0;
  grid.forEach((cell) => {
    cell.forEach((value) => {
      // value is 1 if visited
      result += value;
    });
  });
  return result;
}

function isTouching(tail: ICoord, head: ICoord): boolean {
  if (tail.row === head.row) {
    return (
      tail.col === head.col ||
      tail.col - 1 === head.col ||
      tail.col + 1 === head.col
    );
  } else if (tail.col === head.col) {
    return (
      tail.row === head.row ||
      tail.row - 1 === head.row ||
      tail.row + 1 === head.row
    );
  }
  return (
    (tail.row + 1 === head.row && tail.col + 1 === head.col) ||
    (tail.row - 1 === head.row && tail.col - 1 === head.col) ||
    (tail.row - 1 === head.row && tail.col + 1 === head.col) ||
    (tail.row + 1 === head.row && tail.col - 1 === head.col)
  );
}

function moveTail(oldTail: ICoord, head: ICoord) {
  const tail = { ...oldTail };
  if (tail.row === head.row) {
    if (tail.col < head.col) {
      tail.col++;
    } else {
      tail.col--;
    }
  } else if (tail.col === head.col) {
    if (tail.row < head.row) {
      tail.row++;
    } else {
      tail.row--;
    }
  } else {
    if (tail.row < head.row) {
      tail.row++;
    } else {
      tail.row--;
    }
    if (tail.col < head.col) {
      tail.col++;
    } else {
      tail.col--;
    }
  }
  return tail;
}

console.log(part1());
console.log(part2());
