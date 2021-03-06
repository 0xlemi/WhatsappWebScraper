import helper from './Helpers.js'


// Transforms web elements into objects with title and unreadMessages
// @param array of webElements
// @returns array of Objects
/*
const chat = async (chats) => {
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
};
*/

const getTime = async (message, xpath = 'div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]') => {
  let time = await helper.findElementSafe(message, xpath);
  if (time) {
    return await time.getText();
  };
  return time;
};

const getAuthor = async (message, xpath, overwriteAuthor = null) => {
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
  
  let author = await helper.findElementSafe(message, xpath);
  if (author) {
    return await author.getText();
  }
  return author;
};

const textMessage = async (text, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/span[@dir="auto"]', 
    overwriteAuthor
  );
  let time = await getTime(message);

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

const image = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(
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

const voiceNote = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(message);

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

const video = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(
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

const stickerImage = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(
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

const stickerGif = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(
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

const dateDivider = async (message) => {
  let date = await helper.findElementSafe(message, 'div/span[@dir="auto"]');
  if (date) {
    date = await date.getText();
  }

  return {date: date};
};


const Transformers = {
  //chat,
  getTime,
  getAuthor,
  textMessage,
  image,
  voiceNote,
  video,
  stickerImage,
  stickerGif,
  dateDivider
};


export default Transformers;
