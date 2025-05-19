import React from "react";
import Svg, { Path } from "react-native-svg";

const LogoTWS = ({ width = 12, height = 12, fill = "white" }) => (
  <Svg
  width={width}
  height={height}
  xmlns="http://www.w3.org/2000/svg"
  fillRule="evenodd"
  clipRule="evenodd"
  strokeLinejoin="round"
  strokeMiterlimit={2}
  viewBox="0 0 119 101"
>
  <Path
    d="M283.465 80.176v160.352h-80.176v-80.176l80.176-80.176z"
    transform="translate(-6345.15 -1891.28) matrix(.1 0 0 .1 5807.19 1734.73) translate(5379.62 1565.52) scale(4.16667)"
    fill="#8e16c3"
  />
  <Path
    d="M56.693 183.835V70.449v113.386zm0-113.386V0h80.176v103.659l-23.483 23.483-56.693-56.693zm80.176 33.21l89.903-89.903 56.693 56.693-146.596 146.596V103.659zm0 113.386v23.483h-23.483l23.483-23.483zm-23.483 23.483H56.693v-56.693l56.693 56.693zM56.693 183.835L0 127.142l56.693-56.693v113.386z"
    transform="translate(-6345.15 -1891.28) matrix(.1 0 0 .1 5807.19 1734.73) translate(5379.62 1565.52) scale(4.16667)"
    fill={fill}
  />
</Svg>
);
export default LogoTWS;
