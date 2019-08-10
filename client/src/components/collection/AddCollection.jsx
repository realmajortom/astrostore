import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token, Length, DarkMode} from '../home/Home';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function AddCollection() {
    const darkMode = useContext(DarkMode);
    const dispatch = useContext(HomeDispatch);
    const token = useContext(Token);
    const listLength = useContext(Length);

    const [title, setTitle] = useState('');
    const [vis, setVis] = useState(false);

    const addCollection = () => {
        axios.post('https://astrostore.io/api/collection/create',
            {title: title, sequence: listLength},
            {headers: {Authorization: `JWT ${token}`}}).then(res => {
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

            <ChunkyButton onPress={() => setVis(!vis)}
                          text={'New Collection'}
                          type={darkMode ? 'secondaryDark' : 'secondary'}/>

            <Dialog open={vis}
                    onClose={() => setVis(!vis)}
                    classes={{paper: 'modalBody modalSmall ' + (darkMode && 'darkDialog')}}
                    aria-labelledby="New Collection Form"
                    elevation={24}
                    onKeyPress={(e) => e.charCode === 13 && addCollection()}
                    transitionDuration={250}>

                <div className={"modalHeader " + (darkMode && 'darkBook')}>New Collection</div>

                <div className='fieldWrapper'>
                    <TextField label="Collection Title"
                               placeholder="Homosapien Recipes"
                               value={title}
                               dark={darkMode}
                               onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className='submitWrapper'>
                    <ChunkyButton onPress={() => addCollection()}
                                  text={'Submit'}
                                  type={darkMode ? 'primaryDark' : 'primary'}/>
                </div>

            </Dialog>
        </div>
    );
}

export default AddCollection;