import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Body from "./components/Body"
import appStore from './assets/appStore';
import { Provider } from 'react-redux';




const App =()=>{
  return(
    <Provider store={appStore}>
     <Body/>
     </Provider>

  );
};




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
