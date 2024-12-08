import React, { useState } from "react";
import {
	View,
	Image,
	StyleSheet,
	TextInput,
	Text,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { setUserData } from "./UserData";

export const LogSign = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedLanguageKnow = "", selectedLanguageLearn = "" } =
		route.params || {};
	const [register, setRegister] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [gender, setGender] = useState("");

	const db = firebase.firestore();
	const usersCollection = db.collection("users");

	const [isPressedMan, setIsPressedMan] = useState(false);
	const toggleButtonStateMan = () => {
		setGender("Man");
		setIsPressedMan(!isPressedMan);
		setIsPressedWoman(false);
	};
	const [isPressedWoman, setIsPressedWoman] = useState(false);
	const toggleButtonStateWoman = () => {
		setGender("Woman");
		setIsPressedWoman(!isPressedWoman);
		setIsPressedMan(false);
	};
	const stylePressedMan = isPressedMan
		? styles.buttonPressed
		: styles.buttonNotPressed;
	const stylePressedWoman = isPressedWoman
		? styles.buttonPressed
		: styles.buttonNotPressed;
	const registerUser = async () => {
		try {
			//auth
			const userCredential = await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password);
			const userId = userCredential.user.uid;

			//save user
			await usersCollection.doc(userId).set({
				uid: userId,
				email: email,
				languageKnow: selectedLanguageKnow,
				languageToLearn: selectedLanguageLearn,
				gender: gender,
				name: name,
			});
			console.log("Usuario registrado correctamente");
			setIsPressedMan(false);
			setIsPressedWoman(false);
			setUserData(email);
			setName("");
			setEmail("");
			setPassword("");

			//return to MainPage the lang
			navigation.navigate("MainPage");
		} catch (error) {
			console.error("Error al registrar el usuario:", error);
		}
	};

	const loginUser = async () => {
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
			//send mail to UserMail (to use on management)
			setUserData(email);
			console.log("Éxito al iniciar sesión");
			navigation.navigate("MainPage");
		} catch (error) {
			console.error(error);
			console.log("Fallo al iniciar sesión");
		}
	};

	const handleClick = () => {
		setRegister(!register);
	};

	return (
		<View style={styles.container}>
			<View style={styles.container2}>
				<Image style={styles.image} source={require("../assets/Logo-tb.png")} />
			</View>
			{register ? (
				<View style={styles.square1}>
					<Text style={styles.title}>Bienvenido/a de nuevo</Text>
					<Text style={styles.subtitle1}>¿Ya tienes cuenta TalkBridge?</Text>
					<Text style={styles.subtitle2}>Ingresa tus datos:</Text>
					<View style={styles.inputGlobal}>
						<TextInput
							placeholder="Email..."
							style={styles.textInput1}
							value={email}
							onChangeText={setEmail}
						/>
						<TextInput
							placeholder="Password"
							style={styles.textInput2}
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					<TouchableOpacity style={styles.squareButton} onPress={loginUser}>
						<Text style={styles.buttonText}>Iniciar Sesión</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.square1}>
					<Text style={styles.title}>Bienvenido/a</Text>
					<Text style={styles.subtitle}>Ingresa tus datos:</Text>
					<Text style={styles.section}>¿CÓMO QUIERES QUE TE VEAN?</Text>
					<View style={styles.inputGlobal2}>
						<TouchableOpacity
							style={stylePressedMan}
							onPress={toggleButtonStateMan}
						>
							<Image
								style={styles.skinButtonImg}
								source={require("../assets/skins/man.png")}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={stylePressedWoman}
							onPress={toggleButtonStateWoman}
						>
							<Image
								style={styles.skinButtonImg}
								source={require("../assets/skins/woman.png")}
							/>
						</TouchableOpacity>
						<TextInput
							placeholder="Nombre..."
							style={styles.textInput3}
							value={name}
							onChangeText={setName}
						/>
					</View>
					<Text style={styles.section}>CREDENCIALES</Text>
					<View style={styles.inputGlobal}>
						<TextInput
							placeholder="Email..."
							style={styles.textInput1}
							value={email}
							onChangeText={setEmail}
						/>
						<TextInput
							placeholder="Password"
							style={styles.textInput2}
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					<TouchableOpacity
						style={styles.squareButtonLang}
						onPress={() => navigation.navigate("LangSelect")}
					>
						<Text style={styles.buttonTextLang}>SELECCIÓN DE IDIOMAS</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.squareButton} onPress={registerUser}>
						<Text style={styles.buttonText}>Regístrate</Text>
					</TouchableOpacity>
				</View>
			)}
			<TouchableOpacity style={styles.squareButtonOut} onPress={handleClick}>
				<Text style={styles.buttonOutText}>
					{register
						? "¿No tienes cuenta? Regístrate"
						: "¿Ya tienes cuenta? Inicia Sesión"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#333A73",
		alignItems: "center",
	},
	container2: {
		marginTop: 90,
	},
	image: {
		width: 100,
		height: 100,
		alignContent: "center",
		alignItems: "center",
	},
	square1: {
		backgroundColor: "#D7D8FF",
		marginTop: 50,
		justifyContent: "high",
		alignItems: "center",
		height: 600,
		width: 400,
		borderRadius: 20,
	},
	title: {
		textAlign: "center",
		marginTop: 70,
		fontSize: 60,
		fontWeight: "bold",
		color: "#333A73",
	},
	subtitle1: {
		fontSize: 25,
		marginTop: 30,
		color: "#333A73",
	},
	subtitle2: {
		fontSize: 15,
		marginTop: 40,
		color: "#333A73",
	},
	section: {
		marginTop: 25,
		fontWeight: "bold",
		color: "#333A73",
	},
	inputGlobal: {
		backgroundColor: "#D7DBFF",
		marginTop: 10,
		borderWidth: 1,
		borderRadius: 20,
		width: 350,
		shadowColor: "#333A73",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 1,
		shadowRadius: 20,
	},
	inputGlobal2: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		borderWidth: 1,
		borderRadius: 20,
		width: 350,
		height: 90,
		backgroundColor: "#D7DBFF",
		shadowColor: "#333A73",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 1,
		shadowRadius: 10,
		elevation: 10,
	},
	skinButtonImg: {
		width: 60,
		height: 65,
	},
	buttonPressed: {
		backgroundColor: "#333A73",
		marginLeft: 20,
		borderRadius: 20,
		width: 65,
		height: 80,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonNotPressed: {
		marginLeft: 20,
		borderRadius: 20,
		width: 65,
		height: 80,
		alignItems: "center",
		justifyContent: "center",
	},
	skinButtonText: {
		color: "#D7DBFF",
		textAlign: "center",
		fontSize: 15,
	},
	textInput1: {
		marginTop: 10,
		marginBottom: 20,
		marginLeft: 10,
		marginRight: 10,
		color: "#333A73",
	},
	textInput2: {
		marginBottom: 10,
		marginLeft: 10,
		marginRight: 10,
	},
	textInput3: {
		width: 150,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 10,
	},
	squareButton: {
		marginTop: 50,
		backgroundColor: "#333A73",
		borderRadius: 20,
		width: 200,
		height: 45,
		justifyContent: "center",
	},
	squareButtonLang: {
		marginTop: 20,
		backgroundColor: "#333A73",
		borderRadius: 20,
		width: 220,
		height: 25,
		justifyContent: "center",
	},
	buttonText: {
		color: "#D7DBFF",
		textAlign: "center",
		fontSize: 20,
	},
	buttonTextLang: {
		color: "#D7DBFF",
		textAlign: "center",
		fontSize: 15,
	},
	squareButtonOut: {
		marginTop: 10,
		backgroundColor: "#D7DBFF",
		borderRadius: 20,
		width: 370,
		height: 35,
		justifyContent: "center",
	},
	buttonOutText: {
		color: "#333A73",
		textAlign: "center",
		fontSize: 20,
	},
});
