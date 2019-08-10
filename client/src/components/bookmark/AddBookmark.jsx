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

    const addBookmark = () => {
        axios.post('https://astrostore.io/api/bookmark/create',
            {title: title, url: url, parentId: parentId},
            {headers: {Authorization: `JWT ${token}`}}
        ).then(res => {
            if (res.data.success) {
                dispatch({type: 'addBook', payload: res.data.bookmarks, id: parentId});
                setVis(false);
            } else {
                window.alert(res.data.message);
            }
        });
    };

    return (
        <div>

            {props.buttonType === 'primary'
                ? <ChunkyButton
                    onPress={() => setVis(true)}
                    text={'New Bookmark'}
                    type={darkMode ? 'secondaryDark' : 'secondary'} />
                : <button
                    onClick={() => setVis(true)}
                    className="plusButton">+</button>
            }

            <Dialog
                open={vis}
                onClose={() => setVis(false)}
                classes={{paper: 'modalBody ' + (darkMode && 'darkDialog')}}
                aria-labelledby="New Bookmark Form"
                elevation={24}
                onKeyPress={(e) => e.charCode === 13 && addBookmark()}
                transitionDuration={250}
            >

                <div className={"modalHeader " + (darkMode && 'darkBook')}>New Bookmark</div>

                <div className='fieldWrapper'>
                    <TextField
                        label='Bookmark Title'
                        placeholder='World Domination in 10 Quick Steps'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        dark={darkMode}
                    />

                    <TextField
                        label='Bookmark Url'
                        placeholder='wearetheworld-robots.com'
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
                </div>

                <div className='submitWrapper'>

                    <ChunkyButton
                        onPress={() => addBookmark()}
                        text={'Submit'}
                        type={darkMode ? 'primaryDark' : 'primary'}
                    />

                </div>

            </Dialog>

        </div>
    );
}


export default AddBookmark;