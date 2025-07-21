import * as React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
const SVGComponent = (props : any) => (
  <Svg
    width={414}
    height={287}
    viewBox="0 0 414 287"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0 0H414V261.759C414 261.759 366 287 207 287C48 287 0 261.759 0 261.759V0Z"
      fill="url(#paint0_linear_1_406)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_1_406"
        x1={-10.5}
        y1={-17.0712}
        x2={239.544}
        y2={393.953}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#429690" />
        <Stop offset={1} stopColor="#2A7C76" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
