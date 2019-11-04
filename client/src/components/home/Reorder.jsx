import React, {useState, useContext} from 'react';
import Dialog from '@material-ui/core/Dialog/index';
import axios from 'axios';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {HomeDispatch, Token} from './Home';
import CollBubble from './CollBubble';


export default function Reorder(props) {

	const dispatch = useContext(HomeDispatch);
	const token = useContext(Token);

	const [collections, setCollections] = useState(props.collections);
	const [newOrder, setNewOrder] = useState([]);


	const handleDragEnd = result => {
		const {destination, source, draggableId} = result;

		// Item dragged outside of dialog or placed back in original position, do nothing
		if (!destination || destination.index === source.index) {
			return;
		}

		// Create an array of rearranged ids
		const newIds = collections.map(c => c._id);
		newIds.splice(source.index, 1);
		newIds.splice(destination.index, 0, draggableId);

		// Update the collections array
		let newColls = [];

		for (let i = 0; i < newIds.length; i++) {
			let index = collections.findIndex(c => c._id === newIds[i]);
			newColls.push(collections[index]);
		}

		setCollections(newColls);
		setNewOrder(newIds);
	}


	const updateOrder = () => {
		if (newOrder.length === 0) {
			props.close();
		} else {

			axios.post('https://astrostore.io/api/user/order',
				{order: newOrder},
				{headers: {Authorization: `JWT ${token}`}}).then(res => {
					if (res.data.success) {
						dispatch({type: 'setC', collections: collections, token: token});
						props.close();
					} else {
						alert('An error occurred. Please try again.');
					}
				})
		}
	}


	const handleClose = () => {
		props.close();
		setTimeout(() => {
			setCollections(props.collections);
		}, 250);
	};


	return (
		<div>
			<Dialog
				open={props.vis}
				onClose={() => handleClose()}
				classes={{paper: 'collectionsModal reorderModal'}}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>

				<div className='reorderHeader'>Rearrange Collections</div>

				<DragDropContext onDragEnd={handleDragEnd} onDragUpdate={() => window.navigator.vibrate(15)}>
					<Droppable droppableId="rearrangeArea">
						{(provided, snapshot) => (
							<div
								className='dropArea'
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{collections.map((c, i) => (<CollBubble key={c._id} id={c._id} title={c.title} index={i} />))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>

				<div className='reorderBtnsOuter'>
					<div className='reorderBtnsInner'>
						<button className='reorderCancelBtn' onClick={() => handleClose()} >Cancel</button>
						<button className='reorderSaveBtn' onClick={() => updateOrder()}>Save</button>
					</div>
				</div>

			</Dialog>
		</div>
	)
}