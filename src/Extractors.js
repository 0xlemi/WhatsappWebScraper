import { By } from 'selenium-webdriver'


// Returns the last 18 chats names in the sidebar
// @param driver
// @returns Array of webElements 
const allChats = async (driver) => {
  return await driver.findElements(By.xpath('//div[@id="pane-side"]/div[1]/div[1]/div[1]/div/div[1]'));
};



// Returns the chat that is selected
// @param driver
// @returns WebElement
const chatSelected = async (driver) => {
  let elements = await driver.findElements(By.xpath('//div[@id="pane-side"]/div[1]/div[1]/div[1]/div/div[@aria-selected="true"]'));
  if(elements.length === 0) {
    return null;
  }
  return elements[0];
};

// Returns the number defined of new messages
// @param driver, number
// @returns array of WebElements
const messages = async (driver, numberMessages = null) => {
  let messages =  await driver.findElements(By.xpath('//div[@id="main"]/div[@class="_2wjK5"]/div/div/div[@class="_11liR"]/div'));
  if(numberMessages) {
    return messages.slice(0, numberMessages);
  }
  return messages;

};

const Extractors = {
  allChats,
  chatSelected,
  messages,
};

export default Extractors;
