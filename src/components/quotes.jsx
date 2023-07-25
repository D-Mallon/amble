import React, {useState, useEffect} from 'react';
import './quotes.css';
import axios from 'axios';
// import quotationsData from'./quotations.json';
// const apiKey = import.meta.env.VITE_QUOTE_API_KEY

function Quotes() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    GetNewQuote();
    }, []);

  let GetNewQuote = () => {
        axios.get('users/getquote')
        .then((response) => {
        const quotationsData = response.data;
        const quoteAuthors = Object.keys(quotationsData);
        console.log(quoteAuthors)
        const randomIndex = Math.floor(Math.random() * quoteAuthors.length);
        const randomAuthor = quoteAuthors[randomIndex];
        const randomQuote = quotationsData[randomAuthor];
        setQuote(randomQuote);
        setAuthor(randomAuthor);
        })
        .catch((error) => {
        console.error('Error fetching data:', error);
    });
};
  return (
        <div className ="quotebox">
        <div className="quote">
          <h2>{quote}</h2>
          <small>- {author}</small>
        </div>
        <button className="btn" onClick={GetNewQuote}>Get a New Quote</button>
      </div>
  );
}

export default Quotes;