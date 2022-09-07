import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheet/styles.css';
import logo from '../../assets/logo.png';

function SearchComponent() {
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

  useEffect(async () => {
    const response = await fetch('/api/authToken/');
    const authToken = await response.json();
    console.log(authToken);
    setToken(authToken);
  }, []);

  return (
    <div>
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
        <button onClick={handleSubmit} className='submitButton'>
          Submit
        </button>
      </div>
    </div>
  );
}

export default SearchComponent;
