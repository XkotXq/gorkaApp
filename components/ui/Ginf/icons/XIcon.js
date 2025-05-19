import React from "react";
import Svg, { Path } from "react-native-svg";

const XIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 161 161"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
      <Path
        d="M1026.33 2376.01l94.49.13"
        transform="translate(-1945.05 -1884.44) rotate(44.919 4665.66 3236.974) scale(1.76777)"
        fill="none"
        stroke={fill}
        strokeWidth="4.71px"
      />
      <Path
        d="M1026.33 2376.01l94.49.13"
        transform="translate(-1945.05 -1884.44) scale(-1.76777 1.76777) rotate(44.919 1493.488 -940.621)"
        fill="none"
        stroke={fill}
        strokeWidth="4.71px"
      />
    </Svg>
);
export default XIcon;
