import React from "react";
import { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

export const LoadingScreen = ({ navigation }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.replace("LogSign");
		}, 3000);

		return () => clearTimeout(timer);
	}, [navigation]);
	return (
		<View style={styles.container}>
			<Image style={styles.image} source={require("../assets/Logo-tb.png")} />
			<ActivityIndicator size="small" color="#333A73" />
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#D7DBFF",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		borderColor: "#333A73",
		height: 400,
		width: 400,
	},
});
