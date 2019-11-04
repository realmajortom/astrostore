import {DarkMode} from './Home';
import React, {useContext} from 'react';

function Nav(props) {
    const darkMode = useContext(DarkMode);

    return (
        <nav className={'navbar ' + (darkMode && 'darkHome')}>

            <div className={'appTitle ' + (darkMode && 'darkNavText')}>
                Astro<img className='tinyLogo' src={require('./planet.png')} alt='Main Icon' />Store
            </div>

            <div className={props.local}>
                {props.children}
            </div>

        </nav>
    );
}

export default Nav;