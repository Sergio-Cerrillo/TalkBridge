import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LanguageSelector = ({ setSelectedLanguageKnow, setSelectedLanguageLearn }) => {
    const navigation = useNavigation();

    const [localLanguageKnow, setLocalLanguageKnow] = useState('en');
    const [localLanguageLearn, setLocalLanguageLearn] = useState('en');
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'it', name: 'Italiano' },
        { code: 'pt', name: 'Português' },
        { code: 'ru', name: 'Русский' },
        { code: 'ja', name: '日本語' },
        { code: 'zh', name: '中文' },
    ];

    const handleFinish = () => {
        setSelectedLanguageKnow(localLanguageKnow);
        setSelectedLanguageLearn(localLanguageLearn);
        navigation.navigate('LogSign', {
            selectedLanguageKnow: localLanguageKnow,
            selectedLanguageLearn: localLanguageLearn
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.langKnow} >
                <Text style={styles.label}>Selecciona el idioma que conoces:</Text>
                <Picker
                    selectedValue={localLanguageKnow}
                    onValueChange={(itemValue) => setLocalLanguageKnow(itemValue)}
                    style={styles.picker}
                >
                    {languages.map((language) => (
                        <Picker.Item key={language.code} label={language.name} value={language.code} />
                    ))}
                </Picker>
            </View>
            <View style={styles.langLearn}>
                <Text style={styles.label}>Selecciona el idioma que quieres aprender:</Text>
                <Picker
                    selectedValue={localLanguageLearn}
                    onValueChange={(itemValue) => setLocalLanguageLearn(itemValue)}
                    style={styles.picker}
                >
                    {languages.map((language) => (
                        <Picker.Item key={language.code} label={language.name} value={language.code} />
                    ))}
                </Picker>
            </View>
            <TouchableOpacity style={styles.returnBox} onPress={handleFinish}>
                <Text style={styles.returnText}>Listo</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D7DBFF',
        padding: 20,
        alignItems: 'center',

    },
    langKnow: {
        marginTop: 150,
        alignItems: 'center'
    },
    langLearn: {
        marginTop: 250,
        alignItems: 'center'

    },
    picker: {
        height: 30,
        width: 250,
    },
    label: {
        fontWeight: 'bold',
        fontSize: '18',
        color: '#333A73'
    },
    returnBox: {
        marginTop: 250,
        backgroundColor: '#333A73',
        borderRadius: 20,
        width: 200,
        height: 45,
        justifyContent: 'center'
    },
    returnText: {
        color: '#D7DBFF',
        textAlign: 'center',
        fontSize: '30',
    }

})
export default LanguageSelector;
