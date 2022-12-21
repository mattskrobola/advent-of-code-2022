import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  return 1;
}

function part2() {
  const input = getInput();
  return 1;
}

console.log(part1());
console.log(part2());
