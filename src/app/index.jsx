import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import {
	View,
	Text,
	Pressable,
	ScrollView,
	Image,
	FlatList,
	Dimensions,
} from "react-native";
import ButtonAnim from "../../components/ui/ButtonAnim";
import { Link, Redirect, useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import btnArrow1 from "../../assets/images/btnArrow1.png";
import { useRef, useState, useEffect } from "react";
import { MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import clsx from "clsx";
import { useAuth } from "./../app/context/AuthContext";
// import * as Sentry from "@sentry/react-native";

// Sentry.init({
//   dsn: "https://0a090d69f1d7adfb598d1d323168da4c@o4508946656067584.ingest.de.sentry.io/4508946659934288",
// });

export default function index() {
	const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);
	const [userIsAnonymous, setUserIsAnonymous] = useState(null); //dodać ustawianie AsyncStorage po naciśnięcxiu bez logowania
	const { authState, onAnonymous } = useAuth();
	// throw new Error('My first Sentry error!');
	// Sentry.nativeCrash();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const ref = useRef(null);
	const router = useRouter();

	useEffect(() => {
		const checkFirstLaunch = async () => {
			const appData = await AsyncStorage.getItem("isAppFirstLaunched");
			const userisAnon = await AsyncStorage.getItem("userIsAnonymous");
			if (appData === null) {
				setIsAppFirstLaunched(true);
				AsyncStorage.setItem("isAppFirstLaunched", "false");
			} else {
				setIsAppFirstLaunched(false);
			}

			setUserIsAnonymous(userisAnon);
		};
		checkFirstLaunch();
	}, []);

	const { width, height } = Dimensions.get("window");
	const { colors } = useTheme();

	const Slide = ({ item }) => {
		return (
			<View className="flex justify-center align-center" style={{ width }}>
				<Image
					source={item.image}
					style={{
						height: "60%",
						width: width * 0.95,
						resizeMode: "contain",
						marginHorizontal: "auto",
					}}
				/>
				{/* <View className='mt-5 flex justify-center align-center flex-col'> */}
				<Text
					style={{ color: "#D0F601" }}
					className="font-GilroySemiBold text-4xl text-center">
					{item.title}
				</Text>
				<Text
					style={{ color: "#00A2FF", marginTop: 10, fontSize: 15 }}
					className="font-GilroySemiBold text-center text-wrap">
					{item.subTitle}
				</Text>
				{/* </View> */}
			</View>
		);
	};

	const cards = [
		{
			id: "1",
			title: "Górka Górą!!!",
			subTitle: "Wiedz co się dzieje na górce <3",
			image: require("../../assets/images/GLineLogo.png"),
		},
		{
			id: "2",
			title: "Przeglądaj posty",
			subTitle: "Przeglądaj posty i zdjęcia z lekcji lub szkolnych wydarzeń",
			image: require("../../assets/images/onBoarding1.png"),
		},
		{
			id: "3",
			title: "Wystaw swoje książki",
			subTitle:
				"Nie masz komu sprzedać książek z poprzednich lat? Wystaw, może komuś się przydadzą",
			image: require("../../assets/images/onBoardingBooks.png"),
		},
		{
			id: "4",
			title: "Szkolne wydarzenia",
			subTitle:
				"Chcesz wziąć udział w szkolnym wydarzeniu? Sprawdź zakładkę wydarzenia",
			image: require("../../assets/images/onBoardingEvents.png"),
		},
		{
			id: "5",
			title: "Logowanie",
			subTitle:
				"Aby posiadać możliwość dodwania swoich postów, zdjęć z lekcji musisz być zalogowany",
			image: require("../../assets/images/onBoarding2.png"),
		},
		// {
		// 	id: "5",
		// 	title: "Testy w sieci",
		// 	subTitle:
		// 		"(W przyszłości) Odświeżona wersja Testów w sieci. W aplikacji ułatwi korzystanie",
		// 	image: require("../../assets/images/onBoarding2.png"),
		// },
		{
			id: "6",
			title: "Anonimowe przeglądanie",
			subTitle:
				"Jeżeli nie masz ochoty zakładać konta, możesz anonimowo przeglądać posty i zdjęcia",
			image: require("../../assets/images/onBoarding4.png"),
		},
	];

	const goNextCard = () => {
		const nextCardIndex = currentSlideIndex + 1;
		if (nextCardIndex != cards.length) {
			const offset = nextCardIndex * width;
			ref?.current.scrollToOffset({ offset });
			setCurrentSlideIndex(nextCardIndex);
		}
	};
	const skip = () => {
		const lastSlideIndex = cards.length - 1;
		const offset = lastSlideIndex * width;
		ref?.current.scrollToOffset({ offset });
		setCurrentSlideIndex(lastSlideIndex);
	};

	const Footer = () => {
		return (
			<View
				style={{
					height: height * 0.25,
					justifyContent: "space-between",
					paddingHorizontal: 20,
					width,
				}}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						marginTop: 20,
					}}>
					{cards.map((_, index) => (
						<MotiView
							key={index}
							from={{ scale: 1, borderWidth: 1, borderColor: "gray" }}
							animate={{
								scale: currentSlideIndex === index ? 1.1 : 1,
								borderColor: currentSlideIndex === index ? "#D0F601" : "gray",
								borderWidth: currentSlideIndex === index ? 2 : 1,
							}}
							transition={{
								type: "spring",
							}}
							style={{
								height: 20,
								width: 20,
								marginHorizontal: 3,
								borderRadius: 10,
							}}
							className="transform transition-all "
						/>
					))}
				</View>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					{currentSlideIndex !== cards.length - 1 ? (
						<>
							<Pressable
								onPress={skip}
								disabled={currentSlideIndex === cards.length - 1}>
								{({ pressed }) => (
									<MotiView
										from={{ scale: 1 }}
										animate={{ scale: pressed ? 0.95 : 1 }}
										transition={{
											type: "spring",
										}}
										className={clsx(
											"flex rounded-full justify-center items-center text-center p-5 border w-full"
										)}
										style={{ borderColor: "white" }}>
										<Text
											style={{ color: "white", fontWeight: 700 }}
											className="font-GilroyMedium">
											Pomiń
										</Text>
									</MotiView>
								)}
							</Pressable>
							<Pressable onPress={goNextCard}>
								{({ pressed }) => (
									<MotiView
										from={{ scale: 1 }}
										animate={{ scale: pressed ? 0.95 : 1 }}
										transition={{
											type: "spring",
										}}
										className={clsx(
											"flex rounded-full justify-center items-center text-center p-2 border"
										)}
										style={{ borderColor: "#D0F601" }}>
										<Text style={{ color: "#D0F601" }}>
											<Image
												source={btnArrow1}
												style={{ width: 40, height: 40, resizeMode: "contain" }}
											/>
										</Text>
									</MotiView>
								)}
							</Pressable>
						</>
					) : (
						<>
							<Pressable
								onPress={() => {
									onAnonymous();
								}}
								style={{ flex: 1 }}>
								{({ pressed }) => (
									<MotiView
										from={{ scale: 1 }}
										animate={{ scale: pressed ? 0.95 : 1 }}
										transition={{
											type: "spring",
										}}
										className={clsx(
											"flex rounded-full justify-center items-center text-center p-5 border w-full"
										)}
										style={{ borderColor: "white" }}>
										<Text
											style={{ color: "white", fontWeight: 700 }}
											className="font-GilroyMedium">
											Bez logowania
										</Text>
									</MotiView>
								)}
							</Pressable>
							<View style={{ width: 10 }} />
							<Pressable
								onPress={() => {
									router.push("/(auth)/sign-in");
								}}
								style={{ flex: 1 }}>
								{({ pressed }) => (
									<MotiView
										from={{ scale: 1 }}
										animate={{ scale: pressed ? 0.95 : 1 }}
										transition={{
											type: "spring",
										}}
										className={clsx(
											"flex rounded-full justify-center items-center text-center p-5 border w-full"
										)}
										style={{
											borderColor: "#D0F601",
											backgroundColor: "#D0F601",
										}}>
										<Text
											style={{ fontWeight: 700 }}
											className="font-GilroyMedium">
											Zaloguj
										</Text>
									</MotiView>
								)}
							</Pressable>
						</>
					)}
				</View>
			</View>
		);
	};

	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x;
		const currentIndex = Math.round(contentOffsetX / width);
		setCurrentSlideIndex(currentIndex);
	};
	if (isAppFirstLaunched == null) return null;
	if (
		isAppFirstLaunched == false &&
		(userIsAnonymous || authState.authenticated || authState.anonymous)
	) {
		console.log(isAppFirstLaunched, "lauch");
		return <Redirect href="/(tabs)/home" />;
	}

	return (
		<SafeAreaView className=" text-white bg-black h-full w-full">
			<FlatList
				ref={ref}
				onMomentumScrollEnd={updateCurrentSlideIndex}
				pagingEnabled
				data={cards}
				contentContainerStyle={{ height: height * 0.75 }}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => <Slide item={item} />}
			/>
			<Footer />
		</SafeAreaView>
	);
}
