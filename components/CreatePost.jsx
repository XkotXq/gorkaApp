import {
	View,
	Text,
	Dimensions,
	Image,
	TextInput,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
	BottomSheetScrollView,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import ButtonAnim from "./ui/ButtonAnim";

import * as ImagePicker from "expo-image-picker";
import Ginf from "./ui/Ginf/Ginf";

const { width, height } = Dimensions.get("window");

export default function CreatePost({ dismiss }) {
	const [postDesc, setPostDesc] = useState("");
	const [images, setImages] = useState([]);

	const uploadImage = async (mode) => {
		try {
			if (mode === "gallery") {
				await ImagePicker.requestMediaLibraryPermissionsAsync();
				const result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: "images",
					aspect: [4, 3],
					quality: 1,
					allowsMultipleSelection: true,
				});
				await saveImages(result.assets);
			} else {
				await ImagePicker.requestCameraPermissionsAsync();
				let result = await ImagePicker.launchCameraAsync({
					cameraType: ImagePicker.CameraType.back,
					allowsEditing: false,
                    allowsMultipleSelection: true,
					aspect: [4, 3],
					quality: 1,
				});
				if (!result.canceled) {
					await saveImages(result.assets);
				}
			}
		} catch (error) {
			console.log("Error uploading image: ", error);
		}
	};

	const saveImage = async (image) => {
		try {
			setImages([images]);
		} catch (error) {
			throw error;
		}
	};
	const saveImages = async (_images) => {
		try {
			const uriPhotos = _images.map((item) => item.uri);
			const added = [...uriPhotos, ...images];
			setImages(added);
		} catch (error) {
			throw error;
		}
	};
	const deleteImage = (index) => {
		const updatedImages = [...images];
		updatedImages.splice(index, 1);
		setImages(updatedImages);
	};

	return (
		<View
			style={{
				flexGrow: 1,
				display: "flex",
				justifyContent: "space-between",
				gap: 5,
			}}>
			<View style={{ flexGrow: 1 }}>
				<View className="w-full flex flex-row justify-between px-5">
					<Text
						className="font-GilroySemiBold text-xl"
						style={{ color: "white" }}>
						Tworzenie postu
					</Text>
					<TouchableOpacity onPress={() => dismiss()}>
						<Text className="text-neutral-400 font-GilroyMedium">Anuluj</Text>
					</TouchableOpacity>
				</View>
				<BottomSheetScrollView
					data={images}
					// renderItem={({ item }) => <Photo item={item} />}
					horizontal
					style={{ gap: 10 }}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ height: 180 }}>
					{images.map((item, index) => (
						<Photo
							key={index}
							index={index}
							item={item}
							deleteImage={deleteImage}
						/>
					))}
				</BottomSheetScrollView>
				<View className="flex flex-row">
					<TouchableOpacity onPress={() => uploadImage("gallery")}>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: 50,
								// borderWidth: 1,
								// borderColor: "#525252",
								borderRadius: 12,
								margin: 5,
								aspectRatio: 1,
							}}>
							<Image
								source={require("../assets/images/importImages.png")}
								style={{
									width: 40,
									height: 40,
									resizeMode: "contain",
								}}
							/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => uploadImage()}>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								width: 50,
								borderRadius: 12,
								margin: 5,
								aspectRatio: 1,
							}}>
							<Image
								source={require("../assets/images/takePhoto.png")}
								style={{
									width: 40,
									height: 40,
									resizeMode: "contain",
								}}
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View className="px-2">
					<Text
						className="font-GilroyMedium px-3 text-xl mb-2"
						style={{ color: "white" }}>
						Opis
					</Text>
					<BottomSheetTextInput
						editable
						multiline
						style={{
							color: "white",
							borderRadius: 12,
							borderWidth: 1,
							borderColor: "#525252",
							padding: 5,
							minHeight: 40,
						}}
						placeholderTextColor="#525252"
						className="placeholder:text-white font-GilroyMedium"
						placeholder="Dodaj swój opis"
						cursorColor="#D0F601"
						onChange={(e) => setPostDesc(e.nativeEvent.value)}
						value={postDesc}
					/>
				</View>
			</View>
			<View className="px-2">
				<ButtonAnim
					className="border border-[#525252]"
					style={{ borderColor: "#525252" }}>
					<Text className="text-lg font-GilroySemiBold text-[#D0F601]">
						Wyślij do weryfikacji
					</Text>
				</ButtonAnim>
			</View>
		</View>
	);
}
const Photo = ({ index, item, deleteImage }) => {
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: width * 0.5 - 10,
				borderWidth: 1,
				borderColor: "#525252",
				borderRadius: 12,
				margin: 5,
				aspectRatio: 1,
				overflow: "hidden",
				position: "relative",
			}}>
			<Image
				source={{ uri: item }}
				style={{ width: width * 0.5 - 10, height: width * 0.5 - 10 }}
			/>
			<TouchableOpacity
				className="absolute top-3 right-3 bg-black/40"
				style={{
					position: "absolute",
					top: 8,
					right: 8,
					backgroundColor: "rgba(0,0,0,0.4)",
					padding: 5,
					borderRadius: 50,
				}}
				onPress={() => deleteImage(index)}>
				<Ginf name="x" color="white" size={16} />
			</TouchableOpacity>
		</View>
	);
};
