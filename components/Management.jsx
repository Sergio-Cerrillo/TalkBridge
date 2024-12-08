import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import FlagMap from "./FlagMap";
import SkinShow from "./SkinShow";
import GenderReveal from "./GenderReveal";
import DeleteUserButton from "./DeleteUserButton";

export const Management = () => {
	const route = useRoute();
	const { languageKnow, languageLearn } = route.params;
	const [details, setDetails] = useState({});
	const navigation = useNavigation();

	//get Data with email

	useEffect(() => {
		const fetchDetails = async () => {
			const user = firebase.auth().currentUser;
			if (user) {
				const db = firebase.firestore();
				const usersCollection = db.collection("users");
				try {
					const userDoc = await usersCollection.doc(user.uid).get();
					if (userDoc.exists) {
						const userData = userDoc.data();
						setDetails(userData);
					} else {
						console.log("Not found user data");
					}
				} catch (error) {
					console.error("Error obtain details", error);
				}
			}
		};
		fetchDetails();
	}, []);

	const returnMain = () => {
		navigation.navigate("MainPage");
	};

	return (
		<View style={styles.container}>
			<View style={styles.square1}>
				<SkinShow gender={details.gender} style={styles.detailsImg} />
				<View style={styles.squareMin}>
					<Text style={styles.text}>Nombre:</Text>
					<Text style={styles.textMin}>
						{details.name ? details.name : "No disponible"}
					</Text>

					<Text style={styles.text}>Género:</Text>
					<GenderReveal gender={details.gender} style={styles.textMin} />
					<Text style={styles.text}>Correo Electrónico:</Text>
					<Text style={styles.textMin}>
						{details.email ? details.email : "No disponible"}
					</Text>
					<Text style={styles.text}>Idioma que conozco:</Text>
					<Image style={styles.flag} source={FlagMap[languageKnow]} />

					<Text style={styles.text}>Idioma que quiero aprender: </Text>
					<Image style={styles.flag} source={FlagMap[languageLearn]} />
				</View>
			</View>
			<View style={styles.square2}>
				<DeleteUserButton
					styleButton={styles.options}
					styleText={styles.textOption}
				/>

				<TouchableOpacity style={styles.options} onPress={returnMain}>
					<Image
						style={styles.options}
						source={require("../assets/buttons/return.png")}
					/>
					<Text styleText={styles.textOption}>Volver al menú</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.footer}>
				<Text style={styles.text2}>©2024 - TalkBridge</Text>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#D7DBFF",
	},
	square1: {
		backgroundColor: "#333A73",
		alignItems: "center",
		marginBottom: 20,
		marginRight: 30,
		borderRadius: 20,
		padding: 10,
		marginTop: 80,
		marginLeft: 30,
		shadowColor: "D7DBFF",
		shadowOffset: { width: 1, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 10,
	},
	squareMin: {
		marginBottom: 40,
		alignItems: "center",
	},
	text: {
		fontSize: 15,
		lineHeight: 20,
		color: "#D7DBFF",
		fontWeight: "bold",
		marginTop: 15,
	},
	textMin: {
		fontWeight: "400",
		color: "rgba(153, 153, 153, 0.8)",
	},
	square2: {
		justifyContent: "center",
		flexDirection: "row",
	},
	options: {
		width: 80,
		height: 80,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 40,
		marginTop: 20,
		marginBottom: 10,
	},
	textOption: {
		textAlign: "center",
		color: "#333A73",
	},
	flag: {
		height: 25,
		width: 25,
	},
	footer: {
		marginTop: 550,
	},
	text2: {
		textAlign: "center",
	},
	detailsImg: {
		marginTop: 40,
		width: 200,
		height: 200,
	},
});
