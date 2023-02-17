const { Then } = require('@cucumber/cucumber');

const visualCheck = async (name, buffer) => {
  const result = await browser.syngrisiCheck(name, buffer);
  if (result.status.includes('failed')) {
    throw new Error(`The visual check failed, reasons: ${JSON.stringify(result.failReasons)}`
            + `\nyou can see details on the Syngrisi page '${result.vrsDiffLink}'`);
  }

  return result;
};
Then('User visually check viewport as {string}', async function (name) {
  const imageBuffer = Buffer.from((await browser.takeScreenshot()), 'base64');
  await visualCheck(name, imageBuffer);

});
Then('User visually check {locator} element as {string}', async function (selector, name) {
  const element = await $(selector);
  const ss = await browser.takeElementScreenshot(element.elementId);
  const imageBuffer = Buffer.from(ss, 'base64');
  await visualCheck(name, imageBuffer);
});