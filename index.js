const { Builder, By, until } = require('selenium-webdriver')
const assert = require('assert');
const readline = require("readline");

async function start() {
  const chrome = require('selenium-webdriver/chrome')
  const options = new chrome.Options();

  options.addArguments('--disable-dev-shm-usage')
  options.addArguments('--no-sandbox')

  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()

  await driver.get('https://web.whatsapp.com/')

  // Log Into Phone and take picture of QR code
  //
  //


  // Wait for login and get the welcome message
  //let element = await driver.wait(until.elementLocated(By.className('Ui--U')),1000000);
  let element = await driver.wait(until.elementLocated(By.xpath('//div[@class="WG7wG"]/h1[@class="Ui--U"]')),1000000);
  await driver.sleep(2000)
  let messageText = await element.getText();
  assert(messageText == "Keep your phone connected");
  console.log("ready")



  //await driver.sleep(15000)

  //console.log(await processMessages(await getMessages(driver)));

  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  let readLineFunction = () => {
    rl.question("Read Messages ? (yes/exit) ", async (answer) => {
      if (answer == 'yes') {
        console.log(await processMessages(await getMessages(driver)));
        readLineFunction();
      }else {
        rl.close();
      }
    });
  }

  readLineFunction();


  //console.log(await transformChatToNameAndUnreadNum(await onlyChatsWithUnreadMessages(await getAllChats(driver))));
  //console.log(await (await getAllChats(driver))[0].getText());
  //console.log((await getAllChats(driver))[0].click());
  //console.log(await webElementToNameUnread(await getAllChats(driver)));
  //
  
  
  //

  //const element = driver.findElement(By.className('Ui--U'));
  //assert.strictEqual(await element.getText(), 'Keep your phone connected');
  //const sideBar = driver.findElement(By.id('pane-side'));
  //const text = await driver.executeScript('return document.documentElement.innerText')
  //driver.quit()
}


//**********************
//      Getters
//**********************

// Returns the last 18 chats names in the sidebar
// @param driver
// @returns Array of webElements 
const getAllChats = async (driver) => {
  return await driver.findElements(By.xpath('//div[@id="pane-side"]/div[1]/div[1]/div[1]/div/div[1]'));
};



// Returns the chat that is selected
// @param driver
// @returns WebElement
const getChatSelected = async (driver) => {
  let elements = await driver.findElements(By.xpath('//div[@id="pane-side"]/div[1]/div[1]/div[1]/div/div[@aria-selected="true"]'));
  if(elements.length === 0) {
    return null;
  }
  return elements[0];
};

// Returns the number defined of new messages
// @param driver, number
// @returns array of WebElements
const getMessages = async (driver, numberMessages = null) => {
  let messages =  await driver.findElements(By.xpath('//div[@id="main"]/div[@class="_2wjK5"]/div/div/div[@class="_11liR"]/div'));
  if(numberMessages) {
    return messages.slice(0, numberMessages);
  }
  return messages;

};

const processMessages = async (messages) => {
  let objectsArray = [];

  // If is not a group chat is a personal chat 
  // and the sender is always the same
  let author = null;
  if(! await isGroupChat(messages[0])) {
    let authorElement = await findElementSafe(
      messages[0], 
      '//div[@id="main"]/header/div/div/div/span[@dir="auto"]'
    );
    author = await authorElement.getText();
  }

  for(message of messages) {
    
    //let reply = null;
    //if(await hasReply(message)) {

    //}
    if(span = await isText(message)) {

      objectsArray.push(await transformTextMessage(span, message, author));

    }else if(await isDateDivider(message)) {

      objectsArray.push(await transformDateDivider(message));

    }else if(media = await isVoiceNote(message)) {

      objectsArray.push(await transformVoiceNote(media, message, author));

    }else if(media = await isImage(message)) {

      objectsArray.push(await transformImage(media, message, author));

    }else if(media = await isStickerGif(message)) {

      objectsArray.push(await transformStickerGif(media, message, author));

    }else if(media = await isStickerImage(message)) {

      objectsArray.push(await transformStickerImage(media, message, author));

    }else if(await isVideo(message)) {

      objectsArray.push(await transformeVideo(null, message, author));

 //    }else if(await isMultiImage(message)) {
 //      objectsArray.push({
 //       type: "multi-image",
 //       info: "not supported yet"
 //     });
 //   }else if(await isDoubleStackedSticker(message)) {
 //     objectsArray.push({
 //       type: "double-stacked-sticker",
 //       info: "not supported yet"
 //     });
    }


  }
  return objectsArray;
};

const getNumNewMessages = () => {

};





//**********************
//    Transformers
//**********************

// Transforms web elements into objects with title and unreadMessages
// @param array of webElements
// @returns array of Objects
const transformChatToNameAndUnreadNum = async (chats) => {
  let objectsArray = [];

  for(chat of chats) {
    let title = await chat.findElement(By.xpath('div[1]/div[2]/div[1]/div[1]/span'));
    title = await title.getText();

    let unreadMessagesExist = await chat.findElements(By.xpath('div[1]/div[2]/div[2]/div[2]/span[1]/div/span'));

    // Double check for fallback
    let unreadMessages = 0;
    if(unreadMessagesExist.length > 0){
      unreadMessages = unreadMessagesExist[0];
      unreadMessages = parseInt(await unreadMessages.getText());
    }

    objectsArray.push({ title: title, unreadMessages: unreadMessages});
  }

  return objectsArray;
}

const transformTime = async (message, xpath = 'div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]') => {
  let time = await findElementSafe(message, xpath);
  if (time) {
    return await time.getText();
  }
  return time;
};

