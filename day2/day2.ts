import { readFileSync } from "fs";

const decryptChoice: { [key: string]: string } = {
  X: "A",
  Y: "B",
  Z: "C",
};

const choiceToPoint: { [key: string]: number } = {
  A: 1,
  B: 2,
  C: 3,
};

function part1(): number {
  const input = readFileSync("input.txt", "utf-8").split("\n");
  let score = 0;
  input.forEach((pair) => {
    const [elfChoice, myChoice] = pair.split(" ");
    if (!elfChoice || !myChoice) {
      return;
    }
    // decrypt choice
    const myChoiceDecrypted = decryptChoice[myChoice];
    score += choiceToPoint[myChoiceDecrypted];
    if (elfChoice === myChoiceDecrypted) {
      // tie
      score += 3;
    } else if (
      (myChoiceDecrypted === "A" && elfChoice === "C") ||
      (myChoiceDecrypted === "B" && elfChoice === "A") ||
      (myChoiceDecrypted === "C" && elfChoice === "B")
    ) {
      // win
      score += 6;
    }
  });
  return score;
}

const decryptToScore: { [key: string]: number } = {
  X: 0,
  Y: 3,
  Z: 6,
};

function part2(): number {
  const input = readFileSync("input.txt", "utf-8").split("\n");
  let score = 0;
  input.forEach((pair) => {
    const [elfChoice, myChoice] = pair.split(" ");
    if (!elfChoice || !myChoice) {
      return;
    }
    score += decryptToScore[myChoice];
    if (myChoice === "Y") {
      score += choiceToPoint[elfChoice];
    } else if (myChoice === "X") {
      if (elfChoice === "A") {
        score += 3;
      } else if (elfChoice === "B") {
        score += 1;
      } else {
        score += 2;
      }
    } else {
      if (elfChoice === "A") {
        score += 2;
      } else if (elfChoice === "B") {
        score += 3;
      } else {
        score += 1;
      }
    }
  });
  return score;
}

console.log(part1());
console.log(part2());
