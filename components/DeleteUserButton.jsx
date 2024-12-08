import React, { useState } from "react";
import {
	Text,
	TouchableOpacity,
	Image,
	Alert,
	TextInput,
	View,
} from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useNavigation } from "@react-navigation/native";

const DeleteUserButton = ({ styleButton, styleText }) => {
	const [password, setPassword] = useState("");
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const navigation = useNavigation();
	const handleDeleteAccount = async () => {
		const user = firebase.auth().currentUser;
		if (!user) {
			Alert.alert("Error", "No user is currently logged in.");
			return;
		}
		if (!showPasswordInput) {
			setShowPasswordInput(true);
			return;
		}
		try {
			const credential = firebase.auth.EmailAuthProvider.credential(
				user.email,
				password,
			);
			await user.reauthenticateWithCredential(credential);
			const db = firebase.firestore();
			const usersCollection = db.collection("users");
			await usersCollection.doc(user.uid).delete();
			await user.delete();
			Alert.alert("Success", "Your account has been deleted.");
			navigation.navigate("LogSign");
			firebase.auth().signOut();
		} catch (error) {
			console.error("Error deleting user:", error);
			Alert.alert("Error", "An error occurred while deleting your account.");
		}
	};

	return (
		<View>
			{showPasswordInput ? (
				<View>
					<TextInput
						secureTextEntry
						placeholder="Enter your password"
						value={password}
						onChangeText={setPassword}
						style={{ borderBottomWidth: 1, marginBottom: 20 }}
					/>
					<TouchableOpacity style={styleButton} onPress={handleDeleteAccount}>
						<Text style={styleText}>Confirmar eliminación de cuenta</Text>
					</TouchableOpacity>
				</View>
			) : (
				<TouchableOpacity style={styleButton} onPress={handleDeleteAccount}>
					<Image
						style={styleButton}
						source={require("../assets/buttons/trash.png")}
					/>
					<Text style={styleText}>Borrar cuenta</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default DeleteUserButton;
