require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const { convertBlizzardPrice, getWowTokenApiUrl, getThousandsPart, getWowApiToken } = require('./utils');

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const WOW_TOKEN_THRESHOLD_PRICE = 286000;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

const sendMessage = (message) => bot.sendMessage(CHAT_ID, message);

const trackWowTokenPrice = async () => {
  try {
    const { data: { access_token } } = await getWowApiToken();

    const {
      data: { price: newPrice, last_updated_timestamp: updatedAt },
    } = await axios.get(getWowTokenApiUrl(access_token));

    const { gold } = convertBlizzardPrice(newPrice);
    const thousandsPart = getThousandsPart(gold);

    console.log(new Date().toString(), gold);

    if (gold <= WOW_TOKEN_THRESHOLD_PRICE) {
      await sendMessage(`Current price: ${thousandsPart}k gold,\nChanged at: ${new Date(updatedAt)}`);
    }
  } catch (error) {
    console.error(error);

    await sendMessage('[Error]: Something went wrong in price tracker');
  }
};

trackWowTokenPrice();
