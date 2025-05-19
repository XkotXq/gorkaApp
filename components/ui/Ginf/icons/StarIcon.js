// filepath: /path/to/icons/StarIcon.js
import React from "react";
import Svg, { Path } from "react-native-svg";

const StarIcon = ({ width = 12, height = 12, fill = "white" }) => (
	<Svg
		width={width}
		height={height}
		viewBox="0 0 67 67"
		fillRule="evenodd"
		clipRule="evenodd"
		strokeLinejoin="round"
		strokeMiterlimit={2}>
		<Path
			d="M4153.02 1246.95v-2.03c14.8 0 26.83-12.03 26.83-26.83h2.03c0 15.93-12.93 28.86-28.86 28.86zm28.86-28.86h2.04c0 14.8 12.02 26.83 26.83 26.83v2.03c-15.93 0-28.87-12.93-28.87-28.86zm28.87 28.86v2.04c-14.81 0-26.83 12.02-26.83 26.83h-2.04c0-15.93 12.94-28.87 28.87-28.87zm-28.87 28.87h-2.03c0-14.81-12.03-26.83-26.83-26.83v-2.04c15.93 0 28.86 12.94 28.86 28.87z"
			transform="translate(-3184.97 -1261.44) translate(-1059.3 19.245) scale(1.02288)"
			fill={fill}
		/>
	</Svg>
);
export default StarIcon;
