import helper from './Helpers.js'
import check from './Conditionals.js'


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

const replyText = async (element) => {
  let replyText = await helper.
    findElementSafe(
      element,
      'div/div/div[contains(@class, "_31DtU")]/span[@dir="auto"]'
    );

  if(replyText){
    replyText = await replyText.getText();
  }

  return replyText;
};

const replyImage = async (element) => {
  let media = await helper.
    findElementSafe(
      element,
      'div/div/div[contains(@class, "_1VwF0")]/div[1]/div'
    );

  if(media){
    media = await media.getAttribute("style");
  }

  return media;
};

const replyVideo = async (element) => {
  let media = await helper.
    findElementSafe(
      element,
      'div/div[contains(@class, "_16BuV")]/div[1]'
    );

  if(media){
    media = await media.getAttribute("style");
  }

  return media;

};

const replyVoiceNote = async (element) => {
  let length = await helper.
    findElementSafe(
      element,
      'div/div/div[contains(@class, "_31DtU")]/span'
    );

  if(length){
    length = await length.getText();
  }

  return length;

};

const replySticker = async (media) => {
  if(media){
    media = await media.getAttribute("src");
  }

  return media;
};

const getReply = async (reply) => {

  let replyAuthor = await helper.
    findElementSafe(
      reply, 
      'div/div/div[contains(@class, "_26iqs")]/span[@dir="auto"]'
    );

  let replyValue = null;
  let type = null;
  
  if(await check.replyImage(reply)) {
    replyValue = await replyImage(reply);
    type = 'image';

  }else if(await check.replyVideo(reply)) {
    replyValue = await replyVideo(reply);
    type = 'video';

  }else if(await check.replyVoiceNote(reply)) {
    replyValue = await replyVoiceNote(reply);
    type = 'voice-note';

  }else if(await check.replyStickerImage(reply)) {
    replyValue = await replySticker(reply);
    type = 'sticker-image';

  }else if(await check.replyStickerGif(reply)) {
    replyValue = await replySticker(reply);
    type = 'sticker-gif';

  }else if(await check.replyText(reply)) {
    replyValue = await replyText(reply);
    type = 'text';
  }

  
  if(replyAuthor && replyText) {
    return { 
      author: await replyAuthor.getText(),
      type: type, 
      value: replyValue, 
    };
  }
  
  return undefined;
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

  let reply = await check.hasReply(message);
  if (reply) {
    reply = await getReply(reply);
  }

  return {
    type: "text",
    author: author,
    time: time,
    value: text,
    reply: reply
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

  // Check if image has text below it.
  let text = await helper.findElementSafe(message, 'div/div/div/div/div/div[contains(@class, "_3ExzF")]/span[@dir="ltr"]');
  if(text) {
    text = await text.getText();
  }

    if(media){
    media = await media.getAttribute("src");
  }

  let reply = await check.hasReply(message);
  if (reply) {
    reply = await getReply(reply);
  }

  return {
    type: "image",
    author: author,
    time: time,
    value: { src: media, text: text },
    reply: reply
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

  let reply = await check.hasReply(message);
  if (reply) {
    reply = await getReply(reply);
  }

  return {
    type: "voice-note",
    author: author,
    time: time,
    value: media,
    reply: reply
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

  let reply = await check.hasReply(message);
  if (reply) {
    reply = await getReply(reply);
  }

  return {
    type: "video",
    author: author,
    time: time,
    value: "Currently not Suported",
    reply: reply
  };

};

const multiImage = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(
    message, 
    'div/div/div/div/div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]'
  );

  if(media){
    // Run video media extraction code here
    media = null;
  }

  return {
    type: "multi-image",
    author: author,
    time: time,
    value: "Currently not Suported",
  };

};

const doubleStackedSticker = async (media, message, overwriteAuthor = null) => {
  let author = await getAuthor(
    message, 
    'div/div/div/span[@dir="auto"]',
    overwriteAuthor
  );
  let time = await getTime(
    message, 
    'div/div/div/div/div/div/div/div[contains(@class, "UFTvj")]/span[@dir="auto"]'
  );

  if(media){
    // Run video media extraction code here
    media = null;
  }

  return {
    type: "double-stacked-sticker",
    author: author,
    time: time,
    value: "Currently not Suported",
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

  let reply = await check.hasReply(message);
  if (reply) {
    reply = await getReply(reply);
  }

  return {
    type: "sticker-img",
    author: author,
    time: time,
    value: media,
    reply: reply
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

  let reply = await check.hasReply(message);
  if (reply) {
    reply = await getReply(reply);
  }

  return {
    type: "sticker-gif",
    author: author,
    time: time,
    value: media,
    reply: reply
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
  multiImage,
  doubleStackedSticker,
  stickerImage,
  stickerGif,
  dateDivider
};


export default Transformers;
