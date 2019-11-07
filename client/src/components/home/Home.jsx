import React, {useState, useEffect, useReducer} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios/index';


import AddCollection from '../collection/AddCollection';
import ChunkyButton from '../inputs/ChunkyButton';
import AddBookmark from '../bookmark/AddBookmark';
import Collection from '../collection/Collection';
import Bookmark from '../bookmark/Bookmark';
import EditUser from './EditUser';
import List from './List';
import Nav from './Nav';
import '../../App.css';
import '../../dark.css';


const initialState = {
    token: '',
    collections: [],
    ddl: [],
    faves: [],
    sheetVis: false,
    darkMode: JSON.parse(localStorage.getItem('darkMode')),
    redirect: false,
};


const reducer = (state, action) => {

    switch (action.type) {

        /********* Collections *********/
        case 'setC':
            return {...state, collections: action.collections, token: action.token};

        case 'addC':
            return {
                ...state,
                collections: [...state.collections, action.payload]
            };

        case 'deleteC':
            return {
                ...state,
                collections: state.collections.filter(c => c._id !== action.id)
            };

        case 'updateC':
            let colls = state.collections;
            let cIndex = colls.findIndex(c => c._id === action.id);
            if (action.sub === 'title') {
                colls[cIndex].title = action.title;
            } else {
                colls[cIndex].vis = !state.collections[cIndex].vis;
            }
            return {...state, collections: colls};


        /********* Bookmarks *********/
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
            const newBook = {
                ...tempColls3[index3].bookmarks[bookIndex],
                title: action.payload.title,
                url: action.payload.url
            };
            tempColls3[index3].bookmarks[bookIndex] = newBook;
            return {...state, collections: tempColls3};


        /********* Favorites *********/
        case 'setFaves':
            return {...state, faves: action.payload};

        case 'addFave':
            return {...state, faves: [...state.faves, action.payload]};

        case 'deleteFave':
            return {
                ...state,
                faves: state.faves.filter(b => b._id !== action.id)
            };

        case 'updateFave':
            let tempFaves = state.faves;
            const index4 = tempFaves.findIndex(b => b._id === action.payload.id);
            tempFaves[index4].title = action.payload.title;
            tempFaves[index4].url = action.payload.url;
            return {...state, faves: tempFaves};


        /********* UI *********/
        case 'redirect':
            return {...state, redirect: !state.redirect};

        case 'setDdl':
            return {...state, ddl: action.payload};

        case 'toggleSheet':
            return {...state, sheetVis: !state.sheetVis};

        case 'darkOn':
            localStorage.setItem('darkMode', 'true');
            return {...state, darkMode: true};

        case 'toggleDark':
            let newMode = JSON.stringify((!state.darkMode));
            let theme = document.querySelector("meta[name=theme-color]");

            if (newMode !== 'true') {
                theme.setAttribute("content", '#ffffff');
            } else {
                theme.setAttribute("content", '#121212');
            }

            localStorage.setItem('darkMode', newMode);

            return {...state, darkMode: !state.darkMode};

        default:
            return state;
    }

};


export const Ddl = React.createContext(null);
export const Token = React.createContext(null);
export const DarkMode = React.createContext(null);
export const HomeDispatch = React.createContext(null)


function Home() {

    const [state, dispatch] = useReducer(reducer, initialState);
    const [mainVis, setMainVis] = useState(true);

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            dispatch({type: 'darkOn'});
        }
    }, []);

    // Get bookmarks
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token !== null) {
            axios.get('https://astrostore.io/api/collection/all',
                {headers: {Authorization: `JWT ${token}`}})
                .then(res => {
                    if (res.status === 200) {

                        // The rest of the effect is to determine and establish the correct collection order
                        // They should almost always be in order...but just in case
                        let collections = res.data.collections;
                        let order = res.data.order;
                        let sortedCollections = [];
                        let newOrder = [];

                        /* For every item in order, check that it exists in the collections array
                        If found, push the collection to the sortedCollections */
                        for (let i = 0; i < order.length; i++) {
                            const index = collections.findIndex(c => c._id === order[i]);
                            if (index >= 0) {
                                sortedCollections.push(collections[index]);
                                newOrder.push(collections[index]._id);
                                // Remove the found collection from collections array
                                collections.splice(index, 1);
                            }
                        }

                        /* To make sure no collections are lost, check that collections array is empty. Any remaining collections were not included in the order array and should be pushed to sortedCollections */
                        if (collections.length > 0) {
                            for (let j = 0; j < collections.length; j++) {
                                sortedCollections.push(collections[j]);
                                newOrder.push(collections[j]._id);
                            }
                        }

                        if (order.join('') !== newOrder.join('')) {
                            axios.post('https://astrostore.io/api/user/order',
                                {order: newOrder},
                                {headers: {Authorization: `JWT ${token}`}})
                                .then(res => console.log(res.data.message));
                        }

                        dispatch({
                            type: 'setC',
                            collections: sortedCollections,
                            token: token
                        });

                    } else {
                        window.alert(res.data.message)
                    }

                });
        } else {
            dispatch({type: 'redirect'});
        }
    }, []);


    useEffect(() => {
        if (state.collections.length > 0) {

            let favorites = [];

            for (let i = 0; i < state.collections.length; i++) {
                state.collections[i].bookmarks.forEach(b =>
                    b.fave === true && favorites.push(b)
                );
            }

            let ddl = state.collections.map(c => ({
                id: c._id,
                title: c.title
            }));

            dispatch({type: 'setFaves', payload: favorites});
            dispatch({type: 'setDdl', payload: ddl});
        }
    }, [state.collections]);


    if (state.redirect !== true) {
        const mainList = (state.collections.map(c => <Collection c={c} key={c._id} />));
        const favList = (state.faves.map(b => <Bookmark bookmark={b} key={b._id} />));

        return (
            <div className={'appContainer ' + (state.darkMode && 'darkHome')}>
                <HomeDispatch.Provider value={dispatch}>
                    <Token.Provider value={state.token}>
                        <Ddl.Provider value={state.ddl}>
                            <DarkMode.Provider value={state.darkMode}>


                                <Nav local='navHome' dark={state.darkMode} >
                                    <AddCollection />
                                    <AddBookmark buttonType="primary" pTitle={''} id={''} />
                                    <ChunkyButton
                                        locale='nav'
                                        type={state.darkMode ? 'pinkDark' : 'pink'}
                                        text={mainVis ? 'Show Favorites' : 'Show All'}
                                        onPress={() => setMainVis(!mainVis)}
                                    />
                                    <ChunkyButton
                                        locale='nav'
                                        type={state.darkMode ? 'pinkDark' : 'pink'}
                                        text='User'
                                        onPress={() => dispatch({type: 'toggleSheet'})}
                                    />
                                </Nav>

                                <EditUser vis={state.sheetVis} collections={state.collections} />

                                <List mainVis={mainVis}>
                                    {mainVis
                                        ? mainList
                                        : <div className='collectionContainer favesContainer'>
                                            <div className='collTitleText faveTitle'>Favorites</div>
                                            {favList}
                                        </div>}
                                </List>


                            </DarkMode.Provider>
                        </Ddl.Provider>
                    </Token.Provider>
                </HomeDispatch.Provider>
            </div>
        );
    } else {
        return <Redirect to='/' />;
    }
}

export default Home;