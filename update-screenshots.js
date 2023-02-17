/* eslint-disable no-console */

// for now, it uses file 'failedScreenshots.json' which is generated when step failed
// just running "npm run updateScreenshots" will update all failed screenshots
// to exclude some screenshots from being updated - you should manually delete it from 'failedScreenshots.json'

const fs = require('fs');
const path = require('path');
const global_params = require('./common_config').common_config.params;
const failedScreenshots_json = global_params.failedScreenshots_json;

const isEntireUpdate = process.argv[2] === 'all';

const failedScreenshots = require(path.join(process.cwd(), failedScreenshots_json)).screenshots;
const filesToReplace = isEntireUpdate ? failedScreenshots : failedScreenshots.filter(el => el.update);

console.log('=====================================');
console.log('Updating files:');
console.log(`${filesToReplace.map(el => el.browser + ': ' + el.name).join('\n')}`);
console.log('=====================================');

for (const file of filesToReplace) {
  const directory = path.dirname(file.path);
  const fileName = file.name;

  const baselineScreenshot = path.join(directory, fileName);
  const actualScreenshot = path.join(directory, `${path.basename(fileName, '.png')}__actualScreenshot.png`);
  const diffScreenshot = path.join(directory, `${path.basename(fileName, '.png')}__diff.png`);

  if (!fs.existsSync(baselineScreenshot)) {
    console.log(`File not found: ${fileName}`);
    continue;
  }

  if (!fs.existsSync(actualScreenshot) || !fs.existsSync(diffScreenshot)) {
    console.log(`__actualScreenshot or __diff not found for file: ${fileName}. Skipping...`);
    continue;
  }

  // remove baseline and diff, and rename actual to baseline
  fs.unlinkSync(baselineScreenshot);
  fs.unlinkSync(diffScreenshot);
  fs.renameSync(actualScreenshot, path.join(directory, `${fileName}`));

  console.log(`File updated: ${fileName}`);
}
