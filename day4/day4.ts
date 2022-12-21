import { readFileSync } from "fs";

function getPairs() {
  const input = readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
  return input.map((c) =>
    c.split(",").map((n) => n.split("-").map((a) => parseInt(a)))
  );
}

function part1(): number {
  const pairs = getPairs();
  let result = 0;
  pairs.forEach((pair) => {
    const [first, second] = pair;
    if (first[0] <= second[0] && first[1] >= second[1]) {
      result++;
    } else if (second[0] <= first[0] && second[1] >= first[1]) {
      result++;
    }
  });
  return result;
}

function part2(): number {
  const pairs = getPairs();
  let result = 0;
  pairs.forEach((pair) => {
    const [first, second] = pair;
    if (first[0] <= second[0] && first[1] >= second[0]) {
      result++;
    } else if (second[0] <= first[0] && second[1] >= first[0]) {
      result++;
    }
  });
  return result;
}

console.log(part1());
console.log(part2());
