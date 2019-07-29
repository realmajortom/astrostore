import React, {useContext, useState} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token} from '../home/Home';
import EditCollection from './EditCollection';
import AddBookmark from '../bookmark/AddBookmark';
import Bookmark from '../bookmark/Bookmark';


function Collection(props) {
    const dispatch = useContext(HomeDispatch);
    const token = useContext(Token);
    let bookmarks = props.c.bookmarks;
    const id = props.c._id;

    const [title, setTitle] = useState(props.c.title);
    const [vis, setVis] = useState(props.c.vis);

    const toggleList = () => {
        setVis(!vis);
        axios.post(`https://astrostore.io/api/collection/collapse/${id}`,
            {vis: !vis},
            {headers: {Authorization: `JWT ${token}`}}
        ).then(() => dispatch({type: 'updateC', sub: 'vis', id: id}))
    };

    const deleteBookmark = (parent, date, id) => {
        axios.post('https://astrostore.io/api/bookmark/delete',
            {parentId: parent, addDate: date},
            {headers: {Authorization: `JWT ${token}`}}
        ).then(res => {
            if (res.data.success) {
                dispatch({type: 'deleteFave', id: id});
                dispatch({type: 'deleteBook', pId: parent, id: id});
                bookmarks = bookmarks.filter(b => b._id !== id);
            } else {
                window.alert(res.data.message);
            }
        });
    };

    return (
        <div className="collectionContainer">

            <div className="collTitleContainer">
                <div className="collTitleText" onClick={() => toggleList()}>
                    {title}
                </div>

                {vis &&
                     <div className='controls'>
                         <EditCollection
                             title={title}
                             id={id}
                             liftUpdate={setTitle}
                         />
                     </div>}

                 {vis &&
                  <div className='controls'>
                      <AddBookmark
                          id={id}
                          pTitle={title}
                      />
                  </div>}
            </div>

            <div className="bookList">
                {vis
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
}

export default Collection;