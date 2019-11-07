import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token, Ddl, DarkMode} from '../home/Home';
import {makeStyles} from '@material-ui/styles/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import Dialog from '@material-ui/core/Dialog/index';
import {Dropdown, TextField} from '../inputs/MaterialInputs';
import ChunkyButton from '../inputs/ChunkyButton';

const useStyles = makeStyles({
    root: {
        fontFamily: ['"Lato"', 'sans-serif'],
        fontSize: '16px',
        borderBottom: '1px solid #eeeeee',
        padding: '12px',
        '&:hover': {
            color: '#7e17ea',
            background: 'transparent'
        }
    }
});

function AddBookmark(props) {
    const classes = useStyles();
    const darkMode = useContext(DarkMode);
    const dispatch = useContext(HomeDispatch);
    const token = useContext(Token);
    const ddl = useContext(Ddl);

    const [parentId, setParent] = useState(props.id);
    const [vis, setVis] = useState(false);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    const closeModal = () => {
        setVis(false);
        setTitle('');
        setUrl('');
    };

    const addBookmark = () => {
        if (title.length < 1) {
            alert('Title must contain at least 1 character');
        } else if (parentId.length < 1) {
            alert('Please choose a collection from the dropdown to save your bookmark!');
        } else {
            axios.post('https://astrostore.io/api/bookmark/create',
                {title: title, url: url, parentId: parentId},
                {headers: {Authorization: `JWT ${token}`}})
                .then(res => {
                    if (res.data.success) {
                        dispatch({type: 'addBook', payload: res.data.bookmarks, id: parentId});
                        closeModal();
                    } else {
                        window.alert(res.data.message);
                    }
                });
        }

    };


    return (
        <div>

            {props.buttonType === 'primary'
                ? <ChunkyButton
                    locale='nav'
                    onPress={() => setVis(true)}
                    text={'New Bookmark'}
                    type={darkMode ? 'secondaryDark' : 'secondary'} />
                : <button
                    onClick={() => setVis(true)}
                    className="plusButton"><img src={require('../inputs/add.png')} alt='Add Bookmark' className='addImg' /></button>
            }

            <Dialog
                open={vis}
                onClose={() => closeModal()}
                classes={{paper: 'modalBody ' + (darkMode && 'darkDialog')}}
                aria-labelledby="New Bookmark Form"
                elevation={24}
                onKeyPress={(e) => e.charCode === 13 && addBookmark()}
                transitionDuration={250}
            >

                <div className={"modalHeader " + (darkMode && 'darkBook')}>New Bookmark</div>

                <form>
                    <TextField
                        label='Bookmark Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        dark={darkMode}
                    />

                    <TextField
                        label='Bookmark Url'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        dark={darkMode}
                    />

                    <Dropdown
                        label='Collection'
                        value={parentId}
                        onChange={(e) => setParent(e.target.value)}
                        dark={darkMode}
                    >

                        {ddl.map(c =>
                            <MenuItem value={c.id} key={c.id} className={classes.root} >
                                {c.title}
                            </MenuItem>
                        )}

                    </Dropdown>
                </form>

                <div className='submitWrapper'>
                    <ChunkyButton
                        onPress={() => addBookmark()}
                        text={'Submit'}
                        type={darkMode ? 'primaryDark' : 'primary'} />
                </div>

            </Dialog>

        </div>
    );
}


export default AddBookmark;