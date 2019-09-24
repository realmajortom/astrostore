import React, {useState, useContext} from 'react';
import axios from 'axios';
import {HomeDispatch, Token, Ddl} from './Home';
import Dialog from '@material-ui/core/Dialog';
import ChunkyButton from '../inputs/ChunkyButton';



function Rearrange(props) {

	const [vis, setVis] = useState(props.vis);
	const [order, setOrder] = useState([]);

	const dispatch = useContext(HomeDispatch);
	const ddl = useContext(Ddl);
	const token = useContext(Token);

	const sendUpdate = () => {
		axios.post('https://astrostore.io/api/user/order',
			{order: order},
			{headers: {Authorization: `JWT ${token}`}})
		     .then(res => console.log(res.data));
	};


	return (
		<div>
			<Dialog open={vis}
			        onClose={() => setVis(false)}
			        classes={{paper: 'modalBody modalMedium '}}
			        aria-labelledby='Edit Collection Form'
			        elevation={24}
			        onKeyPress={(e) => e.charCode === 13 && sendUpdate()}
			        transitionDuration={250}>


				<div className={"modalHeader "}>Rearrange Collections</div>





				<div className='submitWrapper'>

                    <ChunkyButton onPress={() => sendUpdate()}
                                  text={'Update'}
                                  type={'primary'}/>

                </div>

			</Dialog>
		</div>
	)
}

export default Rearrange;