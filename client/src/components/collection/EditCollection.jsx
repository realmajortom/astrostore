import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {Token, HomeDispatch, DarkMode} from '../home/Home';
import Dialog from '@material-ui/core/Dialog/index';
import ChunkyButton from '../inputs/ChunkyButton';
import {TextField} from '../inputs/MaterialInputs';


function EditCollection(props) {

    const id = props.id;

    const token = useContext(Token);
    const darkMode = useContext(DarkMode);
    const dispatch = useContext(HomeDispatch);

    const [vis, setVis] = useState(false);
    const [title, setTitle] = useState(props.title);


    const sendUpdate = () => {
        axios.post(`https://astrostore.io/api/collection/update/${id}`,
            {title: title},
            {headers: {Authorization: `JWT ${token}`}})
            .then(res => {
                if (res.data.success) {
                    dispatch({type: 'updateC', sub: 'title', id: id, title: title});
                    props.liftUpdate(title);
                    setVis(false);
                } else {
                    window.alert(res.data.message);
                }

            });
    };

    const sendDelete = () => {
        if (window.confirm('Permanently delete this collection and its bookmarks?')) {
            axios.post(`https://astrostore.io/api/collection/delete/${id}`,
                {headers: {Authorization: `JWT ${token}`}})
                .then(res => {
                    if (res.data.success) {
                        dispatch({type: 'deleteC', id: id});
                    } else {
                        window.alert(res.data.message);
                    }
                });
        }
    };

    return (
        <div className='editDiv'>

            <button onClick={() => setVis(true)} className="editButton">
                <img src={require('../inputs/edit.png')} alt='Edit Button' className='editImg' />
            </button>

            <Dialog open={vis}
                onClose={() => setVis(false)}
                classes={{paper: 'modalBody modalMedium ' + (darkMode && 'darkDialog')}}
                aria-labelledby='Edit Collection Form'
                elevation={24}
                onKeyPress={(e) => e.charCode === 13 && sendUpdate()}
                transitionDuration={250}>

                <div className={"modalHeader " + (darkMode && 'darkBook')}>Edit Collection</div>


                <form>
                    <TextField label="Collection Title:"
                        value={title}
                        placeholder=''
                        dark={darkMode}
                        onChange={(e) => setTitle(e.target.value)} />
                </form>

                <div className='submitWrapper'>
                    <ChunkyButton onPress={() => sendUpdate()}
                        text={'Update'}
                        type={darkMode ? 'primaryDark' : 'primary'} />
                </div>

                <div className='deleteWrapper'>
                    <ChunkyButton onPress={() => sendDelete()}
                        text={'Delete'}
                        type={darkMode ? 'redDark' : 'red'} />
                </div>

            </Dialog>
        </div>
    );
}

export default EditCollection;