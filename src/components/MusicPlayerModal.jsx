import React, { useState } from 'react';
import '../stylesheet/styles.css';
const MusicPlayerModal = (props) => {
  const { setModal, showModal, rec } = props;
  const handleClose = (e) => {
    setModal(false);
  }
  return (
    <div className='modal-music-container'>
      <div className='web-player'>
        <iframe
          src={`https://open.spotify.com/embed-legacy/album/${rec.albumURI}?utm_source=generator `}
          width='100%'
          height='380'
          frameBorder='0'
          allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
          loading='lazy'
          id='web-player'
        ></iframe>
      </div>
      <div>
        <button className = 'submitButton' onClick={handleClose}>Close</button>
      </div>
    </div>
  )
}
export default MusicPlayerModal;