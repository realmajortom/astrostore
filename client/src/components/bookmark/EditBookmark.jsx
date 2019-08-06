import React, {useState, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function EditBookmark(props) {
    const [title, setTitle] = useState(props.title);
    const [url, setUrl] = useState(props.url);
    const [vis, setVis] = useState(false);

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
            <button onClick={() => setVis(true)} className="editButton">Edit
            </button>

            <Dialog open={vis} onClose={() => setVis(false)}
                    classes={{paper: 'modalBody'}}
                    aria-labelledby='Edit Bookmark Form' elevation={24}
                    onKeyPress={(e) => e.charCode === 13 && sendUpdate()}
                    transitionDuration={250}>

                <div className="modalHeader">Edit Bookmark</div>

                <div className='fieldWrapper'>
                    <TextField label="Bookmark Title"
                               value={title}
                               placeholder={props.title}
                               onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField label="Bookmark Url"
                               value={url}
                               placeholder={props.url}
                               onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                <div className='submitWrapper'>
                    <ChunkyButton onPress={() => sendUpdate()}
                                  text={'Update'}
                                  type={'primary'}
                    />
                </div>

                <div className='deleteWrapper'>
                    <ChunkyButton onPress={() => props.delete()}
                                  text={'Delete'}
                                  type={'red'}
                    />
                </div>

            </Dialog>
        </div>
    );
}

export default EditBookmark;