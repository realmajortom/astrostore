import React from 'react';
import { ReactComponent as Logo } from '../icon.svg';

function Nav(props) {
  return (
    <div>
      <nav className="navbar">
        <div className="appTitle">
          Astro<Logo className='tinyLogo' />Store
        </div>
        {props.children}
      </nav>
    </div>
  )
}

export default Nav;