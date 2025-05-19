import React from "react";
import Svg, { Path } from "react-native-svg";

const BookStack = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 102 99"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
       <Path
        d="M3244.58 2144.75v27.93h-72.91c-3.7 0-7.25-1.47-9.87-4.08a13.98 13.98 0 01-4.09-9.88 13.963 13.963 0 0113.96-13.97h72.91zm-8.34 8.33h-64.57c-1.49 0-2.92.6-3.98 1.65a5.63 5.63 0 00-1.65 3.99c0 1.49.59 2.93 1.65 3.98a5.624 5.624 0 003.98 1.65h64.57v-11.27z"
        transform="translate(-3285.22 -2144.1) translate(135.026 34.799)"
        fill={fill}
      />
      <Path
        d="M3244.58 2144.75h-72.91a13.963 13.963 0 00-13.96 13.97c0 3.7 1.47 7.26 4.09 9.88a13.99 13.99 0 009.87 4.08h72.91v-27.93zm-8.34 8.33v11.27h-64.57c-1.49 0-2.92-.59-3.98-1.65a5.607 5.607 0 01-1.65-3.98c0-1.5.59-2.93 1.65-3.99a5.666 5.666 0 013.98-1.65h64.57z"
        transform="translate(-3285.22 -2144.1) matrix(-1 0 0 1 6537.31 62.734)"
        fill={fill}
      />
      <Path
        d="M3244.58 2144.75h-72.91a13.963 13.963 0 00-13.96 13.97c0 3.7 1.47 7.26 4.09 9.88a13.99 13.99 0 009.87 4.08h72.91v-27.93zm-8.34 8.33v11.27h-64.57c-1.49 0-2.92-.59-3.98-1.65a5.607 5.607 0 01-1.65-3.98c0-1.5.59-2.93 1.65-3.99a5.666 5.666 0 013.98-1.65h64.57z"
        transform="translate(-3285.22 -2144.1) matrix(-1 0 0 1 6537.31 6.863)"
        fill={fill}
      />
    </Svg>
);
export default BookStack;
