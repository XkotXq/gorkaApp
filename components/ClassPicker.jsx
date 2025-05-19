import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SelectableOptions = ({selectedIndexes, setSelectedIndexes}) => {

    const options = ["I", "II", "III", "IV", "V"];

    const handlePress = (index) => {
        if (selectedIndexes.includes(options[index])) {
            setSelectedIndexes(selectedIndexes.filter((i) => i !== options[index]));
        } else {
            const newIndexes = [...selectedIndexes, options[index]];
            if (newIndexes.length <= 3 && areConsecutive(newIndexes)) {
                console.log("Selected indexes:", convertToIndexes(newIndexes).map(value => options[value]));
                setSelectedIndexes(convertToIndexes(newIndexes).map(value => options[value]));
            }
        }
    };
    const convertToIndexes = (indexes) => {
        return indexes.map(value => options.indexOf(value)).sort((a, b) => a - b);
    };

    const areConsecutive = (indexes) => {
        const numericIndexes = convertToIndexes(indexes);
        for (let i = 1; i < numericIndexes.length; i++) {
            if (numericIndexes[i] - numericIndexes[i - 1] !== 1) {
                return false;
            }
        }
        return true;
    };

    return (
        <View>
            <View style={styles.row}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.option,
                            selectedIndexes.includes(options[index]) && styles.selectedOption,
                        ]}
                        onPress={() => handlePress(index)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 8,
        gap: 8,
    },
    option: {
        // backgroundColor: "#525252",
        borderRadius: 50,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        width: 48,
        borderWidth: 1,
        borderColor: "#525252",
    },
    selectedOption: {
        borderColor: "#D0F601",
    },
    optionText: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
    },
});

export default SelectableOptions;