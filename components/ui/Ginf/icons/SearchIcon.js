import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const HomeIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 138 138"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
      <Circle
        cx={2272.59}
        cy={1950.78}
        r={36.692}
        transform="translate(-2224.42 -2064.86) translate(-283.128 -80.13) scale(1.12663)"
        fill="none"
        stroke={fill}
        strokeWidth="7.4px"
      />
      <Path
        d="M2354.01 2032.2l-57.63-57.63"
        transform="translate(-2224.42 -2064.86) matrix(.82505 0 0 .82505 411.827 517.775)"
        fill="none"
        stroke={fill}
        strokeWidth="10.1px"
      />
      <Path
        d="M4153.02 1246.95v-6.36c12.42 0 22.5-10.08 22.5-22.5h6.36c0 15.93-12.93 28.86-28.86 28.86zm28.86-28.86h6.37c0 12.42 10.08 22.5 22.5 22.5v6.36c-15.93 0-28.87-12.93-28.87-28.86zm28.87 28.86v6.37c-12.42 0-22.5 10.08-22.5 22.5h-6.37c0-15.93 12.94-28.87 28.87-28.87zm-28.87 28.87h-6.36c0-12.42-10.08-22.5-22.5-22.5v-6.37c15.93 0 28.86 12.94 28.86 28.87z"
        transform="translate(-2224.42 -2064.86) translate(-3198.03 485.063) scale(1.30928)"
        fill={fill}
      />
    </Svg>
);
export default HomeIcon;