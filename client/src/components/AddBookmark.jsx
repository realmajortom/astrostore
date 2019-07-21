import React, {useState, useContext} from 'react';
import axios from 'axios';
import {HomeDispatch, Token, Ddl} from './Home';
import {makeStyles} from '@material-ui/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import {Dropdown, TextField} from './Inputs';
import ChunkyButton from './ChunkyButton';

const useStyles = makeStyles({
  root: {
    fontFamily: ['"Lato"', 'sans-serif'],
    fontSize: 13,
    borderBottom: '1px solid #eeeeee',
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 42,
    '&:hover': {
      color: '#7e17ea',
      background: 'transparent'
    }
  }
})

function AddBookmark(props) {
  const classes = useStyles();
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);
  const ddl = useContext(Ddl);

  const [parentId, setParent] = useState(props.id);
  const [isVis, setVis] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const addBookmark = () => {
    axios.post('http://localhost:3999/bookmark/create',
      {bookmarkTitle: title, bookmarkUrl: url, parentId: parentId},
      {headers: {Authorization: `JWT ${token}`}}
    ).then(res => {
      if (res.data.success) {
        dispatch({type: 'addBook', payload: res.data.bookmarks, id: parentId});
        setVis(false);
      } else {
        window.alert(res.data.message);
      };
    });
  };

  return (
    <div>

      {props.buttonType === 'primary'
        ? <ChunkyButton
          onPress={() => setVis(true)}
          text={'New Bookmark'}
          type={'secondary'} />
        : <button
          onClick={() => setVis(true)}
          className="plusButton">+</button>
      }

      <Dialog
        open={isVis}
        onClose={() => setVis(false)}
        classes={{paper: 'modalBody'}}
        aria-labelledby="New Bookmark Form"
        elevation={24}
        onKeyPress={(e) => e.charCode === 13 && addBookmark()}
        transitionDuration={100}
      >

        <div className="modalHeader">New Bookmark</div>

        <div className='fieldWrapper'>
          <TextField
            label='Bookmark Title'
            placeholder='The Cat in The Hat'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label='Bookmark Url'
            placeholder='cat.in.hat'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Dropdown
            label={props.pTitle === null ? 'Collection' : props.pTitle}
            value={parentId}
            onChange={(e) => setParent(e.target.value)}
          >
            {
              ddl.map(c =>
                <MenuItem value={c.id} key={c.id} className={classes.root} >
                  {c.title}
                </MenuItem>
              )
            }
          </Dropdown>
        </div>

        <div className='submitWrapper'>
          <ChunkyButton
            onPress={() => addBookmark()}
            text={'Submit'}
            type={'primary'}
          />
        </div>

      </Dialog>

    </div>
  );
};


export default AddBookmark;