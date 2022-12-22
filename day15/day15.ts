import { readFileSync } from "fs";

interface IWindow {
  start: number;
  end: number;
}
function part1() {
  const TARGET = 2000000;
  const { rowToSensorWindows, rowToBeaconCol } = getSensorWindows();
  const windows = rowToSensorWindows.get(TARGET);
  let coveredSensorPoints = 0;

  if (windows) {
    const values = Array.from(windows);
    values.sort((a, b) => a.start - b.start);

    let prevWindow: IWindow | undefined;
    for (let i = 0; i < values.length; i++) {
      const curWindow = values[i];
      if (!prevWindow) {
        coveredSensorPoints += curWindow.end - curWindow.start + 1;
        prevWindow = curWindow;
        continue;
      }

      if (curWindow.start > prevWindow.end) {
        coveredSensorPoints += curWindow.end - curWindow.start;
      } else if (curWindow.start < prevWindow.end) {
        if (curWindow.end > prevWindow.end) {
          coveredSensorPoints += curWindow.end - prevWindow.end;
        } else {
          continue;
        }
      } else if (curWindow.start === prevWindow.end) {
        coveredSensorPoints += curWindow.end - curWindow.start;
      }

      prevWindow = curWindow;
    }
  }

  const numBeaconsOnRow = rowToBeaconCol.get(TARGET)?.size ?? 0;
  return coveredSensorPoints - numBeaconsOnRow;
}

function part2() {
  const MAX = 4000000;
  const { rowToSensorWindows } = getSensorWindows();

  for (const [yCoord, windows] of rowToSensorWindows) {
    const values = Array.from(windows);
    values.sort((a, b) => a.start - b.start);
    let combinedWindow: IWindow | undefined;

    if (yCoord >= 0 && yCoord <= MAX) {
      for (let i = 0; i < values.length; i++) {
        const curWindow = values[i];
        if (!combinedWindow) {
          combinedWindow = { ...curWindow };
        } else {
          if (curWindow.start > combinedWindow.end) {
            if (curWindow.start - 1 === combinedWindow.end) {
              combinedWindow.end = curWindow.end;
              continue;
            }

            // If the next window is more than 2 points away the space between the two windows contains the location of the beacon
            if (
              yCoord >= 0 &&
              yCoord <= MAX &&
              ((combinedWindow.end >= 0 && combinedWindow.end <= MAX) ||
                (curWindow.start >= 0 && curWindow.start <= MAX))
            ) {
              return (combinedWindow.end + 1) * 4000000 + yCoord;
            }
          } else if (curWindow.start < combinedWindow.end) {
            if (curWindow.end > combinedWindow.end) {
              combinedWindow.end = curWindow.end;
            } else {
              continue;
            }
          } else if (curWindow.start === combinedWindow.end) {
            combinedWindow.end = curWindow.end;
          }
        }
      }
    }
  }
  return 0;
}

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

interface ISensorData {
  // Maps the row/y-coordinate to the x coordinate windows the sensor can see
  rowToSensorWindows: Map<number, Set<IWindow>>;
  // maps the row/y-coordinate to the x coordinates of all beacons on that row
  rowToBeaconCol: Map<number, Set<number>>;
}

function getSensorWindows(): ISensorData {
  const input = getInput();
  const rowToSensorWindows = new Map<number, Set<IWindow>>();
  const rowToBeaconCol = new Map<number, Set<number>>();
  input.forEach((line) => {
    const data = line.split("=");
    const sensorX = Number(data[1].substring(0, data[1].indexOf(",")));
    const sensorY = Number(data[2].substring(0, data[2].indexOf(":")));
    const beaconX = Number(data[3].substring(0, data[3].indexOf(",")));
    const beaconY = Number(data[4]);
    if (rowToBeaconCol.get(beaconY) == null) {
      rowToBeaconCol.set(beaconY, new Set<number>());
    }
    rowToBeaconCol.get(beaconY)?.add(beaconX);

    let manhattanDistance =
      Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    let positiveYSensor = sensorY;
    let negativeYSensor = sensorY;
    while (manhattanDistance > -1) {
      let sensorWindowsA =
        rowToSensorWindows.get(positiveYSensor) ??
        rowToSensorWindows
          .set(positiveYSensor, new Set<IWindow>())
          .get(positiveYSensor);
      let sensorWindowsB =
        rowToSensorWindows.get(negativeYSensor) ??
        rowToSensorWindows
          .set(negativeYSensor, new Set<IWindow>())
          .get(negativeYSensor);

      const curWindow = {
        start: sensorX - manhattanDistance,
        end: sensorX + manhattanDistance,
      };
      sensorWindowsA?.add(curWindow);
      sensorWindowsB?.add(curWindow);

      negativeYSensor -= 1;
      positiveYSensor += 1;
      manhattanDistance -= 1;
    }
  });
  return { rowToSensorWindows, rowToBeaconCol };
}
console.log(part1());
console.log(part2());
