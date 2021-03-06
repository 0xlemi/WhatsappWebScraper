import { Builder, By, until } from 'selenium-webdriver'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import assert from 'assert';


const findElementSafe = async (webElementArray, xpath) => {
  return (await webElementArray.findElements(By.xpath(xpath)))[0];
}

const createDriver = async () => {
  const chrome = require('selenium-webdriver/chrome');
  const options = new chrome.Options();

  options.addArguments('--disable-dev-shm-usage')
  options.addArguments('--no-sandbox')

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()
};


// Wait for login and get the welcome message
const startUp = async () => {
  let driver = await createDriver();

  await driver.get('https://web.whatsapp.com/')

  let element = await driver.wait(until.elementLocated(By.xpath('//div[@class="WG7wG"]/h1[@class="Ui--U"]')),1000000);
  await driver.sleep(2000)

  let messageText = await element.getText();
  assert(messageText == "Keep your phone connected");

  return driver; 
};

const Helpers = {
  findElementSafe,
  startUp
};

export default Helpers;
