import React from "react";
// import "./index.scss";
function Footer() {
  return <footer className="" id="footer" tabIndex="0">
      <div className="flex flex-col items-center py-3">
          Footer
      </div>
  </footer>;
}

const MemoFooter = React.memo(Footer);
export default MemoFooter;
