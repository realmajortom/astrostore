import React, {useState, useEffect, useContext} from 'react';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';
import {DarkMode} from '../home/Home';


function EditBookmark(props) {
    const darkMode = useContext(DarkMode);

	const [vis, setVis] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [url, setUrl] = useState(props.url);


    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    useEffect(() => {
        setUrl(props.url);
    }, [props.url]);

    const sendUpdate = () => {
        props.update(title, url);
        setVis(false);
    };

    return (
        <div>

            <button onClick={() => setVis(true)} className="editButton">
	            <img src={require('../../edit.png')} alt='Edit Button' className='editImg'/>
            </button>

            <Dialog open={vis}
                    onClose={() => setVis(false)}
                    classes={{paper: 'modalBody ' + (darkMode && 'darkDialog')}}
                    aria-labelledby='Edit Bookmark Form' elevation={24}
                    onKeyPress={(e) => e.charCode === 13 && sendUpdate()}
                    transitionDuration={250}>

                <div className={"modalHeader " + (darkMode && 'darkBook')}>Edit Bookmark</div>

                <div className='fieldWrapper'>

                    <TextField label="Bookmark Title"
                               value={title}
                               placeholder={props.title}
                               onChange={(e) => setTitle(e.target.value)}
                               dark={darkMode}
                    />

                    <TextField label="Bookmark Url"
                               value={url}
                               placeholder={props.url}
                               onChange={(e) => setUrl(e.target.value)}
                               dark={darkMode}
                    />
                </div>

                <div className='submitWrapper'>
                    <ChunkyButton onPress={() => sendUpdate()}
                                  text={'Update'}
                                  type={darkMode ? 'primaryDark' : 'primary'}
                    />
                </div>

                <div className='deleteWrapper'>
                    <ChunkyButton onPress={() => props.delete()}
                                  text={'Delete'}
                                  type={darkMode ? 'redDark' : 'red'}
                    />
                </div>

            </Dialog>
        </div>
    );
}

export default EditBookmark;