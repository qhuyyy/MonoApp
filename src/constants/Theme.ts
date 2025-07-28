import { Theme } from '@react-navigation/native';

export const lightTheme: Theme & {
  fonts: {
    regular: { fontFamily: string; fontWeight: string };
    medium: { fontFamily: string; fontWeight: string };
    bold: { fontFamily: string; fontWeight: string };
    heavy: { fontFamily: string; fontWeight: string };
  };
} = {
  dark: false,
  colors: {
    primary: '#3498db',
    background: '#ffffff',
    card: '#f8f9fa',
    text: '#000000',
    border: '#dcdcdc',
    notification: '#ff4757',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: 'normal' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};

export const darkTheme: Theme & {
  fonts: {
    regular: { fontFamily: string; fontWeight: string };
    medium: { fontFamily: string; fontWeight: string };
    bold: { fontFamily: string; fontWeight: string };
    heavy: { fontFamily: string; fontWeight: string };
  };
} = {
  dark: true,
  colors: {
    primary: '#1abc9c',
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    border: '#272729',
    notification: '#ff4757',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: 'normal' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};
