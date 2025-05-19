import React from "react";
import Svg, { Path } from "react-native-svg";

const Check = ({ width = 12, height = 12, fill = "white" }) => (
  <Svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 48"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
    >
      <Path
        d="M2812.91 2105.31l.27-8.1c9.96.33 17.45 3.19 22.76 8.21 4.68-15.7 14.05-26.7 25.72-35.4l4.85 6.5c-12.13 9.04-21.5 20.84-24.59 38.91l-7.59 1.2c-3.76-7.2-10.83-10.97-21.42-11.32z"
        transform="translate(-3028.52 -2180.74) translate(136.634 52.6) scale(1.02808)"
        fill={fill}
      />
    </Svg>
);
export default Check;
