import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
const SavedRecs = (props) => {
  // state of saved recs
  const [allRecs, setAllRecs] = useState([]);
  //state to update if a rec is deleted
  const [deleted, setDeleted] = React.useState(false);

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
  }, []);

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

  return (
    <div className='Rec-List-Container'>
      <div className='Saved-Rec-List'>
        {allRecs.map((rec) => {
          return (
            <div className='recBox'>
              {rec.book} by {rec.author} Album: {rec.albumName}
            </div>
          );
        })}
      </div>
      <div className='button'>
        <button id='homeBtn' className='submitButton' onClick={handleClickHome}>
          Home
        </button>
      </div>
    </div>
  );
};

export default SavedRecs;
