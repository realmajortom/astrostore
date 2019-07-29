import React from 'react';

function List(props) {

    return (
        <div className='listContainer'>
            {!props.mainVis && <div className='favTitle'>Favorites</div>}
            {props.children}
        </div>
    );
}

export default List;