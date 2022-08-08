export const filterCurrenciesData = (currencies, availableCurrencies) => {
	return availableCurrencies.filter((item) => currencies.includes(item.code));
};
