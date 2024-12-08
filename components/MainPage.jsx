import React, { useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	FlatList,
	Modal,
	Button,
	Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { ReturnButton } from "./ReturnMain";
import FlagMap from "./FlagMap";
import { useRoute } from "@react-navigation/native";

export const MainPage = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const [matches, setMatches] = useState([]);
	const [settings, setSettings] = useState(false);
	const [languageLearnShow, setLanguageLearnShow] = useState("");
	const [languageKnowShow, setLanguageKnowShow] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [detailPerson, setDetailPerson] = useState([]);

	useEffect(() => {
		const fetchMatches = async () => {
			const user = firebase.auth().currentUser;
			if (user) {
				const db = firebase.firestore();
				const usersCollection = db.collection("users");
				try {
					const userDoc = await usersCollection.doc(user.uid).get();
					const userData = userDoc.data();
					const languageKnow = userData.languageKnow;
					const languageToLearn = userData.languageToLearn;
					setLanguageLearnShow(languageToLearn);
					setLanguageKnowShow(languageKnow);
					const querySnapshot = await usersCollection
						.where("languageKnow", "==", languageToLearn)
						.where("languageToLearn", "==", languageKnow)
						.get();
					const userMatches = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						email: doc.data().email,
						gender: doc.data().gender,
						name: doc.data().name,
					}));

					setMatches(userMatches);
				} catch (error) {
					console.error("Error fetching matches: ", error);
				}
			}
		};

		fetchMatches();
	}, []);

	const appeareManagement = () => {
		navigation.navigate("Management", {
			languageKnow: languageKnowShow,
			languageLearn: languageLearnShow,
		});
		setSettings(false);
	};

	//settings
	const appeareSettings = () => setSettings(!settings);

	const logOutUser = async () => {
		try {
			await firebase.auth().signOut();
			console.log("Usuario ha cerrado la sesión");
			navigation.navigate("LogSign");
		} catch (error) {
			console.error("Error al cerrar sesión: ", error);
		}
	};

	//modal to show details
	const openModal = () => setModalVisible(true);
	const closeModal = () => setModalVisible(false);

	const handelPeopleClick = async (email) => {
		const user = firebase.auth().currentUser;
		if (!user) {
			console.log("usuario no elegido correctamente");
			return;
		}
		const db = firebase.firestore();
		const usersCollection = db.collection("users");
		try {
			const personDoc = await usersCollection.doc(user.uid).get();
			const personDocData = personDoc.data();

			const queryDetails = await usersCollection
				.where("email", "==", email)
				.get();

			const personDetail = queryDetails.docs.map((doc) => ({
				id: doc.id,
				email: doc.data().email,
				gender: doc.data().gender,
				name: doc.data().name,
			}));
			setDetailPerson(personDetail[0]);
			openModal();
		} catch (error) {
			console.error("Error on fetching details", error);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.square1}>
				<ReturnButton setSettings={setSettings} />
				<View style={styles.squareLogo}>
					<Image
						style={styles.image1}
						source={require("../assets/Logo-tb.png")}
					/>
				</View>
				<TouchableOpacity style={styles.settings} onPress={appeareSettings}>
					<Image
						style={styles.imageSettings}
						source={require("../assets/buttons/settings.png")}
					/>
				</TouchableOpacity>
			</View>

			{settings ? (
				<View style={styles.square2}>
					<View style={styles.squareOptions1}>
						<TouchableOpacity
							style={styles.options}
							onPress={appeareManagement}
						>
							<Image
								style={styles.options}
								source={require("../assets/buttons/personal.png")}
							/>
							<Text style={styles.textOption}>Gestión de Usuario</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.options} onPress={logOutUser}>
							<Image
								style={styles.options}
								source={require("../assets/buttons/close.png")}
							/>
							<Text style={styles.textOption}>Cerrar Sesión</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<View style={styles.square2}>
					<Text style={styles.matchespreTitle}> Personas que saben: </Text>
					<Image source={FlagMap[languageLearnShow]} style={styles.flag} />
					<Text style={styles.matchespreTitle}>Y quieren aprender: </Text>
					<Image source={FlagMap[languageKnowShow]} style={styles.flag} />

					<Text style={styles.matchesTitle}>Usuarios esperándote:</Text>

					<FlatList
						contentContainerStyle={styles.matches}
						data={matches}
						keyExtractor={(item) => item.email}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.matchBox}
								onPress={() => handelPeopleClick(item.email)}
							>
								{item.gender === "Man" ? (
									<Image
										style={styles.matchImg}
										source={require("../assets/skins/man.png")}
									/>
								) : (
									<Image
										style={styles.matchImg}
										source={require("../assets/skins/woman.png")}
									/>
								)}
								<Text style={styles.matchItem}>{item.name}</Text>
							</TouchableOpacity>
						)}
					/>
					<Modal
						animationType="fade"
						transparent={true}
						visible={modalVisible}
						onRequestClose={closeModal}
					>
						<Pressable style={styles.modalBackground} onPress={closeModal}>
							<Pressable style={styles.modalGeneral}>
								{detailPerson.gender === "Man" ? (
									<Image
										style={styles.detailpersonImg}
										source={require("../assets/skins/man.png")}
									/>
								) : (
									<Image
										style={styles.detailpersonImg}
										source={require("../assets/skins/woman.png")}
									/>
								)}
								<Text style={styles.detailPersonName}>{detailPerson.name}</Text>
								<Text style={styles.detailPersonMidle}>Datos de contacto:</Text>
								<Text style={styles.detailPersonEmail}>
									{detailPerson.email}
								</Text>
								<Button title="Cerrar" onPress={closeModal} />
							</Pressable>
						</Pressable>
					</Modal>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#333A73",
	},
	square1: {
		position: "relative",
		flexDirection: "row",
		marginTop: 70,
		height: 80,
		padding: 20,
		backgroundColor: "#333A73",
		alignItems: "center",
		justifyContent: "space-between",
	},
	squareLogo: {
		flex: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	image1: {
		height: 65,
		width: 65,
	},
	settings: {
		width: 30,
		height: 30,
	},
	imageSettings: {
		width: 30,
		height: 30,
	},
	square2: {
		height: 800,
		backgroundColor: "#D7DBFF",
		borderRadius: 20,
		alignItems: "center",
	},
	matchespreTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#333A73",
		textAlign: "center",
		marginTop: 20,
	},
	matchesTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333A73",
		textAlign: "center",
		marginTop: 20,
	},
	matchItem: {
		fontSize: 18,
		color: "#333A73",
		textAlign: "center",
		marginVertical: 5,
	},
	matches: {
		flexDirection: "row",
		justifyContent: "space-between",
		margin: 20,
		padding: 10,
		borderWidth: 1,
		borderRadius: 20,
		width: 350,
		height: 550,
		backgroundColor: "#D7DBFF",
		shadowColor: "#333A73",
		shadowOffset: { width: 1, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 10,
	},
	matchBox: {
		flexDirection: "column",
		borderWidth: 1,
		borderRadius: 20,
		height: 100,
		width: 155,
		alignItems: "center",
		margin: 2,
	},
	matchImg: {
		margin: 5,
		height: 60,
		width: 60,
	},
	squareOptions: {
		flexDirection: "row",
		marginTop: 100,
		alignItems: "center",
	},
	squareOptions1: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 20,
	},
	textOption: {
		marginTop: 10,
		textAlign: "center",
	},
	options: {
		width: 80,
		height: 80,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 40,
		marginTop: 20,
	},

	flag: {
		marginTop: 10,
		height: 20,
		width: 20,
	},
	modalGeneral: {
		margin: 40,
		marginTop: 340,
		width: 350,
		height: 555,
		backgroundColor: "#333A73",
		borderRadius: 20,
		alignItems: "center",
	},
	modalBackground: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	detailpersonImg: {
		marginTop: 40,
		width: 150,
		height: 150,
	},
	detailPersonName: {
		marginTop: 40,
		color: "#D7DBFF",
		fontSize: "30",
		fontWeight: "bold",
	},
	detailPersonMidle: {
		color: "rgba(124, 124, 124, 1)",
		marginTop: 50,
		marginBottom: 20,
	},
	detailPersonEmail: {
		color: "#D7DBFF",
		fontSize: "20",
		marginBottom: 130,
	},
});
