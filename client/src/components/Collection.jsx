import React, {useState, useContext} from 'react';
import axios from 'axios';
import {Token, HomeDispatch} from './Home';
import EditCollection from './EditCollection';
import AddBookmark from './AddBookmark';
import Bookmark from './Bookmark';


function Collection(props) {
  const dispatch = useContext(HomeDispatch);
  const token = useContext(Token);
  let bookmarks = props.c.bookmarks;
  const id = props.c._id;

  const [title, setTitle] = useState(props.c.collectionTitle);
  const [isVis, setVis] = useState(props.c.isVis);

  const toggleList = () => {
    setVis(!isVis)
    axios.post(`http://localhost:3999/collection/collapse/${id}`,
      {isVis: !isVis},
      {headers: {Authorization: `JWT ${token}`}}
    );
  };

  const deleteBookmark = (parent, date, id) => {
    axios.post('http://localhost:3999/bookmark/delete',
      {parentId: parent, bookmarkMakeDate: date},
      {headers: {Authorization: `JWT ${token}`}}
    ).then(res => {
      if (res.data.success) {
        dispatch({type: 'deleteFave', id: id});
        dispatch({type: 'deleteBook', pId: parent, id: id})
        const newMarks = bookmarks.filter(b => b._id !== id);
        bookmarks = newMarks;
      } else {
        window.alert(res.data.message);
      };
    });
  };

  return (
    <div className="collectionContainer">

      <div className="collTitleContainer">

        <div className="collTitleText" onClick={() => toggleList()}>{title}</div>
        <div className='controls'>
          <EditCollection
            title={title}
            id={id}
            liftUpdate={setTitle}
            />
        </div>
        <div className='controls'>
          <AddBookmark id={id} pTitle={title} />
        </div>

      </div>
      

      <div className="bookList">
        {isVis
          && bookmarks.map(b =>
            <Bookmark
              bookmark={b}
              key={b._id}
              delete={deleteBookmark}
            />)
        }
      </div>

    </div>
  );
};

export default Collection;