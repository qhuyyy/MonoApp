declare module 'react-native-vector-icons/FontAwesome5';
declare module 'react-native-vector-icons/Ionicons'

declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'papaparse';