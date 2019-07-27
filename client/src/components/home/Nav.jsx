import React from 'react';
import {ReactComponent as Logo} from '../../icon.svg';

function Nav(props) {
  return (
    <nav className='navbar'>
      <div className="appTitle">
        Astro<Logo className='tinyLogo' />Store
      </div>
      <div className={props.local}>
        {props.children}
      </div>
    </nav>
  )
}

export default Nav;