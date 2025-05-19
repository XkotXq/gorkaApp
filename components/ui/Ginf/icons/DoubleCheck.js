import React from "react";
import Svg, { Path } from "react-native-svg";

const DoubleCheck = ({ width = 12, height = 12, fill = "white" }) => (
  <Svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 66 54"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
    >
       <Path
        d="M3030.56 2217.13c-.66-.05-1.34-.09-2.04-.11l.28-8.33c8.99.3 16.01 2.6 21.29 6.64.74.57 1.44 1.17 2.11 1.8.1-.35.21-.7.32-1.04 4.91-15.58 14.38-26.6 26.12-35.35l4.98 6.68c-10.71 7.99-19.33 18.07-23.56 32.53-.69 2.37-1.27 4.86-1.71 7.48l-7.07 1.11c-.97-1.43-2.1-2.7-3.39-3.81a18.85 18.85 0 00-1.71-1.75c-1.92-1.72-4.21-3.07-6.86-4.05-2.57-.94-5.49-1.54-8.76-1.8zm54.77-28.09c1.3-1.09 2.64-2.13 4-3.15l4.98 6.68c-12.46 9.29-22.1 21.42-25.28 40l-7.8 1.23c-.79-1.51-1.72-2.88-2.8-4.09l1.9-.3c.46-2.74 1.07-5.34 1.81-7.81.25.22.5.45.75.68 3.35-11.24 9.04-20.14 16.23-27.53a81.87 81.87 0 016.21-5.71z"
        transform="translate(-3055.91 -2192.37) translate(27.392 11.628)"
        fill={fill}
      />
    </Svg>
);
export default DoubleCheck;
