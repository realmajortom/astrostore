import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token} from '../home/Home';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function AddCollection() {
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);

  const [title, setTitle] = useState('');
  const [vis, setVis] = useState(false);

  const addCollection = () => {
    axios.post('https://astrostore.io/api/collection/create',
      {title: title},
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
        onPress={() => setVis(!vis)}
        text={'New Collection'}
        type={'secondary'}
      />

      <Dialog
        open={vis}
        onClose={() => setVis(!vis)}
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
            placeholder="Realistic Human Outfits"
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