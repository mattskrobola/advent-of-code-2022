import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function getValue(value: string): number {
  let result = 0;
  let multiplier = 1;
  for (let i = value.length - 1; i > -1; i--) {
    if (value[i] === "1") {
      result += multiplier;
    } else if (value[i] === "-") {
      result += multiplier * -1;
    } else if (value[i] === "=") {
      result += multiplier * -2;
    } else if (value[i] === "2") {
      result += multiplier * 2;
    }
    multiplier *= 5;
  }
  return result;
}

function sumOfPows(power: number) {
  let result = 0;
  for (let i = 0; i < power + 1; i++) {
    result += Math.pow(5, i) * 2;
  }
  return result;
}

function decryptValue(value: number): string {
  let power = 1;
  while (Math.pow(5, power) * 2 < value) {
    power++;
  }

  let result = "";
  let copy = 0;
  if (value > Math.pow(5, power)) {
    result += "2";
    copy = Math.pow(5, power) * 2 - value;
  } else {
    result += "1";
    copy = Math.pow(5, power) - value;
  }
  power--;

  while (power >= 0) {
    if (copy > 0) {
      if (copy > Math.pow(5, power) + sumOfPows(power - 1)) {
        copy -= Math.pow(5, power) * 2;
        result += "=";
      } else if (copy > sumOfPows(power - 1)) {
        copy -= Math.pow(5, power);
        result += "-";
      } else {
        result += "0";
      }
    } else {
      if (Math.abs(copy) > Math.pow(5, power) + sumOfPows(power - 1)) {
        copy += Math.pow(5, power) * 2;
        result += "2";
      } else if (Math.abs(copy) > sumOfPows(power - 1)) {
        copy += Math.pow(5, power);
        result += "1";
      } else {
        result += "0";
      }
    }
    power--;
  }

  return result;
}

function part1() {
  const input = getInput();
  let result = 0;
  input.forEach((v) => {
    result += getValue(v);
  });
  return decryptValue(result);
}

console.log(part1());
