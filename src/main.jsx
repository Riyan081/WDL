import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Body from "./components/Body"




const App =()=>{
  return(
    <div>
     <Body/>
    </div>
  );
};




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
