const express = require("express");
const { resolve } = require("path");
const { compileFile } = require("pug");
const getDirectories = require("./library/getDirectories");
const getEsignatures = require("./library/getEsignatures");

const app = express();
const port = 3000;

app.set("view engine", "pug");

const start = async () => {
  try {
    const root = resolve(__dirname, "../");
    const layout = `${root}/app/layout.pug`;
    const projects = await getDirectories(`${root}/src/`);

    // Render index route with listing directories
    app.get("/", (req, res) => {
      const compile = compileFile(layout);
      const data = projects.map((i) => {
        return {
          link: `/${i}`,
          text: i,
        };
      });
      res.send(compile({ files: data }));
    });

    projects.map(async (project) => {
      const template = `${root}/src/${project}/_template.pug`;
      const esignatures = await getEsignatures(`${root}/src/${project}`);

      // Render each project route with listing esignatures
      app.get(`/${project}`, (req, res) => {
        const compile = compileFile(layout);
        const data = esignatures.map((i) => ({
          link: `/${project}/${i.slug}`,
          text: i.slug,
          download: `/${project}/${i.slug}.html`,
        }));
        data.unshift({
          link: "/",
          text: "..",
        });
        res.send(compile({ files: data }));
      });

      esignatures.forEach((esignature) => {
        // Render each esignature with the html compiled
        app.get(`/${project}/${esignature.slug}`, (req, res) => {
          const compile = compileFile(template);
          res.send(compile(esignature.data));
        });
      });
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
