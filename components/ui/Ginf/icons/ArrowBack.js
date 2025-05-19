import React from "react";
import Svg, { Path } from "react-native-svg";

const ArrowBack = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 167 108"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
         <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3320.46 -1423.88) matrix(-.78424 0 0 .78424 5971.47 -479.473) translate(-2.322)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
      <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3320.46 -1423.88) matrix(-.78424 0 0 .78424 5971.47 -479.473) matrix(1 0 0 -1 -2.322 4991.59)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
      <Path
        d="M3373.08 2495.79c-37.08-1.15-131.7-1.81-207.52-1.81-44.82 0-44.82 57.66 0 57.66h44.46"
        transform="translate(-3320.46 -1423.88) matrix(-.78424 0 0 .78424 5971.47 -479.473) matrix(.80209 0 0 1 665.248 0)"
        fill="none"
        stroke={fill}
        strokeWidth="11.72px"
      />
    </Svg>
);
export default ArrowBack;
