import { readFileSync } from "fs";

function getCharPriority(char: string): number {
  const charCode = char.charCodeAt(0);
  // If its a capital letter or not
  return charCode <= "Z".charCodeAt(0)
    ? charCode - "A".charCodeAt(0) + 27
    : charCode - "a".charCodeAt(0) + 1;
}
function part1(): number {
  const input = readFileSync("input.txt", "utf-8").split("\n");
  let result = 0;
  input.forEach((c) => {
    const seen = new Set<string>();
    const firstHalf = c.slice(0, c.length / 2);
    for (let i = 0; i < firstHalf.length; i++) {
      seen.add(firstHalf[i]);
    }

    const secondHalf = c.slice(c.length / 2);
    for (let i = 0; i < secondHalf.length; i++) {
      if (seen.has(secondHalf[i])) {
        result += getCharPriority(secondHalf[i]);
        break;
      }
    }
  });
  return result;
}

function getElfTrios(input: string[]): string[][] {
  const elfTrios: string[][] = [];
  let count = 0;

  let tempTrio: string[] = [];
  input.forEach((c) => {
    tempTrio.push(c);
    count++;
    if (count === 3) {
      elfTrios.push(tempTrio);
      tempTrio = [];
      count = 0;
    }
  });

  return elfTrios;
}
function part2(): number {
  const input = readFileSync("input.txt", "utf-8").split("\n");
  const elfTrios = getElfTrios(input);
  let result = 0;

  elfTrios.forEach((trio) => {
    const [first, second, third] = trio;

    const seenFirst = new Set<string>(first.split("").map((c) => c));

    const seenFirstAndSecond = new Set<string>();
    for (let i = 0; i < second.length; i++) {
      if (seenFirst.has(second[i])) {
        seenFirstAndSecond.add(second[i]);
      }
    }

    for (let i = 0; i < third.length; i++) {
      if (seenFirstAndSecond.has(third[i])) {
        result += getCharPriority(third[i]);
        break;
      }
    }
  });

  return result;
}

console.log(part1());
console.log(part2());
