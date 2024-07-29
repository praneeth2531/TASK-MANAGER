import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ username, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand">TASK MANAGER</a>
       
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page">{username}</a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mr-5 mb-sm-0">
            <li className="nav-item">
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
