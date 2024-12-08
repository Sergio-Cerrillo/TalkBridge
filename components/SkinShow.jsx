import React from "react";
import { Image } from "react-native";

const SkinShow = ({ gender, style }) => {
	if (gender === "Man") {
		return <Image style={style} source={require("../assets/skins/man.png")} />;
	}
	if (gender === "Woman") {
		return (
			<Image style={style} source={require("../assets/skins/woman.png")} />
		);
	}
	return null;
};

export default SkinShow;
