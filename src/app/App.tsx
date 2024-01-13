import { theme } from '../theme';
import { ConfigProvider } from 'antd';
import { Movies } from '../module';
import Cookies from "js-cookie";
import 'normalize.css'
import './Antd.css'
import './App.css'

const isSessionMovies = Cookies.get('guest_session_id')

function App() {
  return (
    <ConfigProvider theme={theme}>
      <main className='container'>
        <Movies />
      </main>
    </ConfigProvider>
  )
}
export { App, isSessionMovies }
