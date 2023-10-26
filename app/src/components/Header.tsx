// import { FaSearch } from "react-icons/fa";
import style from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { FaBook } from "react-icons/fa";
// import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  // const { user, isAuthenticated, auth } = useAuth();
  const dispatch = useAppDispatch();

  // const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("submit");
  // };

  const clickLogout = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    try {
      await dispatch(logout());
      // auth.fetchUser();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  // const goToOwnArticle = () => {
  //   navigate("/myarticle");
  // };

  // const goToArticle = () => {
  //   navigate("/");
  // };

  return (
    <nav className={`${style.nav} navbar navbar-expand-lg navbar-dark`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <FaBook />
          &nbsp;HowWiki
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li> */}
            {user && (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  บทความ
                </Link>

                <ul className={`dropdown-menu ${style.dropdown_menu}`}>
                  <li>
                    <Link className="dropdown-item" to="/myarticle">
                      บทความของคุณ
                    </Link>
                  </li>
                  {/* <li>
                    <hr className="dropdown-divider" />
                  </li> */}
                </ul>
              </li>
            )}
          </ul>
          <ul className={`navbar-nav mb-2 mb-lg-0`}>
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light me-2">
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link btn btn-success">
                    สมัครสมาชิก
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <Link
                  className="dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.username}
                </Link>

                <ul
                  className={`dropdown-menu  dropdown-menu-lg-end ${style.dropdown_menu}`}
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={(e) => clickLogout(e)}
                    >
                      ออกจากระบบ
                    </Link>
                  </li>
                  {/* <li>
                    <hr className="dropdown-divider" />
                  </li> */}
                </ul>
              </li>
            )}{" "}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
