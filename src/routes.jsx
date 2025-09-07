import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Layout from './layout';
import LoginForm from './Pages/Login';
import SignUp from './Pages/SignUp';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from "./Pages/Dashboard"
import SetPassword from './Pages/SetPassword';
import { useSelector } from 'react-redux';
import Otp from './Pages/Otp';
import ModelView from './Pages/ModelView';
import PredictionModel from './components/PredictionModel';
import Users from './Pages/Users';
import CheckIn from './Pages/CheckIn';
import Scripting from './Pages/Scripting';
import MigrationList from './MigrationList';
import Admin from './components/Admin';


function GuestOnly({ children }) {
  const authenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log(authenticated,"time");
  
  const hasStoredAuth = () => {
    try {
      const authData = localStorage.getItem('authData');
      return authData && JSON.parse(authData).access_token;
    } catch {
      return false;
    }
  };
  
  return (authenticated || hasStoredAuth()) ? 
    <Navigate to="/app/dashboard" replace /> : children;
}

function AuthRequired({ requiredRoles = [], children }) {
  const user = useSelector((state) => state.auth.user);
  const authenticated = useSelector((state) => state.auth.isAuthenticated);
  let rolePermitted = true;
  if (requiredRoles.length) {
    rolePermitted = requiredRoles.includes(user?.role);
  }
  console.log(rolePermitted,"sdsd",authenticated);
  return authenticated && rolePermitted ? children : <Navigate to="/auth/login" />;
}



const router = createBrowserRouter([
    {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/auth/login',
    element: (
      // <GuestOnly>
        <LoginForm />
      //  </GuestOnly>
    ),
  },
  {
    path: '/auth/signup',
    element: (
      // <GuestOnly>
        <SignUp />
      //  </GuestOnly>
    ),
  },

  
  {
    path: '/model',
    element: <ModelView />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/password/:id',
    element: <SetPassword />,
  },
  {
    path: '/verify-email',
    element: <Otp />,
  },
  {
    path: '/app/',
    element: (
      <AuthRequired requiredRoles={["admin","user"]}>
        <Layout />
      </AuthRequired>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    {
        path: 'hazard-detector',
        element: <PredictionModel />,
      },
{
  path:"users",
  element:<Users/>
},

{
  path:"check-in-out",
  element:<CheckIn/>
},
{
  path:"scripting",
  element:<Scripting/>
},
{
  path:"migration-list",
  element:<MigrationList/>
},
{
  path:"admin",
  element:<Admin/>
}

    ],
  },
  {
    path: '*',
    element: (
      <div>
        404 - Page Not Found. The requested URL: {window.location.pathname} does not exist.
      </div>
    ),
  },
]);

export default router;
