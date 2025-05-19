// filepath: /path/to/icons/StarIcon.js
import React from "react";
import Svg, { Path } from "react-native-svg";

const StarIconFill = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 60 60"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
        <Path
        d="M4153.02 1248.99v-4.07c14.8 0 26.83-12.03 26.83-26.83h4.07c0 14.8 12.02 26.83 26.83 26.83v4.07c-14.81 0-26.83 12.02-26.83 26.83h-4.07c0-14.81-12.03-26.83-26.83-26.83z"
        transform="translate(-3387.02 -1265.2) translate(-861.002 19.245) scale(1.02288)"
        fill={fill}
      />
    </Svg>
);
export default StarIconFill;
