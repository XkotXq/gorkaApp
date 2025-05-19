import React from "react";
import Svg, { Circle } from "react-native-svg";

const DoubleCircle = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 12 36"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
         <Circle
        cx={3052.04}
        cy={2474.47}
        r={9.06}
        transform="translate(-3009.73 -2359.36) matrix(.65182 0 0 .65182 1026.26 752.363)"
        fill={fill}
      />
      <Circle
        cx={3052.04}
        cy={2474.47}
        r={9.06}
        transform="translate(-3009.73 -2359.36) matrix(.65182 0 0 .65182 1026.26 775.985)"
        fill={fill}
      />
    </Svg>
);
export default DoubleCircle;
