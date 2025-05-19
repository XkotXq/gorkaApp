import React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowRight = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 88 108"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
          <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3841.15 -1312.02) matrix(.78424 0 0 -.78424 1275.38 3323.29)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
      <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3841.15 -1312.02) matrix(.78424 0 0 .78424 1275.38 -591.331)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
    </Svg>
);
export default ArrowRight;
