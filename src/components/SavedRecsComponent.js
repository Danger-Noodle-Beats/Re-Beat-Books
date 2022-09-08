import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import MusicPlayerModal from './MusicPlayerModal';
import '../stylesheet/styles.css';
import axios from 'axios';

const SavedRecs = (props) => {
  // state of saved recs
  const [allRecs, setAllRecs] = useState([]);
  //state to update if a rec is deleted
  const [deleted, setDeleted] = React.useState([]);
  //state for showing the modal
  const [showModal, setModal] = useState(false);
  //use effect to load array of saved recs
  useEffect(async () => {
    try {
      const response = await fetch('/api/savedRecs');
      console.log(response);
      const savedRecsList = await response.json();
      console.log(savedRecsList);
      setAllRecs(savedRecsList);
    } catch (error) {
      console.log('error in saved rec component', error);
    }
  }, [deleted]);

  console.log('all saved recs: ', allRecs);

  //   const recElements = [];
  //   const tmpRecs = allRecs;
  //   tmpRecs.forEach((rec) => {
  //     recElements.push(
  //       <div>
  //         {rec.book} by {rec.author} Album: {rec.albumName}
  //       </div>
  //     );
  //   });

  const navigate = useNavigate();
  const handleClickHome = () => {
    navigate('/');
  };

  const deleteRecs = (albumName) => {
    console.log('removing album');
    console.log(albumName);
    axios.delete(`/api/deleteRec/${albumName}`);
    setDeleted((deleted) => [...deleted, albumName]);
  };
  const [openedRec, setOpenedRec] = useState({});
  const handleModalClick = (e, rec) => {
    setModal(true);
    setOpenedRec(rec);
  };
  return (
    <div>
      <div className='button'>
        <button id='homeBtn' className='submitButton' onClick={handleClickHome}>
          Home
        </button>
      </div>
      <div id='saved-recs-title'>SAVED RECOMMENDS</div>
      <div className='Rec-List-Container'>
        <div className='Saved-Rec-List'>
          {allRecs.map((rec) => {
            return (
              <div className='recBox'>
                {/* change font later to differentiate */}
                <div id='recommend-title'>{`Album Recommend for ${rec.book} by ${rec.author}:`}</div>
                <div>
                  <img id='rec-album-art' src={rec.albumArtURL}></img>
                  <div id='rec-album-details'>
                    <div>{`Album Name: ${rec.albumName}`}</div>
                    <div>{`Album Artist: ${rec.artistName}`}</div>
                  </div>
                </div>
                <div className='saved-recs-buttons'>
                    <button
                      id='listenBtn'
                      className='recBtn'
                      onClick={(e) => handleModalClick(e, rec)}
                    >
                      Listen
                    </button>
                    <button
                      id='deleteBtn'
                      className='recBtn'
                      onClick={() => deleteRecs(rec.albumName)}
                    >
                      Delete
                    </button>
                </div>
                {showModal && (
                  <MusicPlayerModal
                    setModal={setModal}
                    showModal={showModal}
                    rec={openedRec}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedRecs;
