import { readFileSync } from "fs";

function part1() {
  const input = getInput();
  const stacks = createStacks(input);
  const commands = input.slice(9);
  commands.forEach((c) => {
    const [amount, target, destination] = parseCommand(c);
    for (let i = 0; i < amount; i++) {
      const letter = stacks[target - 1].pop();
      if (letter) {
        stacks[destination - 1].push(letter);
      }
    }
  });
  return stacks.map((s) => s.pop()).join("");
}

function part2() {
  const input = getInput();
  const stacks = createStacks(input);
  const commands = input.slice(9);
  commands.forEach((c) => {
    const [amount, target, destination] = parseCommand(c);
    const movedLetters = stacks[target - 1].slice(-amount);
    stacks[target - 1] = stacks[target - 1].slice(0, -amount);
    stacks[destination - 1].push(...movedLetters);
  });
  return stacks.map((s) => s.pop()).join("");
}

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function createStacks(input: string[]) {
  const stacks: string[][] = Array.from(Array(9), () => []);
  // Start from the last row and build up
  for (let row = 8; row > -1; row--) {
    for (let col = 0; col < 9; col++) {
      const currentColPtr = col * 4;
      const letter = input[row].substring(currentColPtr, currentColPtr + 3)[1];
      if (letter !== " ") {
        stacks[col].push(letter);
      }
    }
  }
  return stacks;
}

function parseCommand(command: string): number[] {
  return command
    .substring(5)
    .replace(" from ", "-")
    .replace(" to ", "-")
    .split("-")
    .map((c) => parseInt(c));
}

console.log(part1());
console.log(part2());
