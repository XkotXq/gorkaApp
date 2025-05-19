import React from "react";
import Svg, { Path, G } from "react-native-svg";

const ShareIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 134 108"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
        <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3121.41 -1889.77) matrix(.78424 0 0 .78424 603.54 -13.577) translate(-2.322)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
      <Path
        d="M3281.22 2436.56c11.82 27.69 44.97 58.47 91.86 59.23"
        transform="translate(-3121.41 -1889.77) matrix(.78424 0 0 .78424 603.54 -13.577) matrix(1 0 0 -1 -2.322 4991.59)"
        fill="none"
        stroke={fill}
        strokeWidth="10.63px"
      />
      <G>
        <Path
          d="M3373.08 2495.79c-95.82-6.14-186.73 6.96-187.77 59.24"
          transform="translate(-3121.41 -1889.77) matrix(.62903 0 0 .78424 1125.26 -13.577)"
          fill="none"
          stroke={fill}
          strokeWidth="11.72px"
        />
      </G>
    </Svg>
);
export default ShareIcon;