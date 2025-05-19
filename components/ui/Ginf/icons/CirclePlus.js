import React from "react";
import Svg, { Path } from "react-native-svg";

const CirclePlusIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 149 149"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
         <Path
        d="M4153.02 1246.95v-6.11c12.55 0 22.75-10.2 22.75-22.75h6.11c0 15.93-12.93 28.86-28.86 28.86zm28.86-28.86h6.11c0 12.55 10.2 22.75 22.76 22.75v6.11c-15.93 0-28.87-12.93-28.87-28.86zm28.87 28.86v6.11c-12.56 0-22.76 10.2-22.76 22.76h-6.11c0-15.93 12.94-28.87 28.87-28.87zm-28.87 28.87h-6.11c0-12.56-10.2-22.76-22.75-22.76v-6.11c15.93 0 28.86 12.94 28.86 28.87z"
        transform="translate(-2900.14 -1718.66) matrix(.66667 0 0 .66667 1050.19 539.916) translate(-5669.06 -671.732) scale(2.04575)"
        fill={fill}
      />
      <Path
        d="M3396.02 2346.77c37.2 0 67.39 30.2 67.39 67.39s-30.19 67.39-67.39 67.39c-37.19 0-67.38-30.2-67.38-67.39s30.19-67.39 67.38-67.39zm0 8.34c-32.59 0-59.05 26.46-59.05 59.05 0 32.6 26.46 59.06 59.05 59.06 32.6 0 59.06-26.46 59.06-59.06 0-32.59-26.46-59.05-59.06-59.05z"
        transform="translate(-2900.14 -1718.66) matrix(.66667 0 0 .66667 1050.19 539.916) matrix(1.5 0 0 1.5 -2207.99 -1742.01)"
        fill={fill}
      />
    </Svg>
);
export default CirclePlusIcon;
