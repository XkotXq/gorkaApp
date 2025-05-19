import React from "react";
import { View, Image, Dimensions } from "react-native";
import { Zoomable } from '@likashefqet/react-native-image-zoom';

const { width } = Dimensions.get("window");


const Slide = ({ item, maxHeight }) => {
    return (
        <View className="flex flex-col items-center justify-center overflow-hidden">
            <Zoomable
                isDoubleTapEnabled={false}
            >
            <Image
                source={{ uri: item.src }}
                style={{
                    width: width,
                    height: maxHeight,
                    resizeMode: "contain",
                    marginHorizontal: "auto",
                }}
            />
            </Zoomable>
        </View>
    );
};

export default Slide;