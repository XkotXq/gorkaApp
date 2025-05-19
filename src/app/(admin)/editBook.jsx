import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image,
	ScrollView,
	TextInput,
	TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useEditPostContext } from "../context/EditPostContext";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import Ginf from "../../../components/ui/Ginf/Ginf";
import scaleImages from "../../../components/functions/scaleImages";
import Pagination from "../../../components/Pagination";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import Animated, {
	runOnJS,
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	ReduceMotion,
	Easing,
} from "react-native-reanimated";
import {
	FlatList,
	Gesture,
	GestureDetector,
} from "react-native-gesture-handler";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const { width, height } = Dimensions.get("window");
export default function editBook() {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL
	const { colors } = useTheme();
	const router = useRouter();

	const { activeBook } = useEditPostContext();
	const [updatedBook, setUpdatedBook] = useState(activeBook);
	const [updatedDescription, setUpdatedDescription] = useState(
		activeBook.description
	);
	const [updatedPhotos, setUpdatedPhotos] = useState(
		activeBook.photos.map((item) => ({ ...item, checked: true }))
	);
	const changeActivePhoto = (id, checked) => {
		setUpdatedPhotos((prevState) =>
			prevState.map((item, i) =>
				item._id === id ? { ...item, checked: checked } : item
			)
		);
	};
	const deletePhoto = (id) => {
		setUpdatedPhotos((prevState) =>
			prevState.filter((item) => item._id !== id)
		);
	};
	useEffect(() => {
		console.log(updatedPhotos);
	}, [updatedPhotos]);

	const [isActivePhotoEditMode, setIsActivePhotoEditMode] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

	// console.log(activeBook);

	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};
	const maxScaledImage = scaleImages(updatedPhotos, width, 500);

	const longPressGesture = Gesture.LongPress().onStart((e, success) => {
		runOnJS(setIsActivePhotoEditMode)(!isActivePhotoEditMode);
	});
	const animatedPositionX = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: withSpring(isActivePhotoEditMode ? 0 : -60),
			},
		],
	}));

	const uploadImage = async (mode) => {
		try {
			if (mode === "gallery") {
				await ImagePicker.requestMediaLibraryPermissionsAsync();
				const result = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaType,
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
	const saveImages = async (_images) => {
		try {
			const uriPhotos = _images.map((item, index) => ({
				fileName: item.fileName,
				mimeType: item.mimeType,
				_id: item.fileName + Math.random() * 20,
				src: item.uri,
				checked: true,
				height: item.height,
				width: item.width,
				onlyLocal: true,
			}));
			console.log(uriPhotos);
			const added = [...updatedPhotos, ...uriPhotos];
			setUpdatedPhotos(added);
		} catch (error) {
			throw error;
		}
	};

	const sendBookForm = () => {
		const formData = new FormData();
		const imagesForUpload = updatedPhotos.filter(
			(item) => item.onlyLocal && item.checked
		);
		console.log(imagesForUpload, "dziala?")
		formData.append("id", updatedBook._id);
		formData.append("desc", updatedDescription);
		imagesForUpload.forEach((image) => {
			if (image.src) {
				formData.append("photos", {
					uri: image.src,
					type: image.mimeType,
					name: image.fileName,
				});
			}
		});
		const uploadedImagedIds = updatedPhotos
			.filter((item) => !item.onlyLocal && item.checked)
			.map((item) => item._id);
		formData.append("uploadedPhotosIds", JSON.stringify(uploadedImagedIds));
		console.log(formData, "data")
		axios
			.book(`${apiUrl}/api/admin/book/edit`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((response) => {})
			.catch((error) => {
				console.error("Error uploading data:", error);
			});
	};

	return (
		<ScrollView className="bg-black relative" style={{ width, height }}>
			<View
				className="w-full bg-black border-b border-neutral-600 py-2"
				style={{ elevation: 4 }}>
				<View className="flex flex-row items-center justify-between px-3">
					<View>
						<Text
							style={{ color: colors.text }}
							className="font-GilroySemiBold py-2 text-2xl">
							Edytowanie booku
						</Text>
					</View>
					<View>
						<TouchableOpacity onPress={() => router.back()}>
							<Ginf name="arrowBack" size={38} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View className="flex flex-row items-center p-2">
				<View
					className="h-12 w-12 rounded-full border border-neutral-700 overflow-hidden flex items-center justify-center"
					style={{ width: 48, height: 48 }}>
					<Image
						source={require("../../../assets/images/GLogo.png")}
						style={{ width: 26, height: 26, resizeMode: "contain" }}
					/>
				</View>
				<View className="flex flex-col">
					<Text
						style={{ color: colors.text }}
						className="pl-2 pb-0 font-GilroyMedium text-xl">
						{updatedBook.authorName ? updatedBook.authorName : "Brak"}
					</Text>
					<Text
						style={{ color: colors.text }}
						className="pl-2 pb-0 font-GilroyMedium">
						{updatedBook.authorNick ? updatedBook.authorNick : "Brak"}
					</Text>
					{/* <View className=" px-2 w-full flex justify-end">
                                        <Text className="font-GilroyMedium text-neutral-400 text-end">
                                            {formatDate(book.sendedAt)}
                                        </Text>
                                    </View> */}
				</View>
			</View>
			<GestureDetector gesture={longPressGesture}>
				<View
					className="flex flex-col relative"
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
					}}>
					<View
						onPress={() => setIsActivePhotoEditMode((prevState) => !prevState)}>
						<FlatList
							nestedScrollEnabled
							onMomentumScrollEnd={updateCurrentSlideIndex}
							data={updatedPhotos}
							renderItem={({ item }, index) => (
								<Slide
									key={index}
									index={index}
									item={item}
									maxHeight={maxScaledImage}
									editMode={isActivePhotoEditMode}
									changeActive={changeActivePhoto}
									deletePhoto={deletePhoto}
								/>
							)}
							horizontal
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								height: maxScaledImage,
							}}></FlatList>
						{updatedPhotos.length > 1 ? (
							<View className="flex flex-row items-center justify-center mt-2">
								{updatedPhotos.map((_, index) => (
									<View
										key={index}
										style={{
											height: currentSlideIndex === index ? 7 : 6,
											width: currentSlideIndex === index ? 7 : 6,
											marginHorizontal: 2,
											borderRadius: 10,
											backgroundColor:
												currentSlideIndex === index
													? _.checked
														? "#D0F601"
														: "#FF0004"
													: _.checked
													? "gray"
													: "#AB0003",
										}}
									/>
								))}
							</View>
						) : null}
					</View>
					{updatedPhotos.length > 1 ? (
						<View
							className="absolute z-10 bg-black/60 px-2 py-1"
							style={{
								backgroundColor: "rgba(0,0,0,0.6)",
								borderRadius: 20,
								padding: 8,
								fontWeight: 700,
								right: 12,
								top: 12,
							}}>
							<Text className="text-white font-GilroySemiBold font-bold text-sm">
								{currentSlideIndex + 1}/{updatedPhotos.length}
							</Text>
						</View>
					) : null}
					<Animated.View
						style={[
							{ position: "absolute", top: 15, left: 15 },
							animatedPositionX,
						]}>
						<TouchableOpacity onPress={() => uploadImage("gallery")}>
							<View
								style={{
									borderWidth: 1,
									borderColor: "#00A2FF",
									borderRadius: 999,
									backgroundColor: "black",
									padding: 5,
								}}>
								<Image
									source={require("../../../assets/images/icoImage.png")}
									style={{ width: 30, height: 30, resizeMode: "contain" }}
								/>
							</View>
						</TouchableOpacity>
					</Animated.View>
				</View>
			</GestureDetector>
			<View className="mb-2">
				<TextInput
					editable
					multiline
					value={updatedDescription}
					maxLength={1200}
					onChangeText={(e) => setUpdatedDescription(e)}
					className="font-GilroyMedium px-5"
					style={{ color: colors.text }}
				/>
			</View>
			<View className="flex flex-row">
				<View style={{ flexGrow: 1 }}>
					<TouchableOpacity
						className="flex justify-center items-center m-2 rounded-full"
						style={{
							padding: 12,
							borderWidth: 1,
							borderColor: "#00A2FF",
							margin: 4,
						}}>
						<Text className="font-GilroySemiBold" style={{ color: "#00A2FF" }}>
							Anuluj
						</Text>
					</TouchableOpacity>
				</View>
				<View style={{ flexGrow: 1 }}>
					<TouchableOpacity
						onPress={sendBookForm}
						className="flex justify-center items-center m-2 rounded-full"
						style={{
							padding: 12,
							borderWidth: 1,
							borderColor: "#D0F601",
							backgroundColor: "#D0F601",
							margin: 4,
						}}>
						<Text className="font-GilroySemiBold" style={{ color: "#000" }}>
							Zapisz
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
}

