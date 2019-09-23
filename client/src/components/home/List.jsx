import React from 'react';



function List(props) {

    return (
	        <div className='listContainer'>

	            {props.children}

	        </div>
    );

}

export default List;