export async function takeScreenshot(driver, dir, currentTest) {
    const fileName = currentTest.test.fullTitle().replace(/ /g, '_');
    await driver.takeScreenshot();
    await driver.saveScreenshot(`${dir}/${fileName}.png`);
}

export function failWithShot(driver, dir, testCb) {
  return async function() {
    try {
      await testCb();
    }
    catch(err) {
      await takeScreenshot(driver, dir, this);
      throw err;
    }
  }
}
