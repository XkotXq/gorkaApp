import React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowTop = ({ width = 12, height = 12, fill = "white" }) => (
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
        transform="translate(-3830.71 -1322.45) matrix(0 -.78424 -.78424 0 5841.99 3975.28)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
      <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3830.71 -1322.45) matrix(0 -.78424 .78424 0 1927.36 3975.28)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
    </Svg>
);
export default ArrowTop;
