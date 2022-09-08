import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheet/styles.css';
import logo from '../../assets/logo.png';
const { loginID } = require('../../.env');
function SearchComponent() {
  const SPOTIFY_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const REDIRECT_URI = 'http://localhost:8080/';

  const handleLogin = () => {
    window.location = `${SPOTIFY_ENDPOINT}?client_id=${loginID}&redirect_uri=${REDIRECT_URI}&response_type=token&show_dialogue=true`;
  };

  //initating react hooks
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  const handleBookName = (e) => {
    setBookName(e.target.value);
  };
  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };
  const handleViewAllRecs = () => {
    navigate('/savedRecs');
  };
  const handleSubmit = () => {
    if (!bookName || !author) {
      alert('Please enter both fields.');
      return;
    }
    // redirecting to loading component
    navigate('/loading', {
      state: { book: bookName, author: author, token: token },
    });
  };

  // fetching token for Spotify API
  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('/api/authToken/');
      const authToken = await response.json();
      setToken(authToken);
    };
    fetchToken();
  }, []);

  return (
    <div>
      {/* button redirecting to spotify auth for single user */}
      <div>
        <button onClick={handleLogin} className='submitButton'>
          Login to Spotify
        </button>
      </div>
      <div></div>
      <div className='form'>
        <div className='header'>
          <img src={logo} width={'50%'} />
        </div>
        <b>
          {/* creating input file for book names */}
          <label className='label'>Book Name</label>
        </b>

        <input
          type='text'
          value={bookName}
          onChange={handleBookName}
          className='userInput'
        />
        <br />
        <b>
          {/* creating input file for author names */}
          <label className='label'> Author </label>
        </b>

        <input
          type='text'
          value={author}
          onChange={handleAuthor}
          className='userInput'
        />
        <br />
        <button onClick={handleViewAllRecs} className='submitButton'>
          View All Saved Recs
        </button>
        <button onClick={handleSubmit} className='submitButton'>
          Submit
        </button>
      </div>
    </div>
  );
}

export default SearchComponent;
