import ReactDom from 'react-dom/client'
import App from './App'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

ReactDom.createRoot(document.getElementById('root'))
.render(
    <ThemeProvider theme={theme}>
        <App/>
    </ThemeProvider>
)