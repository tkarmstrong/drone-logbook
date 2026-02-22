import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/flights">Flights</Link>
              </li>
              <li>
                <Link to="/aircraft">Aircraft</Link>
              </li>
              <li>
                <button type="button" onClick={logout}>
                  Log out
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
