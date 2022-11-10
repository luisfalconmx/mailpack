const { resolve } = require("path");
const { compileFile } = require("pug");
const { readFile, writeFile } = require("fs/promises");
const { existsSync, mkdirSync, rmSync } = require("fs");
const getDirectories = require("./library/getDirectories");
const getEsignatures = require("./library/getEsignatures");
const checkFileExists = require("./library/checkFileExists");

const main = async () => {
  try {
    const root = resolve(__dirname, "../");
    const src = {
      name: "src",
      path: `${root}/src`,
    };
    const dist = {
      name: "build",
      path: `${root}/build`,
    };

    // Create or Clean output directory
    if (!existsSync(dist.path)) {
      mkdirSync(dist.path);
    } else {
      const deleteOptions = { recursive: true, force: true };
      rmSync(dist.path, deleteOptions);
      mkdirSync(dist.path);
    }

    const projects = await getDirectories(src.path);

    // Iterate all projects path
    projects.map(async (project) => {
      const projectPath = `${src.path}/${project}`;
      const layout = `${root}/app/layout.pug`;
      const template = await checkFileExists(`${projectPath}/_template.pug`);
      const esignatures = await getEsignatures(projectPath);
      const projectOutputPath = `${dist.path}/${project}`;

      // Build index file with listing directories
      const compileIndex = compileFile(layout);
      const dataIndex = projects.map((i) => ({
        link: `/${i}`,
        text: i,
      }));
      const htmlIndex = compileIndex({ files: dataIndex });
      await writeFile(`./build/index.html`, htmlIndex);

      // Create each project folder
      if (!existsSync(projectOutputPath)) {
        mkdirSync(projectOutputPath);
      }

      // Build each index file per project
      const compileList = compileFile(layout);
      const dataList = esignatures.map((i) => ({
        link: `/${project}/${i.slug}.html`,
        text: i.slug,
        download: `/${project}/${i.slug}.html`,
      }));
      dataList.unshift({
        link: "/",
        text: "..",
      });
      const htmlList = compileList({ files: dataList });
      await writeFile(`./build/${project}/index.html`, htmlList);

      // Build all esignatures from pug to html
      esignatures.forEach(async (esignature) => {
        const compile = compileFile(template);
        const html = compile(esignature.data);
        await writeFile(`./build/${project}/${esignature.slug}.html`, html);
      });
    });

    console.log("compiled succesfully");
  } catch (error) {
    throw new Error(error);
  }
};

main();
