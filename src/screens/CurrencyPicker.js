import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import { Styles } from "../styles";
import dataCurrency from "../constants/CommonCurrency.json";
import { DialogCurrency } from "../components";
import { CurrencyFlag } from "../components/CurrencyFlag";

export const CurrencyPicker = (props) => {
	const {
		onSelectCurrency,
		currencyCode,
		showFlag = true,
		showCurrencyName = true,
		withSearch = true,
		showSymbol = false,
		showNativeSymbol = true,
		showNativeSymbolModal = true,
		darkMode = true,
		currenciesData,
		renderChildren,
		showCurrencyCode = true,

		currencyPickerRef,
		enable = true,
		onOpen,
		onClose,

		containerStyle = {},
		modalStyle = {},
		title,
		searchPlaceholder,
		textEmpty,
		showCloseButton = true,
		showModalTitle = true,
	} = props;

	const currencies = Object.values(dataCurrency);

	const [currencyName, setCurrencyName] = useState("US Dollar");
	const [code, setCode] = useState("USD");
	const [symbol, setSymbol] = useState("$");
	const [symbolNative, setSymbolNative] = useState("$");
	const [visible, setVisible] = useState(false);

	const {
		container,
		flagWidth = 25,
		currencyCodeStyle,
		currencyNameStyle,
		symbolStyle,
		symbolNativeStyle,
	} = containerStyle;

	useEffect(() => {
		let currency;
		currencyPickerRef && currencyPickerRef(currencyRef);

		if (currencyCode) {
			currency = currencies.filter((item) => item.code === currencyCode)[0];
		}

		if (currency) {
			const { code, symbol, symbol_native, name } = currency;
			setCurrencyName(name);
			setCode(code);
			setSymbol(symbol);
			setSymbolNative(symbol_native);
		}
	}, [props]);

	const currencyRef = {
		open: () => {
			setVisible(true);
			onOpen && onOpen();
		},
		close: () => {
			setVisible(false);
			onClose && onClose();
		},
	};

	const onSelect = (data) => {
		const { code, symbol, symbol_native, name } = data;
		onSelectCurrency && onSelectCurrency(data);
		setCurrencyName(name);
		setCode(code);
		setSymbol(symbol);
		setSymbolNative(symbol_native);
	};

	return (
		<View>
			{enable ? (
				<TouchableOpacity
					onPress={() => {
						setVisible(true);
						onOpen && onOpen();
					}}
					style={[Styles.justifyContent, container]}
				>
					{renderChildren ? (
						renderChildren
					) : (
						<View style={{ flexDirection: "row" }}>
							{showFlag && <CurrencyFlag currency={code} width={flagWidth} />}
							{showCurrencyCode && (
								<Text
									allowFontScaling={false}
									style={[styles.txtCurrencyCode, currencyCodeStyle]}
								>
									{code}
								</Text>
							)}
							{showCurrencyName && (
								<Text
									allowFontScaling={false}
									style={[styles.txtCountryName, currencyNameStyle]}
								>
									{currencyName}
								</Text>
							)}
							{showSymbol && (
								<Text
									allowFontScaling={false}
									style={[styles.txtCountryName, symbolStyle]}
								>
									{symbol}
								</Text>
							)}
							{showNativeSymbol && (
								<Text
									allowFontScaling={false}
									style={[styles.txtCountryName, symbolNativeStyle]}
								>
									{symbolNative}
								</Text>
							)}
						</View>
					)}
				</TouchableOpacity>
			) : null}
			<Modal animated={true} animationType="slide" visible={visible}>
				<DialogCurrency
					onSelectItem={(data) => {
						onSelect(data);
					}}
					setVisible={(value) => {
						setVisible(value);
						onClose && onClose();
					}}
					title={title}
					searchPlaceholder={searchPlaceholder}
					textEmpty={textEmpty}
					darkMode={darkMode}
					withSearch={withSearch}
					modalStyle={modalStyle}
					showCloseButton={showCloseButton}
					showModalTitle={showModalTitle}
					showCurrencySymbol={showSymbol}
					showCurrencyNativeSymbol={showNativeSymbolModal}
					currenciesData={currenciesData}
					currencyCode={currencyCode}
				/>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	txtCountryName: {
		...Styles.fontDefault,
		marginLeft: 10,
	},
	txtCurrencyCode: {
		...Styles.fontDefault,
		marginLeft: 10,
	},
});
