import { readFileSync } from "fs";

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

const transforms = [
  [0, 0, 1],
  [0, 0, -1],
  [0, 1, 0],
  [0, -1, 0],
  [1, 0, 0],
  [-1, 0, 0],
];

function getCleanVisited(): boolean[][][] {
  return Array.from(new Array(22), () =>
    Array.from(new Array(22), () => Array.from(new Array(22), () => false))
  );
}

function getGridAndCubes(): { grid: number[][][]; cubes: number[][] } {
  const grid: number[][][] = Array.from(new Array(22), () =>
    Array.from(new Array(22), () => Array.from(new Array(22), () => 0))
  );

  const input = getInput();
  const cubes: number[][] = [];
  input.forEach((cube) => {
    // +1 so we don't have to deal with 0 index
    const [x, y, z] = cube.split(",").map((c) => Number(c) + 1);
    cubes.push([x, y, z]);
    grid[x][y][z] = 1;
  });
  return { grid, cubes };
}

function part1() {
  const { cubes, grid } = getGridAndCubes();
  let openSpace = 0;
  cubes.forEach((cube) => {
    const [x, y, z] = cube;
    transforms.forEach((transform) => {
      const [x1, y1, z1] = transform;
      if (grid[x + x1][y + y1][z + z1] === 0) {
        openSpace++;
      }
    });
  });
  return openSpace;
}

function part2() {
  const { grid, cubes } = getGridAndCubes();
  let openSpace = 0;
  cubes.forEach((cube) => {
    const [x, y, z] = cube;
    transforms.forEach((transform) => {
      const [x1, y1, z1] = transform;
      if (
        grid[x + x1][y + y1][z + z1] === 0 &&
        canReachOuterGrid(x + x1, y + y1, z + z1, grid, getCleanVisited())
      ) {
        openSpace++;
      }
    });
  });
  return openSpace;
}

function canReachOuterGrid(
  x: number,
  y: number,
  z: number,
  grid: number[][][],
  visited: boolean[][][]
): boolean {
  if (
    x <= 0 ||
    y <= 0 ||
    z <= 0 ||
    x >= grid.length ||
    y >= grid[0].length ||
    z >= grid[0][0].length
  ) {
    return true;
  }
  if (grid[x][y][z] === 1) {
    return false;
  }
  if (visited[x][y][z]) {
    return false;
  }
  visited[x][y][z] = true;
  return (
    canReachOuterGrid(x + 1, y, z, grid, visited) ||
    canReachOuterGrid(x - 1, y, z, grid, visited) ||
    canReachOuterGrid(x, y + 1, z, grid, visited) ||
    canReachOuterGrid(x, y - 1, z, grid, visited) ||
    canReachOuterGrid(x, y, z + 1, grid, visited) ||
    canReachOuterGrid(x, y, z - 1, grid, visited)
  );
}

console.log(part1());
console.log(part2());
