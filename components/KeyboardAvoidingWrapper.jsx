import React from "react";

import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";


const KeyboardAvoidingWrapper = ({ children }) => {
    return (
        <KeyboardAvoidingView style={{ flex: 1}}>
            <ScrollView
            // className="h-full"
					contentContainerStyle={{
						paddingHorizontal: 20,
						// paddingVertical: 10,
					}}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    )
};

export default KeyboardAvoidingWrapper;