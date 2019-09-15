import React, {useContext} from 'react';
import {HomeDispatch} from './Home';
import {DarkMode} from './Home';

function Nav(props) {
    const darkMode = useContext(DarkMode);
    const dispatch = useContext(HomeDispatch);

    return (
        <nav className={'navbar ' + (darkMode && 'darkHome')}>

            <div className={'appTitle ' + (darkMode && 'darkNavText')} onClick={props.local === 'navHome' && (() => dispatch({type: 'toggleDark'}))}>
                Astro
                <img className='tinyLogo' src={require('./planet.png')} alt='Dark Mode Indicator'/>
                Store
            </div>

            <div className={props.local}>
                {props.children}
            </div>

        </nav>
    );
}

export default Nav;