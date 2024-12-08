//file individual because the component will be used by diferetns files
import React from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

export const ReturnButton = ({ setSettings }) => {
	const navigation = useNavigation();
	const returnClick = () => {
		navigation.navigate("MainPage");
		console.log("Return to Main succesfuly");
		setSettings(false);
	};
	return (
		<TouchableOpacity style={styles.main} onPress={returnClick}>
			<Image
				style={styles.imageMain}
				source={require("../assets/buttons/main.png")}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	main: {
		width: 30,
		height: 30,
	},
	imageMain: {
		width: 30,
		height: 30,
	},
});

export default ReturnButton;
