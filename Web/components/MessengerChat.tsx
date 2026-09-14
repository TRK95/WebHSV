import appConfigs from "../config/appConfigs.json";
import MessengerCustomerChat from "react-messenger-customer-chat";

const facebookId = "111554468400664";

const MessengerChat = () => {
  return facebookId
    ? <>
      <MessengerCustomerChat
        pageId={`${facebookId}`}
        appId=""
      />
    </>
    : <></>
}

export default MessengerChat;