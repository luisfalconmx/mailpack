const { readFileSync } = require("fs");
const { readdir } = require("fs/promises");

const getEsignatures = async (source) => {
  try {
    const fileExtension = ".json";
    const readDirOpts = { withFileTypes: false };
    const data = await readdir(source, readDirOpts);
    const extensionMatch = data.filter((item) => item.includes(fileExtension));
    const esignatures = extensionMatch.map((esignature) => {
      const readFileOpts = { encoding: "utf8" };
      const fileContent = readFileSync(`${source}/${esignature}`, readFileOpts);

      const properties = {
        slug: esignature.replace(fileExtension, ""),
        path: `${source}/${esignature}`,
        data: JSON.parse(fileContent),
      };

      return properties;
    });
    return esignatures;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = getEsignatures;
