import { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    colorPrimaryHover: '#000',
    borderRadius: 3,
  },

  components: {
    Button: {
      borderRadius: 3,
    },
    Card: {
      paddingLG: 0
    },
    Progress: {
      defaultColor: '#eedc40'
    }
  },
}