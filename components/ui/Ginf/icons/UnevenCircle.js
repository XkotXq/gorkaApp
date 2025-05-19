import React from "react";
import Svg, { Path } from "react-native-svg";

const UnevenCircle = ({ width = 12, height = 12, fill = "white" }) => (
  <Svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 71 71"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={1.5}
    >
      <Path
        d="M5908.87 2088.05c-2.47-7.27-13.51-14.76-13.51-22.28 0-7.52 11.04-15.01 13.51-22.28 3.4-6.89.88-20 6.2-25.31 5.32-5.32 18.42-2.81 25.31-6.2 7.28-2.47 14.76-13.52 22.28-13.52 7.52 0 15.01 11.05 22.28 13.52 6.9 3.39 20 .88 25.32 6.2 5.31 5.31 2.8 18.42 6.2 25.31 2.47 7.27 13.51 14.76 13.51 22.28 0 7.52-11.04 15.01-13.51 22.28-3.4 6.89-.89 20-6.2 25.31-5.32 5.32-18.42 2.81-25.32 6.21-7.27 2.46-14.76 13.51-22.28 13.51-7.52 0-15-11.05-22.28-13.51-6.89-3.4-19.99-.89-25.31-6.21-5.32-5.31-2.8-18.42-6.2-25.31z"
        transform="translate(-3081.3 -2334.05) translate(657.682 1517.43) scale(.41238)"
        fill="none"
        stroke={fill}
        strokeWidth="20.21px"
      />
    </Svg>
);
export default UnevenCircle;
