import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

interface IMonkeyMath {
  monkeyA: string;
  monkeyB: string;
  operation: string;
}

type IMonkeyValue = IMonkeyMath | number;

function part1() {
  const monkeyToValue = getMonkeyValues();
  return resolveMonkeyValue("root", monkeyToValue);
}

function part2() {
  const monkeyToValue = getMonkeyValues();

  // "root" requires lttc === pfjc
  // Manually changed this until "lttc" (the monkey that is affected by change in humn) was equal to "pfjc"
  // Checked how a change of adding/removing 1 in humn would affect lttc, then set humn based on the diff of lttc and pfjc
  monkeyToValue["humn"] = 3093175982595;

  console.log(resolveMonkeyValue("lttc", monkeyToValue));
  console.log(resolveMonkeyValue("pfjc", monkeyToValue));
}

function getMonkeyValues(): { [key: string]: IMonkeyValue } {
  const input = getInput();
  const monkeyToValue: { [key: string]: IMonkeyValue } = {};
  input.forEach((m) => {
    const monkeyData = m.split(" ");

    // name
    const monkey = monkeyData[0].slice(0, -1);
    // check if its a value or math operation
    if (isNaN(Number(monkeyData[1]))) {
      const monkeyA = monkeyData[1];
      const operation = monkeyData[2];
      const monkeyB = monkeyData[3];
      monkeyToValue[monkey] = { monkeyA, monkeyB, operation };
    } else {
      monkeyToValue[monkey] = Number(monkeyData[1]);
    }
  });
  return monkeyToValue;
}

function resolveMonkeyValue(
  monkey: string,
  monkeyToValue: { [key: string]: IMonkeyValue }
): number {
  const currentMath: IMonkeyValue = monkeyToValue[monkey];
  if (typeof currentMath === "number") {
    return currentMath;
  }
  const { monkeyA, monkeyB, operation } = currentMath;
  const monkeyAValue = resolveMonkeyValue(monkeyA, monkeyToValue);
  const monkeyBValue = resolveMonkeyValue(monkeyB, monkeyToValue);

  if (operation === "+") {
    return monkeyAValue + monkeyBValue;
  } else if (operation === "-") {
    return monkeyAValue - monkeyBValue;
  } else if (operation === "*") {
    return monkeyAValue * monkeyBValue;
  } else if (operation === "/") {
    return monkeyAValue / monkeyBValue;
  }
  return 0;
}

console.log(part1());
console.log(part2());
