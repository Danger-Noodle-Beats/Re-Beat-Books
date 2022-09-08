import React, {useEffect, useState} from 'react';

const SaveModal = props => {
  const { setShowSaveModal } = props;
  // useEffect(() => {
  //   // setTimeout(() => {
      
  //   // },30000)
  //   // setShowSaveModal(false);

  // }, [])
  return (
    <div className='save-modal-container'>
      <p className='save-modal-text'>Album Saved</p>
    </div>
  )
}
export default SaveModal;