const Slide = ({
	item,
	index,
	maxHeight,
	editMode,
	changeActive,
	deletePhoto,
}) => {
	const bouncyCheckBoxRef = useRef(null);
	const animatedScale = useAnimatedStyle(() => ({
		transform: [
			{ scale: withSpring(editMode ? 0.95 : 1, { mass: 1, damping: 1 }) },
		],
	}));
	const animatedPosition = useAnimatedStyle(() => ({
		transform: [
			{
				translateY: withSpring(editMode ? 0 : 60),
			},
		],
	}));
	const animatedPositionX = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: withSpring(editMode ? 0 : -60),
			},
		],
	}));
	return (
		<View
			className="flex flex-col items-center justify-center overflow-hidden"
			style={{
				backgroundColor: editMode
					? item.checked
						? "#002033"
						: "#141414"
					: "transparent",
			}}>
			<Animated.View style={animatedScale}>
				<Image
					source={{ uri: item.src }}
					style={{
						width: width,
						height: maxHeight,
						resizeMode: "contain",
						marginHorizontal: "auto",
					}}
				/>
			</Animated.View>
			<Animated.View
				style={[
					{
						position: "absolute",
						bottom: 20,
						right: 20,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					},
					animatedPosition,
				]}>
				<BouncyCheckbox
					ref={bouncyCheckBoxRef}
					size={30}
					fillColor="#00A2FF"
					unFillColor="#000"
					//   text="Custom Checkbox"
					isChecked={item.checked}
					iconStyle={{ borderColor: "red" }}
					innerIconStyle={{ borderWidth: 2 }}
					onPress={(isChecked) => {
						console.log(isChecked);
						changeActive(item._id, isChecked);
					}}
				/>
			</Animated.View>
			{item.onlyLocal && (
				<Animated.View
					style={[
						{ position: "absolute", top: 65, left: 15 },
						animatedPositionX,
					]}>
					<TouchableOpacity onPress={deletePhoto}>
						<View
							style={{
								borderWidth: 1,
								borderColor: "#FF0004",
								borderRadius: 999,
								backgroundColor: "black",
								padding: 8,
							}}>
							<Image
								source={require("../../../assets/images/icoX.png")}
								style={{ width: 24, height: 26, resizeMode: "contain" }}
							/>
						</View>
					</TouchableOpacity>
				</Animated.View>
			)}
		</View>
	);
};
