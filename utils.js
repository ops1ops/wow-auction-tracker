const BRONZE_DIVISION = 100;
const SILVER_DIVISION = BRONZE_DIVISION ** 2;

const convertBlizzardPrice = (price) => {
  const goldAmount = price / SILVER_DIVISION;
  const silverAmount = Math.round(price % SILVER_DIVISION / BRONZE_DIVISION);

  return { gold: goldAmount, silver: silverAmount };
};

const getThousandsPart = (number) => Math.round(number / 1000);

const checkPricesEqualityByGold = (price, priceToCompare) => {
  const { gold } = convertBlizzardPrice(price);
  const { gold: goldToCompare } = convertBlizzardPrice(priceToCompare);

  return getThousandsPart(gold) !== getThousandsPart(goldToCompare);
};

const getWowTokenApiUrl = (token) =>
  `https://eu.api.blizzard.com/data/wow/token/index?namespace=dynamic-eu&locale=en_US&access_token=${token}`;

module.exports = {
  convertBlizzardPrice,
  getThousandsPart,
  checkPricesEqualityByGold,
  getWowTokenApiUrl,
};
