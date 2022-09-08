import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheet/styles.css";
import logo from "../../assets/logo.png";

function SearchComponent() {
  const CLIENT_ID = "c639ba0508af4982a9504cf017459b40";
  const SPOTIFY_ENDPOINT = "https://accounts.spotify.com/authorize";
  const REDIRECT_URI = "http://localhost:8080/";

  // http://localhost:8080/#access_token=BQAHXokCpGT27X5Oawd4QuIQuleuOsVxUtUZYntHCL4caRV0Z_d2l_sNI-s6WTFwE2HbG7LNBCafJ_FMt9Vkqnt3lMFzdrz1YP2-BCpHG4APQp1a6Cd_ztSqdCt-AYxpk6-n6gn9YDntj17tJ-8Su9_9QTfNdQmyJkWB-KlWvEhKxZI&token_type=Bearer&expires_in=3600

  const handleLogin = () => {
    window.location = `${SPOTIFY_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&show_dialogue=true`
  };

  const getReturned = (hash) => {
    const afterHash = hash.substring(1);
    const params = afterHash.split('&');
    const paramSplit = params.reduce((paramObject, current) => {
      const [key, value] = current.split('=');
      paramObject[key] = value;
      console.log('paramObject: ', paramObject);
      setToken(paramObject.access_token);
      return paramObject;
    }, {});
  };

  useEffect(() => {
    if (window.location.hash) {
      getReturned(window.location.hash);
    }
  }, []);

  //initating react hooks
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  const handleBookName = (e) => {
    setBookName(e.target.value);
  };
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const handleViewAllRecs = () => {
    navigate("/savedRecs");
  };
  const handleSubmit = () => {
    if (!bookName || !author) {
      alert("Please enter both fields.");
      return;
    }
    // redirecting to loading component
    navigate("/loading", {
      state: { book: bookName, author: author, token: token },
    });
  };

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const response = await fetch("/api/authToken/");
  //     const authToken = await response.json();
  //     setToken(authToken);
  //   };
  //   fetchToken();
  // }, []);

  return (
    <div>
      {/* button redirecting to spotify auth for single user */}
      <div><button onClick={handleLogin} className='submitButton'>
          Login to Spotify
        </button></div>
      <div></div>
      <div className="form">
        <div className="header">
          <img src={logo} width={"50%"} />
        </div>
        <b>
          {/* creating input file for book names */}
          <label className="label">Book Name</label>
        </b>

        <input
          type="text"
          value={bookName}
          onChange={handleBookName}
          className="userInput"
        />
        <br />
        <b>
          {/* creating input file for author names */}
          <label className="label"> Author </label>
        </b>

        <input
          type="text"
          value={author}
          onChange={handleAuthor}
          className="userInput"
        />
        <br />
        <button onClick={handleViewAllRecs} className="submitButton">
          View All Saved Recs
        </button>
        <button onClick={handleSubmit} className="submitButton">
          Submit
        </button>
      </div>
    </div>
  );
}

export default SearchComponent;
