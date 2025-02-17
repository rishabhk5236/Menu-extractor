import "./App.css";
import HomePage from "./Components/HomePage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        
      />
      <HomePage />
    </div>
  );
}

export default App;
