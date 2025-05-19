import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ImageBackground,
	SafeAreaView,
} from "react-native";
import { MotiView } from "moti";
import clsx from "clsx";

export default function ButtonAnim({ children, className = "bg-white", onPress, style, isLocked = false }) {
	return (
		<Pressable onPress={!isLocked ? onPress ? onPress : () => {} : () => {}}>
			{({ pressed }) => (
				<MotiView
					from={{ scale: 1, opacity: 1 }}
					animate={{ scale: !isLocked ? pressed ? 0.95 : 1 : 1, opacity: isLocked ?  0.6 : 1 }}
					transition={{
						type: "spring",
					}}
					className={clsx(
						"flex rounded-full justify-center items-center text-center p-5",
						className
					)} style={style}>
					{children}
				</MotiView>
			)}
		</Pressable>
	);
}
