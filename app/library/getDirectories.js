const { readdir } = require("fs/promises");

const getDirectories = async (source) => {
  try {
    const options = { withFileTypes: true };
    const data = await readdir(source, options);
    const directories = data.filter((dir) => dir.isDirectory());
    const directoryNames = directories.map((dir) => dir.name);
    return directoryNames;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = getDirectories;
