import React from "react";
import Svg, { Path } from "react-native-svg";

const EventIcon = ({ width = 12, height = 12, fill = "white" }) => (
    <Svg
        width={width}
        height={height}
        viewBox="0 0 161 146"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit={2}>
        <Path
        d="M2905.54 1986.23l-.28 1.87-.81 1.78-1.31 1.64-1.79 1.45-2.17 1.19-2.46.88-2.67.54-2.8.19h-106.26l-2.8-.19-2.67-.54-2.46-.88-2.17-1.19-1.79-1.45-1.31-1.64-.81-1.78-.28-1.87v-60.68h134.84v60.68zm-8.36-55.1h-118.11v55.1c0 1.05.62 2.06 1.73 2.8 1.11.74 2.62 1.16 4.19 1.16h106.26c1.57 0 3.08-.42 4.19-1.16 1.11-.74 1.74-1.75 1.74-2.8v-55.1z"
        transform="translate(-2757.62 -2010.96) translate(11.484 -1.25) scale(.9967) matrix(1 0 0 1.49863 -2.322 -832.586)"
        fill={fill}
      />
      <Path
        d="M2792.2 2061.19c5.51-7.64 4.79-13.85-.21-18.75"
        transform="translate(-2757.62 -2010.96) translate(11.484 -1.25) scale(.9967) rotate(45 3829.91 1413.65) scale(1.26791)"
        fill="none"
        stroke={fill}
        strokeWidth="6.59px"
      />
      <Path
        d="M2792.2 2061.19c5.51-7.64 4.79-13.85-.21-18.75"
        transform="translate(-2757.62 -2010.96) translate(11.484 -1.25) scale(.9967) scale(-1.2679 1.2679) rotate(45 784.05 -4284.673)"
        fill="none"
        stroke={fill}
        strokeWidth="6.59px"
      />
      <Path
        d="M4153.02 1246.95v-8.17c11.42 0 20.69-9.27 20.69-20.69h8.17c0 15.93-12.93 28.86-28.86 28.86zm28.86-28.86h8.18c0 11.42 9.27 20.69 20.69 20.69v8.17c-15.93 0-28.87-12.93-28.87-28.86zm28.87 28.86v8.18c-11.42 0-20.69 9.27-20.69 20.69h-8.18c0-15.93 12.94-28.87 28.87-28.87zm-28.87 28.87h-8.17c0-11.42-9.27-20.69-20.69-20.69v-8.18c15.93 0 28.86 12.94 28.86 28.87z"
        transform="translate(-2757.62 -2010.96) translate(11.484 -1.25) scale(.9967) translate(-1441.76 830.233) scale(1.02288)"
        fill={fill}
      />
    </Svg>
);
export default EventIcon;
