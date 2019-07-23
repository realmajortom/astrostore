import React, {useState, useContext} from 'react';
import axios from 'axios';
import {Token, HomeDispatch} from './Home';
import Dialog from '@material-ui/core/Dialog';
import ChunkyButton from './ChunkyButton';
import {TextField} from './Inputs';


function EditCollection(props) {
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);
  const id = props.id;

  const [title, setTitle] = useState(props.title);
  const [isVis, setVis] = useState(false);

  const sendUpdate = () => {
    axios.post(`https://astrostore.io/api/collection/update/${id}`,
      {title: title},
      {headers: {Authorization: `JWT ${token}`}}
    ).then(res => {
      if (res.data.success) {
        dispatch({type: 'updateC', sub: 'title', id: id, title: title});
        props.liftUpdate(title);
        setVis(false);
      } else {
        window.alert(res.data.message)
      }
    });
  };

  const sendDelete = () => {
    if (window.confirm('Permanently delete this collection and its bookmarks?')) {
      axios.post(`https://astrostore.io/api/collection/delete/${id}`,
        {headers: {Authorization: `JWT ${token}`}}
      ).then(res => {
        if (res.data.success) {
          dispatch({type: 'deleteC', id: id});
        } else {
          window.alert(res.data.message);
        }
      });
    }
  }

  return (
    <div>

      <button onClick={() => setVis(true)} className="editButton">Edit</button>

      <Dialog
        open={isVis}
        onClose={() => setVis(false)}
        classes={{paper: 'modalBody modalMedium'}}
        aria-labelledby='Edit Collection Form'
        elevation={24}
        onKeyPress={(e) => e.charCode === 13 && sendUpdate()}
        transitionDuration={250}
      >

        <div className="modalHeader">Edit Collection</div>

        <div className='fieldWrapper'>
          <TextField
            label="Collection Title:"
            value={title}
            placeholder={props.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='submitWrapper'>
          <ChunkyButton
            onPress={() => sendUpdate()}
            text={'Update'}
            type={'primary'}
          />
        </div>

        <div className='deleteWrapper'>
          <ChunkyButton
            onPress={() => sendDelete()}
            text={'Delete'}
            type={'red'}
          />
        </div>

      </Dialog>
    </div>
  );
};


export default EditCollection;