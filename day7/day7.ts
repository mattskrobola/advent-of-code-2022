import { readFileSync } from "fs";

function part1() {
  const dirToSize = getDirSizes();

  let result = 0;
  Object.keys(dirToSize).forEach((dir) => {
    if (dirToSize[dir] <= 100000) {
      result += dirToSize[dir];
    }
  });

  return result;
}

function part2() {
  const dirToSize = getDirSizes();

  const availableSpace = 70000000 - dirToSize["/"];
  const spaceNeeded = 30000000 - availableSpace;
  // find the smallest directory we can delete and still have enough space
  let minDirectorySize = Infinity;
  Object.keys(dirToSize).forEach((dir) => {
    if (dirToSize[dir] >= spaceNeeded) {
      minDirectorySize = Math.min(minDirectorySize, dirToSize[dir]);
    }
  });
  return minDirectorySize;
}

function getInput() {
  return readFileSync("input.txt", "utf-8")
    .split("\n")
    .filter((c) => c);
}

function getDirSizes(): { [dir: string]: number } {
  const input = getInput();
  const dirToSize: { [key: string]: number } = {};
  let currentDirectory = "/";
  const dirToChildren: { [key: string]: Set<String> } = {};

  for (let i = 1; i < input.length; i++) {
    if (dirToChildren[currentDirectory] == null) {
      dirToChildren[currentDirectory] = new Set();
      dirToSize[currentDirectory] = 0;
    }

    const command = input[i].split(" ");
    if (command[0] === "$") {
      if (command[2] === "..") {
        currentDirectory = currentDirectory.substring(
          0,
          currentDirectory.lastIndexOf("/")
        );
      } else if (command[1] === "cd") {
        currentDirectory += "/" + command[2];
      }
    } else if (command[0] === "dir") {
      dirToChildren[currentDirectory].add(currentDirectory + "/" + command[1]);
    } else if (!isNaN(Number(command[0]))) {
      dirToSize[currentDirectory] += Number(command[0]);
    }
  }

  // Resolve directory sizes for directories that have children
  while (Object.keys(dirToChildren).length > 0) {
    const leafDirectories = new Set<string>();
    Object.keys(dirToChildren).map((dir) => {
      // if a directory has no children that need to be resolved it's a leaf
      if (dirToChildren[dir].size === 0) {
        leafDirectories.add(dir);
        delete dirToChildren[dir];
      }
    });

    Object.keys(dirToChildren).map((dir) => {
      leafDirectories.forEach((leaf) => {
        if (dirToChildren[dir].has(leaf)) {
          dirToSize[dir] += dirToSize[leaf];
          dirToChildren[dir].delete(leaf);
        }
      });
    });
  }

  return dirToSize;
}

console.log(part1());
console.log(part2());
