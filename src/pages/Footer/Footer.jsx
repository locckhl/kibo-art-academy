import React from "react";
import { useAuth } from "../../contexts/AuthContext";
// import "./index.scss";
function Footer() {
  const {currentUser} = useAuth()
  return currentUser && <footer className="" id="footer" tabIndex="0">
      <div className="flex flex-col items-center py-3">
          Art Academy
      </div>
  </footer>;
}

const MemoFooter = React.memo(Footer);
export default MemoFooter;
