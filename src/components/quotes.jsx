import React, {useState, useEffect} from 'react';
import './quotes.css';
import axios from 'axios';
// import quotationsData from'./quotations.json';
// const apiKey = import.meta.env.VITE_QUOTE_API_KEY

function Resources() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    GetNewQuote();
    }, []);

  let GetNewQuote = () => {
    // axios.get("http://quotes.rest/quote/random.json?api_key={apiKey}")
    // axios.get("http://api.quotable.io/random")
    // const response = axios.get('quotations.json')
    // .then((response) => {
    //     const quote = response.data;
    //     console.log(quote);
    //     // setQuote(quote.content);
    //     // setAuthor(quote.author);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching data:', error);
    //   });
        axios.get('./quotations.json')
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
    // <div className="Quotebox">
        //  <div className="quote">
        //     <h2>{quote}</h2>
        //     <small>-{author}-</small>
        //  {/* </div>   <br /> */}
        //  <button className="btn" onClick={GetNewQuote}>Generate New Quote</button>
        // </div>
        <div>
        {/* <h3>An amble reflection:</h3> */}
        <div className="quote">
          <h2>{quote}</h2>
          <small>- {author}</small>
        </div>
        <button className="btn" onClick={GetNewQuote}>Get a New Quote</button>
      </div>
  );
}

export default Resources;