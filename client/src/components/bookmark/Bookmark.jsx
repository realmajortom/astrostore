import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {Token, HomeDispatch} from '../home/Home';
import HeartCheckbox from 'react-heart-checkbox';
import EditBookmark from './EditBookmark';


function Bookmark(props) {
    const dispatch = useContext(HomeDispatch);
    const token = useContext(Token);
    let book = props.bookmark;
    const date = book.addDate;
    const parent = book.parentId;
    const id = book._id;

    const [title, setTitle] = useState(book.title);
    const [url, setUrl] = useState(book.url);
    const [fave, setFave] = useState(book.fave);

    const faveChange = () => {
        axios.post('https://astrostore.io/api/bookmark/fave',
            {parentId: parent, addDate: date, fave: !fave},
            {headers: {Authorization: `JWT ${token}`}}
        );
        book.fave = !book.fave;
        fave
        ? dispatch({type: 'deleteFave', id: id})
        : dispatch({type: 'addFave', payload: book});
        setFave(!fave);
    };

    const updateBookmark = (someTitle, someUrl) => {
        axios.post('https://astrostore.io/api/bookmark/update',
            {parentId: parent, addDate: date, title: someTitle, url: someUrl},
            {headers: {Authorization: `JWT ${token}`}}
        ).then(res => {
            if (res.data.success === true) {
                setTitle(someTitle);
                setUrl(someUrl);
                dispatch({
                    type: 'updateBook',
                    pId: parent,
                    payload: {title: someTitle, url: someUrl, id: id}
                });
                if (fave) {
                    dispatch({
                        type: 'updateFave',
                        payload: {id: id, title: someTitle, url: someUrl}
                    });
                }
            }
        });
    };

    const bookDelete = () => {
        props.delete(parent, date, id);
    };

    return (
        <div className="bookRow">

            <div className="borderCont">
                <div className="titleColumn">
                    <a className="bookTitle" href={url} target="_blank"
                       rel="noopener noreferrer">
                        {title}
                    </a>
                </div>
                <div className="favColumn">
                    <HeartCheckbox checked={fave} onClick={() => faveChange()}
                                   className="heart"/>
                </div>
            </div>

            <div className="controls">
                <EditBookmark title={title} url={url} update={updateBookmark}
                              delete={bookDelete}/>
            </div>

        </div>
    );
}

export default Bookmark;