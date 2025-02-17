import React, { useState } from "react";
import "../Styles/Homepage.css";
import { toast } from "react-toastify";
import loader from "../Assets/Loader.gif";
import xlsx from "json-as-xlsx";

function HomePage() {
  // change Port here
  const PORT = 5500;

  // these are the settings for generating the excel fiel from the json output 
  let settings = {
    fileName: "ExcelSheet", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  };

  // this code is related to AI maniputlation of text
  const Gemini_API = "AIzaSyBdTxoCOu2KI4EsTi5XHlVdL-AAi_rlu8o";
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(Gemini_API);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const [Link, updateLink] = useState({ url: "" });
  const [responseGenerated, setResponseGenerated] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const linkOnChange = (e) => {
    updateLink({ ...Link, [e.target.name]: e.target.value });
  };

  const transformText = async (data) => {
    const prompt = `return a json array of the given schema {
      sheet: "Menu",
      columns: [
        { label: "Category", value: "category" }, // Top level data
        { label: "Item Name", value: "item" }, // Top level data
        { label: "Price", value: "price" }, // Top level data
       
      ],
      content: [
        { category: "FoodCategory", item: "Item Name", price:"Rs. price" },
      ],
    }
       for the food items ,category and their prices from the given data : "${data} "`;

    const text = await model.generateContent(prompt);

    const output = await JSON.parse(text.response.text());
    return output;
  };

  // this code is for generating the outputs
  const generateResponse = async () => {

    try{
    setResponseGenerated(false);
    setLoading(true);
    console.log("generating..");
    const response = await fetch(`http://localhost:${PORT}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({
        url: Link.url,
      }),
    });

    const output = await response.json();
    if (!output.error) {
      setResponseGenerated(true);
      toast.success("Data Generated");
    } else {
      toast.error(output.error);
      return;
    }
    
    const jsonData = await transformText(output.text);

    console.log([jsonData]);
    xlsx([jsonData], settings);

    setLoading(false);
    }catch{
      generateResponse();
    }
  };

  // this code is for resetting the states
  const resetResponse = () => {
    updateLink({ url: "" });
    setResponseGenerated(false);
    setResponseText("");
  };

  return (
    <div className="container">
      {loading && (
        <div className="Loader">
          <img src={loader} alt=".." />
          {responseGenerated && loading ? <h1>Congratulations Data Generated ! Downloading Excel...</h1> : <h1>Loading...</h1>}
          
          
        </div>
      )}
      <div className="header m-4 p-1">
        <h1 className="text-center">Menu Extractor</h1>
      </div>

      <div className="operationCard card">
        <div className="card-body">
          <input
            id="urlInput"
            type="text"
            placeholder="Enter Your Link"
            onChange={linkOnChange}
            value={Link.url}
            name="url"
          />
          <div>
            <button className="btn btn-primary m-2" onClick={generateResponse}>
              Generate response
            </button>
            <button className="btn btn-danger m-2" onClick={resetResponse}>
              Reset
            </button>
          </div>

         
        </div>
      </div>
    </div>
  );
}

export default HomePage;
