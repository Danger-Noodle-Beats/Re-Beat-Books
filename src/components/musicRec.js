import React, { useEffect } from 'react';
import { useState } from 'react';
// import "../stylesheet/styles.css";
import '../stylesheet/musicRecStyles.css';
import { Navigate, useNavigate } from 'react-router-dom';
import SaveModal from './SaveModal';
const MusicComponent = ({ book, author, album, subjects }) => {
  console.log(album);

  const [counter, setCount] = useState(0);
  const [currentAlbum, setAlbum] = useState(album[0]);
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);
  function handleClick(e) {
    navigate('/');
    console.log('subjects', subjects);
  }

  function handleScroll(e) {
    //props is an array

    e.preventDefault();
    setCount(counter + 1);
    if (counter === album.length - 1) setCount(0);
    setAlbum(album[counter]);
  }

  const handleSave = async (e) => {
    try {
      e.preventDefault();
      console.log('e: ', e);
      e.target.textContent = 'Album Saved';
      const recsObj = { book, author, currentAlbum };
      // setShowSaveModal(true);
      const response = await fetch('/api/', {
        method: 'POST',
        body: JSON.stringify(recsObj),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await response.json();
    } catch (error) {
      console.log('handleSave button not working');
    }
  };
  const displaySaved = () => {
    navigate('/savedRecs');
  };
  const listArr = [];

  subjects.forEach((element, i) => {
    listArr.push(<li id={i}>{element} </li>);
  });
  useEffect(() => {}, [showSaveModal]);
  return (
    <div>
      <div id='dope-beats' className='container'>
        <div className='search-again'>
          {/* redirect to the home page */}
          <button id='home-btn' onClick={handleClick} className='submitButton'>
            Home
          </button>
        </div>
        <div className='dope-beats'>
          <h3>Dope Beats To Pair With Hints Of...</h3>
        </div>

        <div className='subjects-list'>
          <ul>{listArr}</ul>
        </div>
        <div className='album-art'>
          <img id='album-art' src={currentAlbum.albumArtURL}></img>
        </div>
        <div id='song-info' className='artist-info'>
          ARTIST:{currentAlbum.artistName}{' '}
        </div>
        <div className='album-info'>ALBUM: {currentAlbum.albumName} </div>

        <div className='button-containers'>
          <div className='save-recs'>
            {/* saves recs to database*/}
            <button
              id='save-recs'
              onClick={handleSave}
              className='submitButton'
            >
              Save this album
            </button>
            {/* {showSaveModal && <SaveModal setShowSaveModal={setShowSaveModal} />} */}
            
					</div>
					<div className='viewall-recs'>
					<button
              id='viewall-btn'
              className='submitButton'
              onClick={displaySaved}
            >
              View All Saved Recommends
            </button>
					</div>
          <div className='next-album'>
            {/* renders next album in the row */}
            <button
              id='next-song'
              onClick={handleScroll}
              className='submitButton'
            >
              Next Album
            </button>
          </div>
        </div>
        <div className='web-player'>
          <iframe
            src={`https://open.spotify.com/embed-legacy/album/${currentAlbum.albumURI}?utm_source=generator `}
            width='100%'
            height='380'
            frameBorder='0'
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
            id='web-player'
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MusicComponent;
