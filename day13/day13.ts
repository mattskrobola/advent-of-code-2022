import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  let result = 0;

  for (let i = 0; i < input.length; i += 2) {
    const [listA, listB] = [input[i], input[i + 1]];
    if (isEqual(JSON.parse(listA), JSON.parse(listB)) >= 0) {
      result += i / 2 + 1;
    }
  }
  return result;
}

function part2() {
  const [dividerA, dividerB] = ["[[2]]", "[[6]]"];
  const packets = [...getInput(), dividerA, dividerB].map((c) => JSON.parse(c));
  packets.sort(isEqual);
  let [dividerAIdx, dividerBIdx] = [1, 1];

  packets.reverse().forEach((c, idx) => {
    if (JSON.stringify(c) === dividerA) {
      dividerAIdx = idx + 1;
    } else if (JSON.stringify(c) === dividerB) {
      dividerBIdx = idx + 1;
    }
  });
  return dividerAIdx * dividerBIdx;
}

type IListOrNumber = IListOrNumber[] | number;

function isEqual(a: IListOrNumber, b: IListOrNumber): number {
  if (typeof a === "number" && typeof b === "number") {
    if (a === b) {
      return 0;
    } else if (a < b) {
      return 1;
    }
    return -1;
  }
  if (typeof a === "number") {
    a = [a];
  }
  if (typeof b === "number") {
    b = [b];
  }

  let i = 0;
  while (i < a.length && i < b.length) {
    const equal = isEqual(a[i], b[i]);
    if (equal === 1) {
      return 1;
    } else if (equal === -1) {
      return -1;
    }
    i += 1;
  }

  if (i === a.length) {
    if (a.length === b.length) {
      return 0;
    }
    return 1;
  }
  return -1;
}

console.log(part1());
console.log(part2());
