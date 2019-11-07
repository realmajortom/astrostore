import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token, DarkMode} from '../home/Home';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function AddCollection() {
    const dispatch = useContext(HomeDispatch);
    const darkMode = useContext(DarkMode);
    const token = useContext(Token);

    const [title, setTitle] = useState('');
    const [vis, setVis] = useState(false);

    const closeModal = () => {
        setVis(false);
        setTitle('');
    };

    const addCollection = () => {
        axios.post('https://astrostore.io/api/collection/create',
            {title: title},
            {headers: {Authorization: `JWT ${token}`}})
            .then(res => {
                if (res.data.success) {
                    dispatch({type: 'addC', payload: res.data.collection});
                    closeModal();
                } else {
                    window.alert(res.data.message);
                }
            });
    };

    return (
        <div>
            <ChunkyButton
                locale='nav'
                onPress={() => setVis(true)}
                text={'New Collection'}
                type={darkMode ? 'secondaryDark' : 'secondary'} />

            <Dialog open={vis}
                onClose={() => closeModal()}
                classes={{paper: 'modalBody modalSmall ' + (darkMode && 'darkDialog')}}
                aria-labelledby="New Collection Form"
                elevation={24}
                onKeyPress={(e) => e.charCode === 13 && addCollection()}
                transitionDuration={250}>

                <div className={"modalHeader " + (darkMode && 'darkBook')}>
                    New Collection
                </div>

                <form>
                    <TextField label="Collection Title"
                        value={title}
                        dark={darkMode}
                        onChange={(e) => setTitle(e.target.value)} />
                </form>

                <div className='submitWrapper'>
                    <ChunkyButton
                        onPress={() => addCollection()}
                        text={'Submit'}
                        type={darkMode ? 'primaryDark' : 'primary'} />
                </div>
            </Dialog>
        </div>
    );
}

export default AddCollection;