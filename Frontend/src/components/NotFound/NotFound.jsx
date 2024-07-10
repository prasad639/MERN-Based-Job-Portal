import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page notfound">
      <div className="content">
        <img src="/notfound.png" alt="not found" />
        <Link to={"/"}>Return to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
