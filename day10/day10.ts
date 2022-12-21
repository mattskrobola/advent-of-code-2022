import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  let result = 0;
  let X = 1;
  let cycle = 0;
  for (let i = 0; i < input.length; i++) {
    const command = input[i].split(" ");

    cycle += 1;
    if (shouldAddToResult(cycle)) {
      result += X * cycle;
    }

    if (command[0] === "addx") {
      // add takes 2 cycles so add another cycle before updating X
      cycle += 1;
      if (shouldAddToResult(cycle)) {
        result += X * cycle;
      }
      X += Number(command[1]);
    }
  }

  return result;
}

function shouldAddToResult(cycle: number) {
  return (
    cycle === 20 ||
    cycle === 60 ||
    cycle === 100 ||
    cycle === 140 ||
    cycle === 180 ||
    cycle === 220
  );
}

function part2() {
  const input = getInput();
  const rows: string[][] = Array.from(new Array(8), () => []);

  let spritePtr = 0;
  let cycle = 0;
  for (let i = 0; i < input.length; i++) {
    const command = input[i].split(" ");

    rows[getRow(cycle)].push(getPixel(spritePtr, cycle));
    cycle += 1;

    if (command[0] === "addx") {
      rows[getRow(cycle)].push(getPixel(spritePtr, cycle));
      cycle += 1;
      spritePtr += Number(command[1]);
    }
  }

  return rows.map((row) => row.join("")).join("\n");
}

function getRow(num: number) {
  // each row has 40 cycles
  return Math.floor(num / 40);
}

function getPixel(spritePtr: number, cycle: number) {
  const ptr = spritePtr + getRow(cycle) * 40;
  // if the cycle is in the range of the sprite, then write a hash
  if (ptr <= cycle && cycle <= ptr + 2) {
    return "#";
  }
  return ".";
}

console.log(part1());
console.log(part2());
