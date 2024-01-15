import { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    // colorPrimaryHover: '#fff',
    // colorPrimary: '#fff',
    borderRadius: 4,
  },

  components: {
    Button: {
      borderRadius: 3,
    },
    Card: {
      paddingLG: 0,
    },
    Progress: {
      defaultColor: "#eedc40",
    },
    Pagination: {
      itemActiveBg: "#1890ff",
    },
  },
};
