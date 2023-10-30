import YAML from "yaml";
import { readFile, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import * as cheerio from "cheerio";
import { gotScraping } from "got-scraping";
import * as core from "@actions/core";
import util from "util";
import { join } from "path";

const { GITHUB_WORKSPACE, INPUT_SEASON_FILE_PATH } = process.env;

let rootPath = GITHUB_WORKSPACE;
if (INPUT_SEASON_FILE_PATH) rootPath = `${rootPath}/${INPUT_SEASON_FILE_PATH}`;

let path = "";
const path1 = join(rootPath, "season.yml");
const path2 = join(rootPath, "season.yaml");

if (existsSync(path1)) {
  path = path1;
} else if (existsSync(path2)) {
  path = path2;
} else {
  throw new Error(
    `season.yaml or season.yml don't exist at specified path: ${rootPath}`
  );
}

// read the file 'season.yaml' and save it as a javascript object
const season = YAML.parse(await readFile(path, "utf-8"));

const extractLinks = (lang, ep) =>
  Promise.all(
    Object.values(season.competenceAreas).flatMap(({ competences }) =>
      Object.values(competences).flatMap(({ subCompetences }) =>
        Object.values(subCompetences).flatMap(({ testItems }) =>
          Object.entries(testItems)
            .filter(([_, { episode }]) => episode === ep)
            .flatMap(([testId, { search }]) =>
              search?.[lang]?.links.flatMap(async (url) => {
                try {
                  const { headers, body } = await gotScraping(url);
                  const $ = cheerio.load(body);

                  return {
                    test: testId,
                    embeddable: !headers["x-frame-options"],
                    url,
                    title: $("head > title").text(),
                  };
                } catch (err) {
                  core.error(
                    `Microlearning extraction. Site: ${url} cannot be scraped.`
                  );
                }
              })
            )
        )
      )
    )
  );

try {
  for (const episode of Object.keys(season.episodes)) {
    for (const lang of ["de", "en"]) {
      const links = (await extractLinks(lang, episode)).filter(
        (x) => x !== null
      );

      if (links.length > 0) {
        await mkdir(`./assets/microlearning/${episode}/`, { recursive: true });
        core.info(
          `Writing ${links.length} ${lang} links for episode "${episode}"`
        );
        await writeFile(
          `./assets/microlearning/${episode}/microlearning.${lang}.json`,
          JSON.stringify(links)
        );
      } else {
        core.info(`No links ${lang} found for episode "${episode}"`);
      }
    }
  }
} catch (err) {
  core.setFailed(
    `\nError during microlearning extraction\n ${util.inspect(err, {
      showHidden: false,
      depth: null,
      colors: true,
    })}`
  );
}
