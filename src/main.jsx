import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'



const App =()=>{
  return(
    <div>
      <h1 className="text-4xl font-bold text-blue-500">App</h1>
    </div>
  );
};




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
