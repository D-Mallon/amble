import React, {useState, useEffect} from 'react';
import './quotes.css';
import axios from 'axios';

function Resources() {

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  let GetNewQuote = () => {
    axios.get("http://api.quotable.io/random")
    .then((response) => {
        const quote = response.data;
        setQuote(quote.content);
        setAuthor(quote.author);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  return (
    // <div className="Quotebox">
         <div className="quote">
            <h2>{quote}</h2>
            <small>-{author}-</small>
         {/* </div>   <br /> */}
         <button className="btn" onClick={GetNewQuote}>Generate New Quote</button>
        </div>
  );
}

export default Resources;