import React from 'react';
import {Draggable} from 'react-beautiful-dnd';


const dragStyle = {
	cursor: 'pointer',
	backgroundColor: '#eeeeee',
	boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.20)'
}

export default function CollBubble(props) {
	return (
		<Draggable draggableId={props.id} index={props.index}>
			{(provided, snapshot) => (
				<div
					className='collBubbleOuter'
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<div className='collBubbleInner' style={snapshot.isDragging ? dragStyle : {}}>
						<p className='collBubbleTitle'>{props.title}</p>
					</div>
				</div>
			)}
		</Draggable>
	)
}