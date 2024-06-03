// export const colors = {
//   pri: "#f5f5f5",
//   priLighter: "#E0E0E0",
//   sec: "#C9FFC2",
//   secDarker: "#A5FF99",
//   white: "#f5f5f5",
//   black: "#141414",
//   gray: "gray",
//   lightGray: "#E0E0E0",
//   text: "#141414",
//   chatListConversatioins: "lightgray",
// };

const light = {
  pri: "#f5f5f5",
  priLighter: "#E0E0E0",
  sec: "#C9FFC2",
  secDarker: "#A5FF99",
  white: "#f5f5f5",
  black: "#141414",
  icon: "#141414",
  gray: "gray",
  lightGray: "#E0E0E0",
  text: "#141414",
  chatListConversatioins: "lightgray",
};

const dark = {
  pri: "#141414",
  priLighter: "#303030",
  sec: "#C9FFC2",
  secDarker: "#A5FF99",
  white: "#f5f5f5",
  black: "#000000",
  gray: "gray",
  lightGray: "#505050",
  text: "#f5f5f5",
  icon: "#f5f5f5",
  chatListConversatioins: "#303030",
};

export const colors = {
  light,
  dark,
};

export const base = {
  loader: colors["light"].pri,
  loaderBg: colors["light"].sec,
  statusBarBg: colors["light"].black,
  statusBarColor: colors["light"].white,
};

export const chat = {
  messageUserBg: "#C9FFC2",
  messageAssistantBg: colors["light"].lightGray,
};

export const navTheme = {
  tabBarActiveTintColor: colors["light"].secDarker,
  tabBarInactiveTintColor: colors["light"].lightGray,
  navIcons: "#f5f5f5",
  colors: {
    // primary: 'rgb(255, 45, 85)',
    background: colors["light"].pri,
    card: colors["light"].black,
    text: colors["light"].white,
    border: colors["light"].priLighter,
    // notification: 'rgb(255, 69, 58)',
  },
};
