import React, {useContext, useState} from 'react';
import axios from 'axios/index';
import {HomeDispatch, Token, DarkMode} from '../home/Home';
import EditCollection from './EditCollection';
import AddBookmark from '../bookmark/AddBookmark';
import Bookmark from '../bookmark/Bookmark';


function Collection(props) {

	const token = useContext(Token);
	const darkMode = useContext(DarkMode);
	const dispatch = useContext(HomeDispatch);

	const id = props.c._id;
	let bookmarks = props.c.bookmarks;

	const [vis, setVis] = useState(props.c.vis);
	const [title, setTitle] = useState(props.c.title);

	const toggleList = () => {
		setVis(!vis);
		axios.post(`https://astrostore.io/api/collection/collapse/${id}`,
			{vis: !vis},
			{headers: {Authorization: `JWT ${token}`}}
		).then(() => dispatch({type: 'updateC', sub: 'vis', id: id}))
	};

	const deleteBookmark = (parent, date, id) => {
		axios.post('https://astrostore.io/api/bookmark/delete',
			{parentId: parent, addDate: date},
			{headers: {Authorization: `JWT ${token}`}}
		).then(res => {
			if (res.data.success) {
				dispatch({type: 'deleteFave', id: id});
				dispatch({type: 'deleteBook', pId: parent, id: id});
				bookmarks = bookmarks.filter(b => b._id !== id);
			} else {
				window.alert(res.data.message);
			}
		});
	};

	return (
		<div className={"collectionContainer " + (darkMode && 'darkCollection')}>

			<div className="collTitleContainer">
				<div className="collTitleText" onClick={() => toggleList()}>
					{title}
				</div>

				<div className='controlsOuter'>
					{vis &&
						<div className='controls'>
							<EditCollection title={title} id={id} liftUpdate={setTitle} />
							<AddBookmark id={id} pTitle={title} />
						</div>
					}
				</div>

			</div>

			{vis &&
				<div className="bookList">
					{bookmarks.map(b => <Bookmark bookmark={b} key={b._id} delete={deleteBookmark} />)}
				</div>
			}

		</div>
	);
}

export default Collection;