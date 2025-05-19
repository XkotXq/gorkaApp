import {
	View,

} from "react-native";
import { MotiView } from "moti";
import clsx from "clsx";

export default function BorderFrame({ children, className }) {
	return (
		// <View>
			<MotiView
				from={{ scale: 0.9, rotation: 0 }}
				animate={{ scale: 1 }}
                to={{ scale: 1, rotation: 3 }}
				transition={{
					type: "spring",
				}}
				className={clsx(
					"flex rounded-full justify-center items-center text-center p-5 border transform border-white",
					className
				)}>
				{children}
			</MotiView>
		// </View>
	);
}
