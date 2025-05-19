import {
	View,
	Text,
	Dimensions,
	Image,
	TextInput,
	TouchableOpacity as TouchableOpacityRN,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import ButtonAnim from "../ui/ButtonAnim";
import {
	GestureDetector,
	ScrollView,
	TouchableOpacity,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Ginf from "../ui/Ginf/Ginf";
import axios from "axios";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
} from "react-native-reanimated";
import PricePicker from "../PricePicker";
import ClassPicker from "../ClassPicker";
import ExtentPicker from "../ExtentPicker";

import Modal from "react-native-modal";

const { width, height } = Dimensions.get("window");

export default function CreateBook({ onClose, setSendedPostInfo }) {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;
	const [postTitle, setPostTitle] = useState("");
	const [postDescription, setPostDescription] = useState("");
	const [buttonIsLocked, setButtonIsLocked] = useState(false);
	const [images, setImages] = useState([]);
	const [imagesToUpload, setImagesToUpload] = useState(0);
	const [imageToUploadState, setToUploadState] = useState(0);
	const [imageUploadIsActive, setImageUploadIsActive] = useState(false);
	const [isReadyToSend, setIsReadyToSend] = useState(false);
	const [selectedIndexes, setSelectedIndexes] = useState([]);
	const [price, setPrice] = useState(0);
	const [extended, setExtended] = useState("podstawa");
	const [isModalVisible, setIsModalVisible] = useState(false);

	const progress = useSharedValue(0);

	const cancelPost = () => {
		onClose();
		setPostTitle("");
		setImages([]);
	};
	const goModalVisible = () => {
		if (
			postDescription.length > 0 ||
			images.length > 0 ||
			postTitle.length > 0 ||
			price > 0 ||
			selectedIndexes.length > 0
		) {
			setIsModalVisible(true);
		} else {
			cancelPost();
		}
	};
	useEffect(() => {
		if (postTitle.length > 0 && images.length > 0) {
			setIsReadyToSend(true);
		} else {
			setIsReadyToSend(false);
		}
	}, [postTitle, images]);

	useEffect(() => {
		const progressPercentage = (imageToUploadState / imagesToUpload) * 100;
		if (imageUploadIsActive) {
			progress.value = withTiming(progressPercentage, { duration: 300 });
		} else {
			progress.value = 0;
		}
	}, [imageToUploadState, imageUploadIsActive]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			width: `${progress.value}%`,
		};
	});

	const sendPostForm = () => {
		const formData = new FormData();
		// setButtonIsLocked(true);
		formData.append("title", postTitle);
		formData.append("description", postDescription);
		formData.append("class", selectedIndexes);
		formData.append("price", price);
		formData.append("extent", extended);
		images.forEach((image) => {
			if (image.uri) {
				formData.append("photos", {
					uri: image.uri,
					type: "image/webp",
					name: image.fileName.replace(/\.[^/.]+$/, ".webp"),
				});
			}
		});
		console.log(formData, "formData");
		axios.post(`${apiUrl}/api/book`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		// .then((response) => {
		// 	cancelPost();
		// 	setSendedPostInfo(true);
		// 	setButtonIsLocked(false);
		// })
		// .catch((error) => {
		// 	console.error("Error uploading data:", error);
		// 	setButtonIsLocked(false);
		// });
	};

	const uploadImage = async (mode) => {
		if (images.length >= 5) {
			alert("Maksymalna liczba zdjęć to 5!");
			return;
		}
		try {
			let result;
			if (mode === "gallery") {
				const permissionResult =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (permissionResult.granted === false) {
					alert("Permission to access gallery is required!");
					return;
				}
				result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.Images,
					allowsMultipleSelection: true,
					selectionLimit: 5 - images.length,
				});
			} else {
				const permissionResult =
					await ImagePicker.requestCameraPermissionsAsync();
				if (permissionResult.granted === false) {
					alert("Permission to access camera is required!");
					return;
				}
				result = await ImagePicker.launchCameraAsync({
					mediaTypes: ImagePicker.Images,
				});
			}
			if (result?.assets) setImageUploadIsActive(true);
			setImagesToUpload(result?.assets?.length || 0);
			setToUploadState(0);
			if (!result.canceled) {
				const manipulatedImages = await Promise.all(
					result.assets.map(async (image) => {
						const { width, height } = image;
						let manipResult;
						if (width > height) {
							manipResult = await ImageManipulator.manipulateAsync(
								image.uri,
								[{ resize: { width: 1080 } }],
								{ quality: 0.9, format: ImageManipulator.SaveFormat.WEBP }
							);
						} else {
							manipResult = await ImageManipulator.manipulateAsync(
								image.uri,
								[{ resize: { height: 1080 } }],
								{ quality: 0.9, format: ImageManipulator.SaveFormat.WEBP }
							);
						}
						console.log(manipResult);
						setToUploadState((prev) => prev + 1);
						return {
							uri: manipResult.uri,
							mimeType: "image/webp",
							fileName: image.fileName
								? image.fileName.replace(/\.[^/.]+$/, ".webp")
								: `image_${Date.now()}.webp`,
						};
					})
				);
				setImages((prevImages) => [...prevImages, ...manipulatedImages]);
				setTimeout(() => {
					setImageUploadIsActive(false);
				}, 500);
			}
		} catch (error) {
			console.log("Error uploading image: ", error);
		}
	};
	const deleteImage = (index) => {
		console.log(images, "images");
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
	};

	return (
	<>
		<View className="flex flex-row items-center justify-between px-3 bg-black border-b border-neutral-600 py-1 w-full fixed top-0 z-10">
			<View>
					<Text
						style={{ color: "white" }}
						className="font-GilroySemiBold py-2 text-2xl text-center">
						Tworzenie ogłoszenia
					</Text>
			</View>
		</View>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					display: "flex",
					justifyContent: "space-between",
					gap: 5,
					width,
					minHeight: height-80,
				}}>
				<View>
					<View>
						<View>
							<Animated.View
								style={[
									animatedStyle,
									{ height: 1, backgroundColor: "#D0F601" },
								]}></Animated.View>
						</View>
					</View>
					<ScrollView
						data={images}
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{
							maxHeight: 150,
							height: 150,
						  }}
						>
						{images.length > 0 ? (
							images.map((item, index) => (
								<Photo
									key={index}
									index={index}
									item={item}
									deleteImage={deleteImage}
								/>
							))
						) : (
							<View
								style={{
									width,
									// flex: 1,
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Image
									source={require("../../assets/images/uploadFiles.png")}
									style={{ width: 60, height: 60, resizeMode: "contain" }}
								/>
								<Text className="font-GilroyMedium mt-2 text-xl text-[#D0F601]">
									Brak zdjęć
								</Text>
							</View>
						)}
					</ScrollView>
					<View className="flex flex-row w-full gap-2 p-2">
						<TouchableOpacityRN
							onPress={() => uploadImage("gallery")}
							style={{ flexGrow: 1 }}>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 99,
									padding: 10,
									borderWidth: 1,
									borderColor: "#D0F601",
								}}>
								<Text className="text-white font-GilroyMedium">Galeria</Text>
							</View>
						</TouchableOpacityRN>
						<View
							className="flex flex-row items-center justify-center rounded-full p-2 aspect-square"
							style={{ borderWidth: 1, borderColor: "#D0F601" }}>
							<Text className="text-white font-GilroyMedium">
								{images.length}/5
							</Text>
						</View>
						<TouchableOpacityRN
							onPress={() => uploadImage()}
							style={{ flexGrow: 1 }}>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 99,
									padding: 10,
									borderWidth: 1,
									borderColor: "#D0F601",
								}}>
								<Text className="text-white font-GilroyMedium">Aparat</Text>
							</View>
						</TouchableOpacityRN>
					</View>
					<View className="px-2">
						<TextInput
							maxLength={60}
							placeholderTextColor="#454545"
							className="bg-neutral-900 placeholder:text-neutral-400 rounded-xl p-2 focus:bg-neutral-800 text-white font-GilroyMedium"
							placeholder="Tytuł"
							cursorColor="#D0F601"
							onChangeText={(text) => {
								setPostTitle(text);
							}}
							value={postTitle}
						/>
					</View>
					<View className="p-2">
						<TextInput
							multiline
							numberOfLines={10}
							textAlignVertical="top"
							maxLength={1000}
							placeholderTextColor="#454545"
							className="bg-neutral-900 placeholder:text-neutral-500 min-h-40 rounded-xl p-2 focus:bg-neutral-800 text-white font-GilroyMedium"
							placeholder="Opis"
							cursorColor="#D0F601"
							onChangeText={(text) => {
								setPostDescription(text);
							}}
							value={postDescription}
						/>
					</View>

					<View className="flex flex-col gap-2">
						<View className="flex items-center justify-center flex-col">
							<Text className="text-white font-GilroyMedium text-2xl text-center">
								Klasa
							</Text>
							<ClassPicker
								selectedIndexes={selectedIndexes}
								setSelectedIndexes={setSelectedIndexes}
							/>
						</View>
						<View className="flex flex-row items-center justify-between gap-2">
							<View className="flex flex-col gap-2 flex-1">
								<View>
									<Text className="text-white font-GilroyMedium text-2xl text-center">
										Zakres
									</Text>
								</View>
								<ExtentPicker onChange={setExtended} />
							</View>
							<View className="flex flex-1 items-center justify-between gap-2 flex-col">
								<View>
									<Text className="text-white font-GilroyMedium text-2xl">
										Cena
									</Text>
								</View>
								<View className="flex">
									<PricePicker onChange={setPrice} />
								</View>
							</View>
						</View>
					</View>
				</View>
				<View className="px-2">
					<ButtonAnim
						className="border border-[#525252]"
						style={{ borderColor: "#525252" }}
						onPress={() => sendPostForm()}
						isLocked={buttonIsLocked || !isReadyToSend}>
						<Text className="text-lg font-GilroySemiBold text-[#D0F601]">
							{buttonIsLocked ? "Wysyłanie" : "Wyślij do weryfikacji"}
						</Text>
					</ButtonAnim>
				</View>
			</ScrollView>
			<ModalItem
				isModalVisible={isModalVisible}
				setIsModalVisible={setIsModalVisible}
				cancelPost={cancelPost}
			/>
		</>
	);
}
const Photo = ({ index, item, deleteImage }) => {
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: 140,
				borderWidth: 1,
				borderColor: "#525252",
				borderRadius: 12,
				margin: 5,
				aspectRatio: 1,
				overflow: "hidden",
				position: "relative",
			}}>
			<Image
				source={{ uri: item.uri }}
				style={{ width: 140, height: 140 }}
			/>
			<View
				style={{
					position: "absolute",
					top: 8,
					right: 8,
					backgroundColor: "rgba(0,0,0,0.4)",
					padding: 5,
					borderRadius: 50,
				}}>
				<TouchableOpacity onPress={() => deleteImage(index)}>
					<Ginf name="x" color="white" size={16} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const ModalItem = ({ isModalVisible, setIsModalVisible, cancelPost }) => {
	return (
		<View>
			<Modal
				isVisible={isModalVisible}
				animationIn="fadeIn"
				animationOut="fadeOut"
				customBackdrop={
					<TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
						<View style={{ flex: 1, backgroundColor: "#000" }} />
					</TouchableWithoutFeedback>
				}>
				<View className="bg-black rounded-2xl p-4 border border-[#D0F601]">
					<Text className="font-GilroyMedium text-white">Usunąć post?</Text>
				</View>
				<View className="flex flex-row mt-2 gap-2">
					<TouchableOpacityRN
						onPress={() => setIsModalVisible(false)}
						className="bg-black flex-1 border border-[#D0F601] rounded-full p-4">
						<Text className="font-GilroyMedium text-white text-center">
							Anuluj
						</Text>
					</TouchableOpacityRN>
					<TouchableOpacityRN
						onPress={() => {
							setIsModalVisible(false);
							cancelPost();
						}}
						className="bg-black flex-1 border border-[#D0F601] rounded-full p-4">
						<Text className="font-GilroyMedium text-white text-center">
							Usuń
						</Text>
					</TouchableOpacityRN>
				</View>
			</Modal>
		</View>
	);
};
