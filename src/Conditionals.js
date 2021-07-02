import helper from './Helpers.js'


const hasSpinnerTop = async (driver) => {
  return await findElementSafe(driver, '//div[contains(@class, "_2hDby")]/div[contains(@class, "_3M4BR") and contains(@title="loading messages…")]/svg');
};

const hasSpinnerImage = async (driver) => {
  return await findElementSafe(driver, '//div[contains(@class, "_2hDby")]/div[contains(@class, "_3M4BR") and contains(@title="loading messages…")]/svg');
};

const hasReply = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div[contains(@class, "_3Ppzm") and @role="button"]');
};

const replyText = async (reply) => {
  return await helper.findElementSafe(reply, 'div/div/div[contains(@class, "_31DtU")]/span[contains(@class, "quoted-mention")]');
};

const replyImage = async (reply) => {
  return await helper.findElementSafe(reply, 'div/div/div/div[contains(@class, "status-image")]/span[@data-icon="status-image"]');
};

const replyVideo = async (reply) => {
  return await helper.findElementSafe(reply, 'div/div/div/div[contains(@class, "status-video")]/span[@data-icon="status-video"]');
};

const replyVoiceNote = async (reply) => {
  return await helper.findElementSafe(reply, 'div/div/div/div[contains(@class, "status-ptt")]/span[@data-icon="status-ptt"]');
};

const replyStickerGif = async (reply) => {
  return await helper.findElementSafe(reply, 'div/div/div[contains(@class, "_31DtU")]/div[1]/img[1]');
};

const replyStickerImage = async (reply) => {
  return await helper.findElementSafe(reply, 'div/div/div[contains(@class, "_31DtU")]/img[1]');
};

const text = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div[contains(@class, "_3ExzF")]/span[@dir="ltr"]');
};

const image = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div[contains(@class, "_2p30Q") and position()=last()]/img');
};

const voiceNote = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div/div[contains(@class, "sQ3Ia")]/audio');
};

// There is an issue that the link gets overwritten too soon to be able to record it
const stickerGif = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/img[contains(@class, "_1guNH")]');
};

const stickerImage = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/img[contains(@class, "_1guNH")]');
};

const gif = async (element) => {
  // Not Supported yet
};

const location = async (element) => {
  // Not Supported yet
};

const contact = async (element) => {
  // Not Supported yet
};

const document = async (element) => {
  // Not Supported yet
};

// Unsuported at the moment
const doubleStackedSticker = async (element) => {
  let elementAttribute = null;
  if (elementAttribute = await element.getAttribute('data-id')) {
    if (elementAttribute.includes('grouped-sticker')) {
      return element;
    }
  }
  return undefined;

};

const multiImage = async (element) => {
  let elementAttribute = null;
  if (elementAttribute = await element.getAttribute('data-id')) {
    if (elementAttribute.includes('album-')) {
      return element;
    }
  }
  return undefined;
};

const video = async (element) => {
  return await helper.findElementSafe(element, 'div/div/div/div/div/div/div/span[@data-testid="media-play"]');
};

const dateDividerShows = async (element, string) => {
  let dateDivider = await helper.
    findElementSafe(element, 'div[contains(@class, "_24wtQ")]/span[@dir="auto"]').
    getText();
};

const dateDivider = async (element) => {
  return await helper.findElementSafe(element, 'div[contains(@class, "_24wtQ")]/span[@dir="auto"]');
};

const groupChat = async (element) => {
  let span = null;
  if (span = await helper.findElementSafe(element, '//div[@id="main"]/header/div/div/span')) {
    let text = await span.getText();
    return text.includes(', ');
  }
  return false
};

const Conditionals = {
  hasSpinnerTop,
  hasSpinnerImage,
  hasReply,
  replyText,
  replyImage,
  replyVideo,
  replyVoiceNote,
  replyStickerImage,
  replyStickerGif,
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

