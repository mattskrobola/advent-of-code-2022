import { readFileSync } from "fs";

function part1() {
  const { valveToFlowRate, valveToLeads } = getValveData();
  const valveToTravelTimeMap = new Map<string, Map<string, number>>();

  let valvesWithCost = Array.from(valveToFlowRate.keys()).filter(
    (v) => valveToFlowRate.get(v) !== 0
  );

  ["AA", ...valvesWithCost].forEach((v) => {
    const travelTimeMap = new Map<string, number>();
    fillIntravelTimeMap(v, v, 0, travelTimeMap, valveToLeads);
    valveToTravelTimeMap.set(v, travelTimeMap);
  });

  let max = 0;
  // Need to runn this  multiple times to get the max answer (or increase i)
  for (let i = 0; i < 1000000; i++) {
    max = Math.max(
      max,
      runRoute(valvesWithCost, valveToFlowRate, valveToTravelTimeMap, 30)
    );
    // randomize valves
    valvesWithCost.sort(() => (Math.random() > 0.5 ? 1 : -1));
  }

  return max;
}

function part2() {
  const { valveToFlowRate, valveToLeads } = getValveData();
  const valveToTravelTimeMap = new Map<string, Map<string, number>>();

  let valvesWithCost = Array.from(valveToFlowRate.keys()).filter(
    (v) => valveToFlowRate.get(v) !== 0
  );

  ["AA", ...valvesWithCost].forEach((v) => {
    const travelTimeMap = new Map<string, number>();
    fillIntravelTimeMap(v, v, 0, travelTimeMap, valveToLeads);
    valveToTravelTimeMap.set(v, travelTimeMap);
  });

  let max = 0;

  // Toggle this to optimize the split
  const split = 7;
  // Need to runn this  multiple times to get the max answer (or increase i)
  for (let i = 0; i < 1000000; i++) {
    const eleRoute = valvesWithCost.slice(0, 7);
    const myRoute = valvesWithCost.slice(7);

    const eleRun = runRoute(
      eleRoute,
      valveToFlowRate,
      valveToTravelTimeMap,
      26
    );
    const myRun = runRoute(myRoute, valveToFlowRate, valveToTravelTimeMap, 26);
    max = Math.max(max, eleRun + myRun);

    // Randomly sort valves that have a pressure value
    valvesWithCost.sort(() => (Math.random() > 0.5 ? 1 : -1));
    // Optimization code to find the best split
    // valvesWithCost[valvesWithCost.indexOf("ZZ")] = valvesWithCost[0];
    // valvesWithCost[0] = "ZZ";
    // valvesWithCost[valvesWithCost.indexOf("WG")] = valvesWithCost[7];
    // valvesWithCost[7] = "WG";

    // valvesWithCost[valvesWithCost.indexOf("AO")] = valvesWithCost[1];
    // valvesWithCost[1] = "AO";
    // valvesWithCost[valvesWithCost.indexOf("IS")] = valvesWithCost[8];
    // valvesWithCost[8] = "IS";
  }

  return max;
}

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function getValveData(): {
  valveToFlowRate: Map<string, number>;
  valveToLeads: Map<string, string[]>;
} {
  const input = getInput();
  const valveToFlowRate = new Map<string, number>();
  const valveToLeads = new Map<string, string[]>();
  input.forEach((line) => {
    const valve = line.substring(6, 8);
    const flowRate = Number(
      line.substring(line.indexOf("=") + 1, line.indexOf(";"))
    );
    const leads = line
      .substring(
        line.indexOf("valve") + (line.indexOf("valves") === -1 ? 5 : 6)
      )
      .split(",")
      .map((c) => c.trim());

    valveToFlowRate.set(valve, flowRate);
    valveToLeads.set(valve, leads);
  });
  return { valveToFlowRate, valveToLeads };
}
function fillIntravelTimeMap(
  origin: string,
  curValve: string,
  minutes: number,
  travelTimeMap: Map<string, number>,
  valveToLeads: Map<string, string[]>
) {
  const prevVisitedTime = travelTimeMap.get(curValve);
  if (prevVisitedTime !== undefined && prevVisitedTime <= minutes) {
    return;
  } else {
    travelTimeMap.set(curValve, minutes);
  }
  const leads = valveToLeads.get(curValve);
  if (!leads) {
    return;
  }
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    fillIntravelTimeMap(origin, lead, minutes + 1, travelTimeMap, valveToLeads);
  }
}

function runRoute(
  valves: string[],
  valveToFlowRate: Map<string, number>,
  valveToTravelTimeMap: Map<string, Map<string, number>>,
  minutes: number
): number {
  let prev = "AA";
  let totalPressure = 0;
  let curPressure = 0;
  let travelMinutes = 0;
  let travelPtr = 0;

  for (let i = 0; i < minutes; i++) {
    totalPressure += curPressure;
    if (travelMinutes <= 0) {
      // first minute we don't open a valve
      if (i !== 0) {
        prev = valves[travelPtr];
        curPressure += valveToFlowRate.get(valves[travelPtr]) ?? 0;
        travelPtr += 1;
      }
      travelMinutes =
        valveToTravelTimeMap.get(prev)?.get(valves[travelPtr]) ?? 0;
      if (i === 0) {
        // -1 on the first minute since we don't open a valve we can travel
        travelMinutes -= 1;
      }
    } else {
      travelMinutes -= 1;
    }
  }
  return totalPressure;
}

console.log(part1());
console.log(part2());
