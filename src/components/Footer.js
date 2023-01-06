import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <p className="m-0 text-white">
              {new Date().getFullYear()} © Procur.
            </p>
          </div>
          <div className="col-sm-6">
            <div className="text-sm-end d-none d-sm-block">
              <p className="m-0 text-white">
                Design & Develop by Procur.it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
