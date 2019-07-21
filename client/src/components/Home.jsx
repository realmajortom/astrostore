import React, {useState, useEffect, useReducer} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import {ReactComponent as Logo} from '../icon.svg';
import AddCollection from './AddCollection';
import ChunkyButton from './ChunkyButton';
import AddBookmark from './AddBookmark';
import Collection from './Collection';
import Bookmark from './Bookmark';
import EditUser from './EditUser';
import List from './List';
import Nav from './Nav';
import '../App.css';


const initialState = {
  token: '',
  collections: [],
  ddl: [],
  faves: [],
  sheetvis: false,
  redirect: false
};

const reducer = (state, action) => {
  switch (action.type) {
    // collection actions
    case 'setC':
      return {...state, collections: action.payload, token: action.auth};

    case 'addC':
      return {...state, collections: [...state.collections, action.payload]};

    case 'deleteC':
      return {...state, collections: state.collections.filter(c => c._id !== action.id)};

    case 'updateC':
      let colls = state.collections;
      let cIndex = colls.findIndex(c => c._id === action.id)
      colls[cIndex].collectionTitle = action.title
      return {...state, collections: colls};


    // bookmark actions
    case 'addBook':
      let tempColls = state.collections;
      let index = tempColls.findIndex(c => c._id === action.id);
      tempColls[index].bookmarks = action.payload;
      return {...state, collections: tempColls};

    case 'deleteBook':
      let tempColls2 = state.collections;
      let index2 = tempColls2.findIndex(c => c._id === action.pId);
      tempColls2[index2].bookmarks = tempColls2[index2].bookmarks.filter(b => b._id !== action.id);
      return {...state, collections: tempColls2};

    case 'updateBook':
      let tempColls3 = state.collections;
      const index3 = tempColls3.findIndex(c => c._id === action.pId);
      const bookIndex = tempColls3[index3].bookmarks.findIndex(b => b._id === action.payload.id);
      const newBook = {...tempColls3[index3].bookmarks[bookIndex], bookmarkTitle: action.payload.title, bookmarkUrl: action.payload.url}
      tempColls3[index3].bookmarks[bookIndex] = newBook;
      return {...state, collections: tempColls3};


    // favorites list actions
    case 'setFaves':
      return {...state, faves: action.payload};

    case 'addFave':
      return {...state, faves: [...state.faves, action.payload]};

    case 'deleteFave':
      return {...state, faves: state.faves.filter(b => b._id !== action.id)};

    case 'updateFave':
      let tempFaves = state.faves;
      const index4 = tempFaves.findIndex(b => b._id === action.payload.id);
      tempFaves[index4].bookmarkTitle = action.payload.title;
      tempFaves[index4].bookmarkUrl = action.payload.url;
      return {...state, faves: tempFaves};


    // Other UI actions
    case 'setDdl':
      return {...state, ddl: action.payload};

    case 'toggleSheet':
      return {...state, sheetVis: !state.sheetVis};

    case 'redirect':
      return {...state, redirect: !state.redirect};

    default:
      return state;
  }
};

export const HomeDispatch = React.createContext(null);
export const Token = React.createContext(null);
export const Ddl = React.createContext(null);


function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mainVis, setMainVis] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('JWT');
    if (token !== null) {
      axios.get('http://localhost:3999/collection/all', {
        headers: {Authorization: `JWT ${token}`}
      })
        .then(res => {
          if (res.status === 200) {
            dispatch({type: 'setC', payload: res.data, auth: token});
          } else {
            window.alert(res.data.message);
          }
        })
    }
    else {
      dispatch({type: 'redirect'});
    }
  }, []);

  useEffect(() => {
    if (state.collections.length > 0) {
      let favorites = [];
      for (let i = 0; i < state.collections.length; i++) {
        state.collections[i].bookmarks.forEach(b =>
          b.bookmarkFav === true && favorites.push(b)
        );
      }
      let ddl = state.collections.map((c) => ({id: c._id, title: c.collectionTitle}));
      dispatch({type: 'setFaves', payload: favorites});
      dispatch({type: 'setDdl', payload: ddl});
    }
  }, [state.collections]);



  if (state.redirect) {
    return <Redirect to='/' />
  }

  else {
    return (
      <div className='appContainer'>
        <HomeDispatch.Provider value={dispatch}>
          <Token.Provider value={state.token}>
            <Ddl.Provider value={state.ddl}>

              <Nav>
                <AddCollection />
                <AddBookmark
                  buttonType="primary"
                  pTitle={''}
                  id={''}
                />
                <ChunkyButton
                  text={mainVis ? 'Show Favorites' : 'Show All'}
                  onPress={() => setMainVis(!mainVis)}
                  type={'pink'}
                />
                <Logo
                  className="mainLogo"
                  onClick={() => dispatch({type: 'toggleSheet'})}
                />
              </Nav>

              <EditUser isVis={state.sheetVis} />

              <List mainVis={mainVis}>
                {mainVis
                  ? (state.collections.map(c =>
                    <Collection c={c} key={c._id} />
                  ))
                  : (state.faves.map(b => <Bookmark bookmark={b} key={b._id} />))
                }
              </List>

            </Ddl.Provider>
          </Token.Provider>
        </HomeDispatch.Provider>
      </div>
    );
  }
}

export default Home;
