import React from "react";
import { Text } from "react-native";

const GenderReveal = ({ gender, style }) => {
	if (gender === "Man") {
		return <Text style={style}>Hombre</Text>;
	}
	if (gender === "Woman") {
		return <Text style={style}>Mujer</Text>;
	}
	return null;
};

export default GenderReveal;
