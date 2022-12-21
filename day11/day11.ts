import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}
interface IMonkey {
  items: number[];
  inspectOperation: string;
  inspectOperationValue: number;
  divisibleByTest: number;
  monkeyIfTrue: number;
  monkeyIfFalse: number;
  inspected: number;
}
const NUM_MONKEYS = 8;

function part1() {
  const monkeys = getInitialMonkeyData();

  const inspectFunction = (score: number) => {
    return Math.floor(score / 3);
  };
  return runRoundsAndGetResult(monkeys, 20, inspectFunction);
}

function part2() {
  const monkeys = getInitialMonkeyData();

  let LCM = 1;
  Array.from(monkeys.values()).forEach((m) => {
    LCM *= m.divisibleByTest;
  });

  // mod LCM to keep the score from getting too large and at the same time not affecting the round
  const inspectFunction = (score: number) => {
    return score % LCM;
  };

  return runRoundsAndGetResult(monkeys, 10000, inspectFunction);
}

function runRoundsAndGetResult(
  monkeys: Map<number, IMonkey>,
  rounds: number,
  inspectFunction: (score: number) => number
): number {
  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < NUM_MONKEYS; j++) {
      const monkey = monkeys.get(j);

      if (!monkey) {
        continue;
      }

      monkey.items.forEach((item) => {
        monkey.inspected += 1;
        let newItem = item;

        if (monkey.inspectOperation === "*") {
          // special case monkey 3 which multiplies itself
          newItem *= j === 3 ? newItem : monkey.inspectOperationValue;
        } else {
          newItem += monkey.inspectOperationValue;
        }

        newItem = inspectFunction(newItem);

        if (newItem % monkey.divisibleByTest === 0) {
          monkeys.get(monkey.monkeyIfTrue)?.items.push(newItem);
        } else {
          monkeys.get(monkey.monkeyIfFalse)?.items.push(newItem);
        }
      });
      monkey.items = [];
    }
  }

  // get top 2 inspected
  let max = 0;
  let max2 = 0;
  Array.from(monkeys.values()).forEach(({ inspected }) => {
    if (inspected > max) {
      max2 = max;
      max = inspected;
    } else if (inspected > max2) {
      max2 = inspected;
    }
  });
  return max * max2;
}

function getInitialMonkeyData(): Map<number, IMonkey> {
  const input = getInput();
  const monkeys = new Map<number, IMonkey>();

  for (let i = 0; i < NUM_MONKEYS; i++) {
    // each monkey has 6 lines of metadata
    const inputPtr = i * 6;

    const items = input[inputPtr + 1]
      .substring(input[inputPtr + 1].indexOf(":") + 1)
      .split(", ")
      .map((n) => Number(n));

    const [inspectOperation, inspectOperationValue] = input[inputPtr + 2]
      .substring(input[inputPtr + 2].indexOf("old") + 4)
      .split(" ");

    const divisibleByTest = Number(
      input[inputPtr + 3].substring(input[inputPtr + 3].indexOf("by") + 2)
    );

    const monkeyIfTrue = Number(
      input[inputPtr + 4].charAt(input[inputPtr + 4].length - 1)
    );
    const monkeyIfFalse = Number(
      input[inputPtr + 5].charAt(input[inputPtr + 5].length - 1)
    );

    monkeys.set(i, {
      items,
      inspectOperation,
      inspectOperationValue: Number(inspectOperationValue),
      divisibleByTest,
      monkeyIfTrue,
      monkeyIfFalse,
      inspected: 0,
    });
  }
  return monkeys;
}

console.log(part1());
console.log(part2());
