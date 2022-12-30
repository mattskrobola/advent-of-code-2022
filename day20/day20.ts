import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  let numbers = input.map((line) => [parseInt(line)]);

  return mix(numbers, 1);
}

function part2() {
  const input = getInput();
  let numbers = input.map((line) => [parseInt(line) * 811589153]);

  return mix(numbers, 10);
}

function mix(encrypted: number[][], mixes: number) {
  // Use a nested array to handle indexOf since the input can have duplicate numbers
  let decrypted = [...encrypted];
  for (let i = 0; i < mixes; i++) {
    encrypted.forEach((n) => {
      const i = decrypted.indexOf(n);
      decrypted.splice(i, 1);
      decrypted.splice((i + n[0]) % decrypted.length, 0, n);
    });
  }

  let result = 0;
  const flatDecrypted = decrypted.flat();

  let ptr = flatDecrypted.indexOf(0);
  for (let i = 0; i < 3000 + 1; i++) {
    if (i === 1000 || i === 2000 || i === 3000) {
      result += flatDecrypted[ptr];
    }
    ptr++;
    if (ptr >= flatDecrypted.length) {
      ptr = 0;
    }
  }

  return result;
}

console.log(part1());
console.log(part2());
