import React from "react";
import "../Styles/Homepage.css";

function HomePage() {
  return (

    <div className="container">
      <div className="header m-4 p-1">
        <h1 className="text-center">Menu Extractor</h1></div>

        <div className="operationCard card">
          <div className="card-body">
            <input id="urlInput" type="text" placeholder="Enter Your Link"/>
            <button className="btn btn-primary mt-2">Generate</button>
          </div>
        </div>
    
    </div>
  );
}

export default HomePage;
