import { theme } from "../theme";
import { ConfigProvider } from "antd";
import { Movies } from "../module";
import "normalize.css";
import "./Antd.css";
import "./App.css";

function App() {
  return (
    <ConfigProvider theme={theme}>
      <main className="container">
        <Movies />
      </main>
    </ConfigProvider>
  );
}
export { App };
