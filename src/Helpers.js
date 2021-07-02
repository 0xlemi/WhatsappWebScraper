import { Builder, By, until } from 'selenium-webdriver'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import assert from 'assert';
import moment from 'moment';


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

const searchForSpinners = (driver) => {

};

const scrollUntilHitDate = (driver, string) => {

};

const dateDividerShows = async (driver, string) => {
  let dateDividers =  await driver.findElements(
    By.xpath('//div[@id="main"]/div[@class="_2wjK5"]/div/div\
      /div[@class="_11liR"]/div/div[contains(@class, "_24wtQ")]\
      /span[@dir="auto"]')
  );
};



const goToBottom = (driver) => {
  bottomButton = findElementSafe(driver, '//div[contains(@class, "_2wFt8")]/span[@data-icon="down"]');
  if (bottomButton) {
    bottomButton.click();
  }else {
    console.warn('Bottom button was not found. Click not performed.');
  }
};

const fillAuthorsAndDates = (messagesArray) => {
  let lastAuthor = null;
  let lastDate = null;
  for (let i = 0; i < messagesArray.length; i++) {
    if('date' in messagesArray[i]) {
      lastDate = messagesArray[i].date;
      messagesArray.splice(i, 1);
      i--;
      continue;
    };

    // Check for author
    if(('author' in messagesArray[i]) && (messagesArray[i].author === undefined) && lastAuthor) {
      messagesArray[i].author = lastAuthor;
    };

    // Check for date
    if(('time' in messagesArray[i]) && lastDate) {

      let dateTime;
      // Check if has the day of the week format "MONDAY"
      // By check if is string of letters 
      if (lastDate.toLowerCase().match(/[a-z]/i)) {
        // Split 11:25 AM -> ['11:25', 'AM']
        let time = messagesArray[i].time.split(" ");
        let timeAMPM = time[1];
        // Split 11:25 -> ['12', '25']
        let timeHourMinute = time[0].split(":");
        // If is PM add 12 to the hour
        if(timeAMPM === "PM") {
          timeHourMinute[0] = parseInt(timeHourMinute[0]) + 12
        }

        // Check for Today or Yesterday because 
        if(lastDate.toLowerCase() == 'today') {
          dateTime = moment();
        }else if (lastDate.toLowerCase() == 'yesterday') {
          dateTime = moment().subtract(1, 'days');
        }else{
          dateTime = moment().day(lastDate.toLowerCase());
        }


        // Add hour and minute
        dateTime.hour(timeHourMinute[0]).minute(timeHourMinute[1]);

        // Sometimes takes next day of the week, if is in the future take 
        // it back a week
        if(dateTime.isAfter(moment())){
          dateTime.subtract(7, 'days');
        }


      }
      else if ( /^-?\d+$/.test(lastDate.charAt(0)) ){
        // Check if date is in MM/DD/YYYY format
        // By checking if the first is number
        dateTime = moment(lastDate + ' ' + messagesArray[i].time, 'MM-DD-YYYY hh:mm A');
      }

      messagesArray[i].time = dateTime.format('LLLL');
    } else {
      messagesArray[i].time = 'no-date ' + messagesArray[i].time;
    };

    lastAuthor = messagesArray[i].author;
  }

  return messagesArray;
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
  fillAuthorsAndDates,
  startUp
};

export default Helpers;
