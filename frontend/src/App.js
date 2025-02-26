import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import Sidebar from './components/Sidebar';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import './App.css';
import AdminForgotPassword from './components/AdminForgotPassword';
import AdminResetPassword from './components/AdminResetPassword';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/admin" component={Admin} />
            <Route path="/forget-password" component={ForgetPassword} />
            <Route path="/reset-password/:resetToken" component={ResetPassword} />
            <Route path="/admin-forgot-password" component={AdminForgotPassword} />
            <Route path="/admin-reset-password/:resetToken" component={AdminResetPassword} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
