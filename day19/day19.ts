import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function part1() {
  const input = getInput();
  let result = 0;
  input.forEach((line, i) => {
    const robotCosts = getBlueprintCosts(line);

    console.log("finding max for blueprint", i + 1, robotCosts);

    const maxGeodes = getMaxGeodes({
      resources: defaultResourceCount,
      robots: { ...defaultResourceCount, ore: 1 },
      minute: 0,
      robotCosts,
      minutes: 24,
    });
    console.log(maxGeodes);
    result += (i + 1) * maxGeodes;
  });

  return result;
}

function part2() {
  const input = getInput().slice(0, 3);

  let result = 1;
  input.forEach((line, i) => {
    const robotCosts = getBlueprintCosts(line);
    console.log("finding max for blueprint", i + 1, robotCosts);
    const maxGeodes = getMaxGeodes({
      resources: defaultResourceCount,
      robots: { ...defaultResourceCount, ore: 1 },
      minute: 0,
      robotCosts,
      minutes: 32,
      memo: Array(32).fill(undefined),
    });
    console.log(maxGeodes);
    result *= maxGeodes;
  });

  return result;
}

interface IResourceCount {
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
}
const defaultResourceCount: IResourceCount = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};

type robotType = keyof IResourceCount;

// Returns the updated resource cost if enough resources to craft; otherwise return undefined
function maybeCraftRobot(
  resources: IResourceCount,
  costToBuild: IResourceCount
): IResourceCount | undefined {
  if (
    resources.ore >= costToBuild.ore &&
    resources.clay >= costToBuild.clay &&
    resources.obsidian >= costToBuild.obsidian &&
    resources.geode >= costToBuild.geode
  ) {
    return {
      ore: resources.ore - costToBuild.ore,
      clay: resources.clay - costToBuild.clay,
      obsidian: resources.obsidian - costToBuild.obsidian,
      geode: resources.geode - costToBuild.geode,
    };
  }
}

// Add all reousces created by robots during the minute
function updateResources(
  resources: IResourceCount,
  resourcesCreatedFromRobots: IResourceCount
): IResourceCount {
  return {
    ore: resources.ore + resourcesCreatedFromRobots.ore,
    clay: resources.clay + resourcesCreatedFromRobots.clay,
    obsidian: resources.obsidian + resourcesCreatedFromRobots.obsidian,
    geode: resources.geode + resourcesCreatedFromRobots.geode,
  };
}

interface IGetMaxGeodeArgs {
  resources: IResourceCount;
  robots: IResourceCount;
  minute: number;
  robotCosts: Map<robotType, IResourceCount>;
  minutes: number;
  memo?: Array<
    | {
        value: number;
        geode: number;
        robots: number;
      }
    | undefined
  >;
}

function getMaxGeodes(args: IGetMaxGeodeArgs): number {
  const { resources, robots, minute, robotCosts, minutes, memo } = args;
  if (minute >= minutes) {
    return resources.geode;
  }

  const maybeMemoedValue = memo && memo[minute];
  if (
    maybeMemoedValue &&
    ((maybeMemoedValue.geode > resources.geode &&
      maybeMemoedValue.robots >= robots.geode) ||
      (maybeMemoedValue.geode >= resources.geode &&
        maybeMemoedValue.robots > robots.geode))
  ) {
    return maybeMemoedValue.value;
  }

  const geodes: number[] = [];
  let recursedWithoutCreate = false;

  // Greedy addon, at minute 22 we probably shouldn't be making clay or ore robots
  const resourceNames: robotType[] =
    minute > 22 ? ["geode", "obsidian"] : ["geode", "obsidian", "clay", "ore"];

  let callCount = 0;
  for (let i = 0; i < resourceNames.length; i++) {
    const canCraftRobot = maybeCraftRobot(
      resources,
      robotCosts.get(resourceNames[i]) ?? defaultResourceCount
    );
    if (canCraftRobot !== undefined) {
      callCount++;
      const maxGeodes = getMaxGeodes({
        ...args,
        resources: updateResources(canCraftRobot, robots),
        robots: {
          ...robots,
          [resourceNames[i]]: robots[resourceNames[i]] + 1,
        },
        minute: minute + 1,
      });
      geodes.push(maxGeodes);
    } else {
      const canCraftNextMinute = maybeCraftRobot(
        updateResources(resources, robots),
        robotCosts.get(resourceNames[i]) ?? defaultResourceCount
      );
      // If we can craft at the next minute, wait another minute
      if (canCraftNextMinute && !recursedWithoutCreate) {
        recursedWithoutCreate = true;
        callCount++;
        const maxGeodesFromWatiing = getMaxGeodes({
          ...args,
          resources: updateResources(resources, robots),
          minute: minute + 1,
        });
        geodes.push(maxGeodesFromWatiing);
      }
    }

    // We already recursed twice creating additional robots, probably don't need to keep going
    if (callCount === 2) {
      break;
    }
  }
  if (callCount !== 2 && !recursedWithoutCreate) {
    geodes.push(
      getMaxGeodes({
        ...args,
        resources: updateResources(resources, robots),
        minute: minute + 1,
      })
    );
  }

  const maxGeodes = Math.max(...geodes);
  if (memo && (maybeMemoedValue?.value ?? 0 <= maxGeodes)) {
    memo[minute] = {
      value: maxGeodes,
      geode: resources.geode,
      robots: robots.geode,
    };
  }

  return maxGeodes;
}

function oreType(input: string): robotType {
  if (input.includes("ore")) {
    return "ore";
  } else if (input.includes("clay")) {
    return "clay";
  } else if (input.includes("obsidian")) {
    return "obsidian";
  }
  return "geode";
}

const idxToRobotType: { [idx: number]: robotType } = {
  0: "ore",
  1: "clay",
  2: "obsidian",
  3: "geode",
};

function getBlueprintCosts(blueprint: string): Map<robotType, IResourceCount> {
  const robotCosts = new Map<robotType, IResourceCount>();
  const cost = blueprint.split(".");
  cost.forEach((c, idx) => {
    if (!c) {
      return;
    }
    const [_, costData] = c.split("robot");
    let [first, second] = costData.split("and");

    const cost = {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    };

    cost[oreType(first)] = parseInt(
      first.substring(first.indexOf("costs") + 6, first.indexOf("costs") + 8)
    );
    if (second) {
      second = second.trim();
      cost[oreType(second)] = parseInt(
        second.substring(0, second.indexOf(" "))
      );
    }

    robotCosts.set(idxToRobotType[idx], cost);
  });
  return robotCosts;
}

console.log(part1());
console.log(part2());
