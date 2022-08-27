require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const { convertBlizzardPrice, getWowTokenApiUrl, getThousandsPart, getBlizzardToken } = require('./utils');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const WOW_TOKEN_THRESHOLD_PRICE = Number(process.env.THRESHOLD_PRICE) || 286000;

const REQUEST_TIMEOUT = 3000;
const ABORTED_CONNECTION_CODE = 'ECONNABORTED';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

const sendMessage = (message) => bot.sendMessage(CHAT_ID, message);

const trackWowTokenPrice = async () => {
  try {
    const { data: { access_token } } = await getBlizzardToken();

    const {
      data: { price: newPrice, last_updated_timestamp: updatedAt },
    } = await axios.get(getWowTokenApiUrl(access_token), {timeout: REQUEST_TIMEOUT});

    const { gold } = convertBlizzardPrice(newPrice);

    console.log(new Date().toString(), '\nPrice: ', gold);

    if (gold <= WOW_TOKEN_THRESHOLD_PRICE) {
      const thousandsPart = getThousandsPart(gold);

      await sendMessage(`Current price: ${thousandsPart}k gold,\nChanged at: ${new Date(updatedAt)}`);
    }
  } catch (error) {
    if (error.code === ABORTED_CONNECTION_CODE) return;

    console.error(error);

    await sendMessage(`[Error]: ${error.message}`);

    process.exit(5);
  }
};

trackWowTokenPrice();
