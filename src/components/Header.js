import React, { useEffect } from "react";

function Header(props) {
  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      window.location = "/";
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            {/* LOGO */}
            <button
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
              id="topnav-hamburger-icon"
            >
              <span className="hamburger-icon">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown d-md-none topbar-head-dropdown header-item">
              <button
                type="button"
                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle shadow-none"
                id="page-header-search-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-search fs-22" />
              </button>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="dropdown ms-1 topbar-head-dropdown header-item">
              <div className="dropdown-menu dropdown-menu-end">
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item language"
                  data-lang="sp"
                  title="Spanish"
                >
                  <img
                    src="assets/images/flags/spain.svg"
                    alt="user-image"
                    className="me-2 rounded"
                    height={18}
                  />
                  <span className="align-middle">Española</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item language"
                  data-lang="gr"
                  title="German"
                >
                  <img
                    src="assets/images/flags/germany.svg"
                    alt="user-image"
                    className="me-2 rounded"
                    height={18}
                  />
                  <span className="align-middle">Deutsche</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item language"
                  data-lang="it"
                  title="Italian"
                >
                  <img
                    src="assets/images/flags/italy.svg"
                    alt="user-image"
                    className="me-2 rounded"
                    height={18}
                  />
                  <span className="align-middle">Italiana</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item language"
                  data-lang="ru"
                  title="Russian"
                >
                  <img
                    src="assets/images/flags/russia.svg"
                    alt="user-image"
                    className="me-2 rounded"
                    height={18}
                  />
                  <span className="align-middle">русский</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item language"
                  data-lang="ch"
                  title="Chinese"
                >
                  <img
                    src="assets/images/flags/china.svg"
                    alt="user-image"
                    className="me-2 rounded"
                    height={18}
                  />
                  <span className="align-middle">中国人</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item language"
                  data-lang="fr"
                  title="French"
                >
                  <img
                    src="assets/images/flags/french.svg"
                    alt="user-image"
                    className="me-2 rounded"
                    height={18}
                  />
                  <span className="align-middle">français</span>
                </a>
              </div>
            </div>
            <div className="dropdown ms-sm-3 header-item topbar-user">
              <button
                type="button"
                className="btn shadow-none"
                id="page-header-user-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="d-flex align-items-center">
                  <img
                    className="rounded-circle header-profile-user"
                    src="../../assets/images/users/avatar-1.jpg"
                    alt="Header Avatar"
                  />
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                      {/* Anna Adame */} Admin
                    </span>
                  </span>
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <h6 className="dropdown-header">Welcome Admin!</h6>
                <a className="dropdown-item" href="" onClick={(e) => logout(e)}>
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />
                  <span className="align-middle" data-key="t-logout">
                    Logout
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
