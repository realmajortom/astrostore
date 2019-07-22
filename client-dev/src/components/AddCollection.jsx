import React, {useState, useContext} from 'react';
import axios from 'axios';
import {HomeDispatch, Token} from './Home';
import Dialog from '@material-ui/core/Dialog';
import ChunkyButton from './ChunkyButton';
import {TextField} from './Inputs';


function AddCollection() {
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);

  const [title, setTitle] = useState('');
  const [isVis, setVis] = useState(false);

  const addCollection = () => {
    axios.post('https://astrostore.io/api/collection/create',
      {collectionTitle: title},
      {headers: {Authorization: `JWT ${token}`}})
      .then(res => {
        if (res.data.success) {
          dispatch({type: 'addC', payload: res.data.collection});
          setVis(false);
        } else {
          window.alert(res.data.message);
        }
      });
  };

  return (
    <div>

      <ChunkyButton
        onPress={() => setVis(!isVis)}
        text={'New Collection'}
        type={'secondary'}
      />

      <Dialog
        open={isVis}
        onClose={() => setVis(!isVis)}
        classes={{paper: 'modalBody modalSmall'}}
        aria-labelledby="New Collection Form"
        elevation={24}
        onKeyPress={(e) => e.charCode === 13 && addCollection()}
        transitionDuration={250}
      >

        <div className="modalHeader">New Collection</div>

        <div className='fieldWrapper'>
          <TextField
            label="Collection Title"
            placeholder="Sarah Cynthia Sylvia Stout..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='submitWrapper'>
          <ChunkyButton
            onPress={() => addCollection()}
            text={'Submit'}
            type={'primary'}
          />
        </div>

      </Dialog>
    </div>
  );
}

export default AddCollection;