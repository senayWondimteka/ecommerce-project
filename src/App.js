import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route , Redirect } from 'react-router-dom';
import {auth, handleUserProfile} from './firebase/utils';
import { setCurrentUser } from './redux/User/user.actions';

// layouts
import MainLayout from './Layout/MainLayout';
import HomepageLayout from './Layout/HomepageLayout';

// pages
import Homepage from './pages/Homepage';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Recovery from './pages/Recovery'
import Dashboard from './pages/Dashboard';
import './default.scss'

// hoc 
import WithAuth from './HOC/withAuth';
import Admin from './pages/Admin';
import WithAdminAuth from './HOC/withAdminAuth';
import AdminToolbar from './components/AdminToolbar';
import AdminLayout from './Layout/AdminLayout';
import DashboardLayout from './Layout/DashboardLayout';

const App = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authListener = auth.onAuthStateChanged( async userAuth => {
      if(userAuth) {
        const userRef = await handleUserProfile({userAuth});
        userRef.onSnapshot(snapshot => {
          dispatch(setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          }));
        })
      }

      dispatch(setCurrentUser(userAuth));
    });

    return () => {
      authListener();
    }
  }, []);

 
  return (
    <div className="App">
      <AdminToolbar />
      <Switch>
          <Route exact path='/' render={() => (
            <HomepageLayout >
              <Homepage />
            </HomepageLayout>
          )} 
          />
          <Route path='/registration' render={() => (
          <MainLayout>
            <Registration />
          </MainLayout>
          )} 
          />
          <Route path='/login'
          render={() => (
            <MainLayout>
                <Login />
              </MainLayout>
            )} 
          />
          <Route path='/recovery' render= { () => (
            <MainLayout>
              <Recovery />
            </MainLayout>
          )} />

          <Route path='/dashboard' render= { () => (
            <WithAuth>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </WithAuth>
          )} />

          <Route path='/admin' render= { () => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </WithAdminAuth>
            
          )} />
        </Switch>
    </div>
  );
}

export default App;
