import React, { useEffect, useState, useMemo } from "react";
import {
	View,
	TouchableOpacity,
	StatusBar,
	FlatList,
	TextInput,
	Text,
} from "react-native";
import Fuse from "fuse.js";
import { Colors } from "../styles";
import data from "../constants/CommonCurrency.json";
import { getStyles } from "./styles";
import { CurrencyFlag } from "./CurrencyFlag";
import CrossLightIcon from "../assets/crossLightIcon.svg";
import { filterCurrenciesData } from "../lib/currency";

export const DialogCurrency = (props) => {
	const {
		onSelectItem,
		title = "Currency",
		searchPlaceholder = "Search",
		textEmpty = "Empty data",
		setVisible,
		darkMode = true,
		modalStyle,
		showCloseButton = true,
		showModalTitle = true,
		showCurrencySymbol = false,
		showCurrencyNativeSymbol = true,
		withSearch = true,
		currenciesData,
		currencyCode,
	} = props;
	const availableCurrencies = Object.values(data);
	const filteredCurrenciesData = useMemo(
		() =>
			currenciesData
				? filterCurrenciesData(
						Object.values(currenciesData),
						availableCurrencies
				  )
				: availableCurrencies,
		[]
	);

	const [search, setSearch] = useState("");
	const [listCurrency, setListCurrency] = useState(filteredCurrenciesData);

	const { itemStyle = {}, container, searchStyle, tileStyle } = modalStyle;

	const {
		itemContainer,
		flagWidth = 25,
		currencyCodeStyle,
		currencyNameStyle,
		symbolStyle,
		symbolNativeStyle,
	} = itemStyle;

	useEffect(() => {
		return () => {
			setSearch("");
		};
	}, []);

	const styles = getStyles(darkMode);

	const options = Object.assign({
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: ["name", "code"],
		id: "id",
	});

	const fuse = new Fuse(
		filteredCurrenciesData.reduce(
			(acc, item) => [
				...acc,
				{ id: item.code, name: item.name, code: item.code },
			],
			[]
		),
		options
	);

	const onSelect = (item) => {
		setSearch("");
		handleFilterChange("");
		if (onSelectItem) onSelectItem(item);
		setVisible(false);
	};

	const renderItemTemplate = ({ code, symbol, symbol_native, name }) => {
		const showSymbol = showCurrencySymbol || showCurrencyNativeSymbol;
		const isActive = currencyCode === code;

		return (
			<View
				style={[
					styles.item,
					itemContainer,
					isActive ? { backgroundColor: "#EEE" } : { backgroundColor: "#FFF" },
				]}
			>
				<CurrencyFlag currency={code} width={flagWidth} />
				<Text
					allowFontScaling={false}
					style={[styles.currencyName, currencyCodeStyle]}
				>
					{code}
				</Text>
				<Text
					allowFontScaling={false}
					style={[
						styles.commonName,
						showSymbol && { width: 120 },
						currencyNameStyle,
					]}
				>
					{name}
				</Text>
			</View>
		);
	};

	const renderItem = ({ item, index }) => {
		const isLastItem = listCurrency.length - 1 === index;
		return (
			<TouchableOpacity onPress={() => onSelect(item)}>
				{renderItemTemplate(item)}
			</TouchableOpacity>
		);
	};

	let _flatList = undefined;

	const handleFilterChange = (value) => {
		setSearch(value);

		let listDataFilter = [];
		if (value === "") {
			listDataFilter = filteredCurrenciesData;
		} else {
			const filteredCountries = fuse.search(value);
			if (_flatList) _flatList.scrollToOffset({ offset: 0 });
			filteredCountries.forEach((n) => {
				const item = filteredCurrenciesData.filter(
					(i) => i.code === n.item.code.toString()
				);
				if (item.length > 0) listDataFilter.push(item[0]);
			});
		}
		setListCurrency(listDataFilter);
	};

	return (
		<View style={[styles.container, container]}>
			<View style={styles.header}>
				{showModalTitle && (
					<Text allowFontScaling={false} style={[styles.titleModal, tileStyle]}>
						{title}
					</Text>
				)}
				{showCloseButton && (
					<TouchableOpacity
						onPress={() => {
							setVisible(false);
							setSearch("");
							handleFilterChange("");
						}}
						style={styles.searchClose}
					>
						<CrossLightIcon />
					</TouchableOpacity>
				)}
			</View>
			{withSearch && (
				<View style={styles.search}>
					<View style={[styles.textInputContainer, searchStyle]}>
						<TextInput
							autoFocus
							allowFontScaling={false}
							onChangeText={(text) => handleFilterChange(text)}
							value={search}
							placeholder={searchPlaceholder}
							placeholderTextColor={Colors.textFieldColor}
							style={[styles.textTitleSmallerWhite, styles.textInput]}
						/>
					</View>
				</View>
			)}
			<View style={styles.listContainer}>
				<FlatList
					keyboardShouldPersistTaps={"handled"}
					ref={(ref) => (_flatList = ref)}
					data={listCurrency}
					renderItem={renderItem}
					keyExtractor={(item) => item.code}
					ListEmptyComponent={() => (
						<View style={styles.listNullContainer}>
							<Text allowFontScaling={false} style={styles.txtEmpty}>
								{textEmpty}
							</Text>
						</View>
					)}
				/>
			</View>
		</View>
	);
};
