import React from "react";
import Svg, { Path } from "react-native-svg";

const HomeIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 119 124"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
       <Path
        d="M3288.91 2444.25c11.82 27.69 36.63 51.05 66.73 51.54"
        transform="translate(-3047.76 -2111.2) translate(2.322) rotate(-90 3041.526 2432.825)"
        fill="none"
        stroke={fill}
        strokeWidth="8.33px"
      />
      <Path
        d="M3288.91 2444.25c11.82 27.69 36.63 51.05 66.73 51.54"
        transform="translate(-3047.76 -2111.2) translate(2.322) matrix(0 -1 -1 0 5600.29 5474.35)"
        fill="none"
        stroke={fill}
        strokeWidth="8.33px"
      />
      <Path
        d="M3166.05 2193.12v118.47h-118.47v-118.47"
        transform="translate(-3047.76 -2111.2) translate(2.322) matrix(.15192 0 0 -.22616 2632.52 2715.92)"
        fill="none"
        stroke={fill}
        strokeWidth="43.26px"
      />
      <Path
        d="M3071.33 2177.92v41.26"
        transform="translate(-3047.76 -2111.2) translate(2.322) translate(-2.322)"
        fill="none"
        stroke={fill}
        strokeWidth="8.33px"
      />
      <Path
        d="M3071.33 2177.92v41.26"
        transform="translate(-3047.76 -2111.2) translate(2.322) translate(68.652)"
        fill="none"
        stroke={fill}
        strokeWidth="8.33px"
      />
    </Svg>
);
export default HomeIcon;