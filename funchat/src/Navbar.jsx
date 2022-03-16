import React, { useContext } from "react";
import { useHistory , Link } from "react-router-dom";
// import { UserContext } from "../App";


function Navbar() {
//   const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const RenderList = () => {
      return (
        <>
        <li>
          <Link to="/login">Login</Link>
        </li>,
        <li>
          <Link to="/signup">SignUp</Link>
        </li>
        </>
      )
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to= "/login" className="brand-logo left">
          FunChat
        </Link>
        <ul id="nav-mobile" className="right">
          <RenderList />
          {/* {renderList()} */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
