import React, {useState, useContext} from 'react';
import axios from 'axios';
import {Token, HomeDispatch} from './Home';
import HeartCheckbox from 'react-heart-checkbox';
import EditBookmark from './EditBookmark';


function Bookmark(props) {
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);
  let book = props.bookmark;
  const date = book.bookmarkMakeDate;
  const parent = book.parentId;
  const id = book._id;

  const [title, setTitle] = useState(book.bookmarkTitle);
  const [url, setUrl] = useState(book.bookmarkUrl);
  const [fav, setFav] = useState(book.bookmarkFav);

  const favChange = () => {
    axios.post('https://astrostore.io/api/bookmark/fav',
      {p: parent, d: date, f: !fav},
      {headers: {Authorization: `JWT ${token}`}}
    );
    book.bookmarkFav = !book.bookmarkFav
    fav
      ? dispatch({type: 'deleteFave', id: id})
      : dispatch({type: 'addFave', payload: book})
    setFav(!fav);
  };

  const updateBookmark = (someTitle, someUrl) => {
    axios.post('https://astrostore.io/api/bookmark/update',
      {p: parent, d: date, t: someTitle, u: someUrl},
      {headers: {Authorization: `JWT ${token}`}}
    ).then(res => {
      if (res.data.success === true) {
        setTitle(someTitle);
        setUrl(someUrl);
        dispatch({type: 'updateBook', pId: parent, payload: {title: someTitle, url: someUrl, id: id}});
        if (fav) {
          dispatch({type: 'updateFave', payload: {id: id, title: someTitle, url: someUrl}});
        }
      };
    });
  };

  const bookDelete = () => {
    props.delete(parent, date, id);
  };

  return (
    <div className="bookRow">

      <div className="borderCont">
        <div className="titleColumn">
          <a
            className="bookTitle"
            href={url}
            target="_blank"
            rel="noopener noreferrer" >
            {title}
          </a>
        </div>
        <div className="favColumn">
          <HeartCheckbox
            checked={fav}
            onClick={() => favChange()}
            className="heart"
          />
        </div>
      </div>

      <div className="controls">
        <EditBookmark
          title={title}
          url={url}
          update={updateBookmark}
          delete={bookDelete}
        />
      </div>

    </div>
  )
};

export default Bookmark;