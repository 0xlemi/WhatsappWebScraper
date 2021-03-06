import readline from 'readline';
import helper from './src/Helpers.js';
import get from './src/Extractors.js';
import is from './src/Conditionals.js';
import transform from './src/Transformers.js';

async function start() {
  
  // Log Into Phone and take picture of QR code
  //

  let driver = await helper.startUp();
  console.log("driver ready !!");

  //await driver.sleep(15000)

  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  let readLineFunction = () => {
    rl.question("Read Messages ? (yes/exit) ", async (answer) => {
      if (answer == 'yes') {
        console.log(await processMessages(await get.messages(driver)));
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
  
  
  //const element = driver.findElement(By.className('Ui--U'));
  //assert.strictEqual(await element.getText(), 'Keep your phone connected');
  //const sideBar = driver.findElement(By.id('pane-side'));
  //const text = await driver.executeScript('return document.documentElement.innerText')
  //driver.quit()
}

const processMessages = async (messages) => {
  let objectsArray = [];

  // If is not a group chat is a personal chat 
  // and the sender is always the same
  let author = null;
  if(! await is.groupChat(messages[0])) {
    let authorElement = await helper.findElementSafe(
      messages[0], 
      '//div[@id="main"]/header/div/div/div/span[@dir="auto"]'
    );
    author = await authorElement.getText();
  }

  for(let message of messages) {

    //console.log(message);
    
    //let reply = null;
    //if(await is.hasReply(message)) {

    //}
    let content = null;
    if(content = await is.text(message)) {

      objectsArray.push(await transform.textMessage(content, message, author));

    }else if(await is.dateDivider(message)) {

      objectsArray.push(await transform.dateDivider(message));

    }else if(content = await is.voiceNote(message)) {

      objectsArray.push(await transform.voiceNote(content, message, author));

    }else if(content = await is.image(message)) {

      objectsArray.push(await transform.image(content, message, author));

    }else if(content = await is.stickerGif(message)) {

      objectsArray.push(await transform.stickerGif(content, message, author));

    }else if(content = await is.stickerImage(message)) {

      objectsArray.push(await transform.stickerImage(content, message, author));

    }else if(await is.video(message)) {

      objectsArray.push(await transform.video(null, message, author));

//    }else if(await is.multiImage(message)) {
//      objectsArray.push({
//       type: "multi-image",
//       info: "not supported yet"
//     });
   }else if(await is.doubleStackedSticker(message)) {
     objectsArray.push({
       type: "double-stacked-sticker",
       info: "not supported yet"
     });
    }


  }
  return objectsArray;
};

const getNumNewMessages = () => {

};


const sendMessageToDB = (message) => {

};



start()