const transformAuthor = async (message, xpath, overwriteAuthor = null) => {
  // If the class of the root massage contains message-out it is sent
  // by you the message.
  let messageClass = await message.getAttribute('class');
  if (messageClass.includes('message-out')) {
    return 'You';
  }

  // If they overwrite the author that should go
  if(overwriteAuthor) {
    return overwriteAuthor;
  }
  
  let author = await findElementSafe(message, xpath);
  if (author) {
    return await author.getText();
  }
  return author;
};

const transformTextMessage = async (text, message, overwriteAuthor = null) => {
  let author = await transformAuthor(
    message, 
    'div/div/div/div/span[@dir="auto"]', 
    overwriteAuthor
  );
  let time = await transformTime(message);

  if (text) {
    text = await text.getText();
  }

  return {
    type: "text",
    author: author,
    time: time,
    info: { src: text },
  };
};

const transformImage = async (media, message, overwriteAuthor = null) => {
  let author = await transformAuthor(
    message, 
    'div/div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await transformTime(
    message, 
    'div/div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]'
  );

  if(media){
    media = await media.getAttribute("src");
  }

  return {
    type: "image",
    author: author,
    time: time,
    info: { src: media },
  };
};

const transformVoiceNote = async (media, message, overwriteAuthor = null) => {
  let author = transformAuthor(
    message, 
    'div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await transformTime(message);

  if(media){
    media = await media.getAttribute("src");
  }

  return {
    type: "voice-note",
    author: author,
    time: time,
    info: { src: media },
  };
};

const transformeVideo = async (media, message, overwriteAuthor = null) => {
  author = await transformAuthor(
    message, 
    'div/div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await transformTime(
    message, 
    'div/div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]'
  );

  if(media){
    // Run video media extraction code here
    media = null;
  }

  return {
    type: "video",
    author: author,
    time: time,
    info: "Currently not Suported",
  };

};

const transformStickerImage = async (media, message, overwriteAuthor = null) => {
  author = await transformAuthor(
    message, 
    'div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await transformTime(
    message, 
    'div/div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]'
  );

  if(media){
    media = await media.getAttribute("src");
  }

  return {
    type: "sticker-img",
    author: author,
    time: time,
    info: { src: media },
  };
};

const transformStickerGif = async (media, message, overwriteAuthor = null) => {
  author = await transformAuthor(
    message, 
    'div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await transformTime(
    message, 
    'div/div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]'
  );

  if(media){
    media = await media.getAttribute("src");
  }

  return {
    type: "sticker-gif",
    author: author,
    time: time,
    info: { src: media },
  };
};

const transformDateDivider = async (message) => {
  let date = await findElementSafe(message, 'div/span[@dir="auto"]');
  if (date) {
    date = await date.getText();
  }

  return {date: date};
};



//**********************
//    Conditionals
//**********************

const hasReply = async (element) => {

};

const isText = async (element) => {
  return await findElementSafe(element, 'div/div/div/div/div[contains(@class, "_3ExzF")]/span[@dir="ltr"]');
};

const isImage = async (element) => {
  return await findElementSafe(element, 'div/div/div/div/div/div/div[contains(@class, "_2p30Q") and position()=last()]/img');
};

const isVoiceNote = async (element) => {
  return await findElementSafe(element, 'div/div/div/div/div/div/div/div[contains(@class, "sQ3Ia")]/audio');
};


const isStickerGif = async (element) => {
  return await findElementSafe(element, 'div/div/div/div/div/div/img[contains(@class, "_1guNH")]');
};

const isStickerImage = async (element) => {
  return await findElementSafe(element, 'div/div/div/div/div/img[contains(@class, "_1guNH")]');
};

// Unsuported at the moment
const isDoubleStackedSticker = async (element) => {
  if (elementAttribute = await element.getAttribute('data-id')) {
    if (elementAttribute.includes('grouped-sticker')) {
      return element;
    }
  }
  return undefined;

};
const isMultiImage = async (element) => {
  if (elementAttribute = await element.getAttribute('data-id')) {
    if (elementAttribute.includes('album-true')) {
      return element;
    }
  }
  return undefined;
};

const isVideo = async (element) => {
  return await findElementSafe(element, 'div/div/div/div/div/div/div/span[@data-testid="media-play"]');
};

const isDateDivider = async (element) => {
  return await findElementSafe(element, 'div/span[@dir="auto"]');
};

const isGroupChat = async (element) => {
  if (span = await findElementSafe(element, '//div[@id="main"]/header/div/div/span')) {
    let text = await span.getText();
    return text.includes(', ');
  }
  return false
};

const findElementSafe = async (webElementArray, xpath) => {
  return (await webElementArray.findElements(By.xpath(xpath)))[0];
};


//**********************
//       Filters
//**********************
const onlyChatsWithUnreadMessages = async (elements) => {
  let unreadChats = [];

  for(element of elements) {
    let unreadMessagesExists = await element.findElements(By.xpath('div[1]/div[2]/div[2]/div[2]/span[1]/div/span'));

    // Check if they found the span where the unread message number is
    let spanExists = (unreadMessagesExists.length > 0);

    // Check if the span is a number, because sometimes the mute
    // notification is inside span 
    let spanIsNum = (spanExists) ? 
      (parseInt(await unreadMessagesExists[0].getText()) > 0) : false;

    if(spanIsNum) {
      unreadChats.push(element);
    }
    
  }
  return unreadChats;
};

//**********************
//       Actions
//**********************
//
const sendMessageToDB = (message) => {

};



start()
