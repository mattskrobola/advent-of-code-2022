import { readFileSync } from "fs";

function part1() {
  return getMarkerPosition(4);
}

function part2() {
  return getMarkerPosition(14);
}

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function getMarkerPosition(distinctCharacters: number) {
  const code = getInput()[0];

  let ptr = distinctCharacters;
  while (ptr < code.length) {
    if (hasNoDuplicates(code, ptr, distinctCharacters)) {
      return ptr;
    }
    ptr++;
  }
  return 0;
}

function hasNoDuplicates(
  code: string,
  ptr: number,
  distinctCharacters: number
) {
  const seen = new Set<string>();
  for (let i = ptr - distinctCharacters; i < ptr; i++) {
    if (seen.has(code[i])) {
      return false;
    }
    seen.add(code[i]);
  }
  return true;
}

console.log(part1());
console.log(part2());
