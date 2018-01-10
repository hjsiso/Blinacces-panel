import React, {Component} from 'react';
import {Link, Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';
import Orders from '../../views/Orders'; 
import Customers from '../../views/Customers';
import Categories from '../../views/Categories';
import Products from '../../components/Products';
import Logout from '../../components/Logout/Logout';

import Authorization from '../../Authorization'

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/orders" name="Orders" component={Orders}/>
                <Route path="/customers" name="Customers" component={Customers}/>
                <Route path="/categories" name="Categories" component={Categories}/>
                <Route path="/products" name="Products" component={Products}/>
                <Route path="/logout" name="Logout" component={Logout}/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Authorization(Full);
