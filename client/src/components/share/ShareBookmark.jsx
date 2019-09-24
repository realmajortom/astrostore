import React, {useState, useEffect} from 'react';
import axios from 'axios/index';

import {Dropdown, TextField} from '../inputs/MaterialInputs';
import ChunkyButton from '../inputs/ChunkyButton';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/styles';

import './sharestyle.css'


const queryString = require('query-string');


const useStyles = makeStyles({
	root: {
		fontFamily: ['Lato', 'sans-serif'],
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


function ShareBookmark(props) {

	const token = localStorage.getItem('JWT');

	const classes = useStyles();

	const [title, setTitle] = useState(queryString.parse(props.location.search).title);
	const [url, setUrl] = useState(queryString.parse(props.location.search).text);
	const [dropItems, setDropItems] = useState([]);
	const [message, setMessage] = useState('');
	const [parentId, setParent] = useState('');


	useEffect(() => {
		axios.get('https://astrostore.io/api/collection/all', {
			headers: {Authorization: `JWT ${token}`}
		}).then(res => {

			let rawColls = res.data.collections.map((c) => ({id: c._id, title: c.title}));
			let order = res.data.order;

			let sortedColls = [];

			for (let i = 0; i < order.length; i++) {
				const index = rawColls.findIndex(c => c.id === order[i]);
				if (index >= 0) {
					sortedColls.push(rawColls[index]);
					rawColls.splice(index, 1);
				}
			}

			if (rawColls.length > 0) {
				for (let j = 0; j < rawColls.length; j++) {
					sortedColls.push(rawColls[j]);
				}
			}

			let newOrder = sortedColls.map(c => c.id);

			if (newOrder !== order) {
				axios.post('https://astrostore.io/api/user/order',
					{order: newOrder},
					{headers: {Authorization: `JWT ${token}`}})
				     .then(res => console.log(res.data));
			}

			setDropItems(sortedColls);
		});
	}, [token]);


	const addBookmark = () => {
		axios.post('https://astrostore.io/api/bookmark/create',
			{title: title, url: url, parentId: parentId},
			{headers: {Authorization: `JWT ${token}`}})

		     .then(res =>
				res.data.success
					? setMessage('Success!')
					: setMessage('Error Adding Bookmark :(')
		)
	};


	return (
		<div className='container'>

            <div className='modalHeader'>New Bookmark</div>

            <div className='modalMessage'>{message}</div>

            <div className='fieldWrapper'>

                <TextField
	                label='Bookmark Title'
	                placeholder=''
	                value={title}
	                onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
	                label='Bookmark Url'
	                placeholder=''
	                value={url}
	                onChange={(e) => setUrl(e.target.value)}
                />

                <Dropdown
	                label='Collection'
	                value={parentId}
	                onChange={(e) => setParent(e.target.value)}
                >
                    {
	                    dropItems.map(c =>
		                    <MenuItem value={c.id} key={c.id} className={classes.root}>
                                {c.title}
                            </MenuItem>
	                    )
                    }
                </Dropdown>

            </div>

            <div className='submitWrapper'>

                <ChunkyButton onPress={() => addBookmark()} text={'Submit'} type={'primary'}/>

            </div>

        </div>
	);
}


export default ShareBookmark;