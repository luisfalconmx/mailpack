const { existsSync } = require("fs");

const checkFileExists = async (source) => {
  try {
    if (existsSync(source)) {
      return source;
    } else {
      throw new Error(`The file ${source} not exists`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = checkFileExists;
