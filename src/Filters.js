

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


const Filters = {
  onlyChatsWithUnreadMessages
}

export default Filters;
