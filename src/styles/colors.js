const baseColors = {
  sec: "#C9FFC2",
  secDarker: "#A5FF99",
  white: "#f5f5f5",
  whiteDarker: "#EBEBEB",
  gray: "gray",
  loader: "#f5f5f5",
  loaderBg: "#C9FFC2",
};

const light = {
  ...baseColors,
  pri: "#f5f5f5",
  priLighter: "#E0E0E0",
  black: "#141414",
  icon: "#141414",
  lightGray: "#E0E0E0",
  text: "#141414",
  statusBarBg: "#141414",
  statusBarColor: "#f5f5f5",
  modalBg: "#f5f5f5",
};

const dark = {
  ...baseColors,
  pri: "#000000",
  priLighter: "#3D3D3D",
  black: "#000000",
  text: "#f5f5f5",
  icon: "#f5f5f5",
  lightGray: "gray",
  statusBarBg: "#000000",
  statusBarColor: "#f5f5f5",
  modalBg: "#3D3D3D",
};

export const colors = {
  light,
  dark,
};

export const chat = {
  messageUserBg: "#C9FFC2",
  messageAssistantBg: colors.light.lightGray,
};

export const navTheme = {
  light: {
    tabBarActiveTintColor: colors.light.secDarker,
    tabBarInactiveTintColor: colors.light.lightGray,
    navIcons: "#f5f5f5",
    colors: {
      // primary: 'rgb(255, 45, 85)',
      background: colors.light.pri,
      card: colors.light.black,
      text: colors.light.white,
      border: colors.light.priLighter,
      // notification: 'rgb(255, 69, 58)',
    },
  },
  dark: {
    tabBarActiveTintColor: colors.dark.secDarker,
    tabBarInactiveTintColor: colors.dark.lightGray,
    navIcons: "#f5f5f5",
    colors: {
      // primary: 'rgb(255, 45, 85)',
      background: colors.dark.pri,
      card: colors.dark.black,
      text: colors.dark.white,
      border: colors.dark.priLighter,
      // notification: 'rgb(255, 69, 58)',
    },
  },
};
