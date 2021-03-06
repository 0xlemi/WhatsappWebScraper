import helper from './Helpers.js'



const hasReply = async (element) => {

}

const text = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div[contains(@class, "_3ExzF")]/span[@dir="ltr"]');
}

const image = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div[contains(@class, "_2p30Q") and position()=last()]/img');
}

const voiceNote = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div/div[contains(@class, "sQ3Ia")]/audio');
}

// There is an issue that the link gets overwritten too soon to be able to record it
const stickerGif = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/img[contains(@class, "_1guNH")]');
}

const stickerImage = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/img[contains(@class, "_1guNH")]');
}

const gif = async (element) => {

}

const location = async (element) => {

}

const contact = async (element) => {

}

const document = async (element) => {

}

// Unsuported at the moment
const doubleStackedSticker = async (element) => {
  let elementAttribute = null;
  if (elementAttribute = await element.getAttribute('data-id')) {
    if (elementAttribute.includes('grouped-sticker')) {
      return element;
    }
  }
  return undefined;

}

const multiImage = async (element) => {
  let elementAttribute = null;
  if (elementAttribute = await element.getAttribute('data-id')) {
    if (elementAttribute.includes('album-true')) {
      return element;
    }
  }
  return undefined;
}

const video = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div/span[@data-testid="media-play"]');
}


const dateDivider = async (element) => {
  return await helper.findElementSafe(element, 'div/span[@dir="auto"]');
}

const groupChat = async (element) => {
  let span = null;
  if (span = await helper.findElementSafe(element, '//div[@id="main"]/header/div/div/span')) {
    let text = await span.getText();
    return text.includes(', ');
  }
  return false
}

const Conditionals = {
  hasReply,
  text,
  image,
  voiceNote,
  stickerGif,
  stickerImage,
  gif,
  location,
  contact,
  document,
  doubleStackedSticker,
  multiImage,
  video,
  dateDivider,
  groupChat
};


export default Conditionals;

