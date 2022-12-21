import { readFileSync } from "fs";

function part1(): number {
  const input = readFileSync("input.txt", "utf-8").split("\n");

  let maxCalories = 0;
  let currentElfCalories = 0;
  input.forEach((c) => {
    const calories = parseInt(c);
    // if space is NaN - create new elf
    if (Number.isNaN(calories)) {
      maxCalories = Math.max(maxCalories, currentElfCalories);
      currentElfCalories = 0;
    } else {
      currentElfCalories += calories;
    }
  });
  return maxCalories;
}

function part2(): number {
  const input = readFileSync("input.txt", "utf-8").split("\n");

  let maxCalories = [0, 0, 0];
  let currentElfCalories = 0;
  input.forEach((c) => {
    const calories = parseInt(c);
    // if space is NaN - create new elf
    if (Number.isNaN(calories)) {
      maxCalories = maybeAddToMaxArray(currentElfCalories, maxCalories);
      currentElfCalories = 0;
    } else {
      currentElfCalories += calories;
    }
  });
  return maxCalories[0] + maxCalories[1] + maxCalories[2];
}

function maybeAddToMaxArray(value: number, maxArr: number[]): number[] {
  if (value > maxArr[0]) {
    return [value, maxArr[0], maxArr[1]];
  } else if (value > maxArr[1]) {
    return [maxArr[0], value, maxArr[1]];
  } else if (value > maxArr[2]) {
    return [maxArr[0], maxArr[1], value];
  }
  return maxArr;
}

console.log(part1());
console.log(part2());
