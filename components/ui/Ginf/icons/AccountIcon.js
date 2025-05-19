import React from "react";
import Svg, { Path } from "react-native-svg";

const AccountIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 149 129"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
          <Path
        d="M2779.07 1990.19c39.36-28.39 78.73-29.43 118.11 0"
        transform="translate(-2918.9 -2017.91) translate(154.855 140.751)"
        fill="none"
        stroke={fill}
        strokeWidth="8.33px"
      />
      <Path
        d="M2838.12 1883.85c18.14 0 33.37 16.09 33.37 36.47 0 20.37-15.23 36.46-33.37 36.46-18.13 0-33.37-16.09-33.37-36.46 0-20.38 15.24-36.47 33.37-36.47zm0 8.34c-13.82 0-25.03 12.6-25.03 28.13 0 15.52 11.21 28.13 25.03 28.13s25.03-12.61 25.03-28.13c0-15.53-11.21-28.13-25.03-28.13z"
        transform="translate(-2918.9 -2017.91) translate(154.855 140.751)"
        fill={fill}
      />
    </Svg>
);
export default AccountIcon;
