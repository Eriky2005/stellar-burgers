import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import {
  getIsAuthLoading,
  getUserAuthStatus
} from '../../services/slices/userSlice/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getUserAuthStatus);
  const isDataLoading = useSelector(getIsAuthLoading);

  if (isDataLoading) {
    return <Preloader />;
  }

  if (!isAuthenticated && !onlyUnAuth) {
    return <Navigate replace to={'/login'} state={{ from: location }} />;
  }

  if (isAuthenticated && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }
  return children;
};
