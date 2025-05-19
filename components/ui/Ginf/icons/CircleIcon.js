import React from "react";
import Svg, { Circle } from "react-native-svg";

const CircleIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
    >
      <Circle
        cx={3052.04}
        cy={2474.47}
        r={9.06}
        transform="translate(-3042.98 -2465.41)"
        fill={fill}
      />
    </Svg>
);
export default CircleIcon;
