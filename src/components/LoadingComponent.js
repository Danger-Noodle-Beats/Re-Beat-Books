import React, { useEffect } from 'react';
import MusicComponent from './musicRec';
import { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { useLocation } from 'react-router-dom';

const LoadingComponent = () => {
  const [cover, setCover] = useState([
    {
      title: 'default',
      url: 'default url',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState(null);
  const [subjects, setSubjects] = useState(null);
  // getting state property from useLocation
  const { state } = useLocation();
  // setting book and author from state properties
  const { book, author, token } = state; //state.book

  useEffect(async () => {
    const resultsFromBooks = await fetchGutenAPI(`${book} ${author}`);
    await fetchTracks(resultsFromBooks).then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  }, []);

  const fetchGutenAPI = async (searchString) => {
    const body = JSON.stringify({
      searchString,
    });
    const response = await fetch('/api/getGutenAPI', {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('data in fetchGutenAPI', data);
    setSubjects(data);
    let resultFromBooks = '';
    data.forEach((el) => {
      resultFromBooks += el.split(' ')[0] + ' '; // 'Thermodynamics Statistical mechanics Thermodynamics'
    });
    return resultFromBooks;
  };
  const fetchTracks = async (resultFromBooks) => {
    console.log('Search string for Spotify: ', resultFromBooks);
    const response = await fetch('/api/getSpotAPI', {
      method: 'POST',
      body: JSON.stringify({
        resultFromBooks: resultFromBooks,
        token: token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const album = await response.json();
    setTracks(album);
  };
  const quotes = [
    '“A reader lives a thousand lives before he dies...The man who never reads lives only one.” - George R.R.Martin',
    '“Until I feared I would lose it, I never loved to read. One does not love breathing.” - Harper Lee',
    '“Never trust anyone who has not brought a book with them.” - Lemony Snicket',
    '“You can never get a cup of tea large enough or a book long enough to suit me.” - C.S. Lewis',
    '“I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.” - Groucho Marx',
    '“Thats the thing about books. They let you travel without moving your feet.” - Jhumpa Lahiri',
    '“In the case of good books, the point is not to see how many of them you can get through, but rather how many can get through to you.” - Mortimer J. Adler',
    '“Reading one book is like eating one potato chip.” - Diane Duane',
    '“The more that you read, the more things you will know. The more that you learn, the more places you’ll go.” - Dr. Seuss',
    '“Fill your house with stacks of books, in all the crannies and all the nooks.” - Dr. Seuss',
  ];

  function randomQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    return quotes[random];
  }
  if (loading) {
    return (
      <div className='loadingBox'>
        <h1>Loading Beats</h1>
        {/* renders a loading screen */}
        <BeatLoader />
        <h3>{randomQuote()}</h3> {/*  rendering a random quote from above */}
      </div>
    );
  }

  return (
    <>
      <MusicComponent
        album={tracks}
        subjects={subjects}
        book={book}
        author={author}
      />
    </>
  );
};

export default LoadingComponent;
