import React, { Component } from 'react';
import firebase from '../../firebase';

import ChartSales from '../../components/ChartSales';
import ChartUsers from '../../components/ChartUsers';
import Authorization from '../../Authorization'

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      categoryCount: 0,
      productsCount:0,
      customersCount: 0,
      ordersCount: 0
    }

  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('/');
    
    itemsRef.child("categories").on('value', (snapshot) => {
      let count = snapshot.numChildren();
      this.setState({
        categoryCount: count
      });
    });

    itemsRef.child("products").on('value', (snapshot) => {
      let count = snapshot.numChildren();
      this.setState({
        productsCount: count
      });
    });

    itemsRef.child("profiles").on('value', (snapshot) => {
      let count = snapshot.numChildren();
      this.setState({
        customersCount: count
      });
    });

      let orders = itemsRef.child("orders")
      let ordersCount = 0
      orders.on('child_added', (snapshot) => {
        //console.log('child_added ' +  snapshot.numChildren())
        ordersCount = ordersCount + snapshot.numChildren();
        this.setState({
          ordersCount: ordersCount
        });
      })



  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-6 col-lg-3">
            <div className="card">
              <div className="card-block p-1 clearfix">
                <i className="fa fa-user bg-info p-1 font-2xl mr-1 float-left"></i>
                <div className="h5 text-info mb-0 mt-h">{this.state.customersCount}</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Clientes</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#/customers">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card">
              <div className="card-block p-1 clearfix">
                <i className="fa fa-truck bg-primary p-1 font-2xl mr-1 float-left"></i>
                <div className="h5 text-primary mb-0 mt-h">{this.state.ordersCount}</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Ordenes</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#/orders">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card">
              <div className="card-block p-1 clearfix">
                <i className="fa fa-list bg-warning p-1 font-2xl mr-1 float-left"></i>
                <div className="h5 text-warning mb-0 mt-h">{this.state.categoryCount}</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Categorias</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#/categories">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card">
              <div className="card-block p-1 clearfix">
                <i className="fa fa-shopping-bag bg-danger p-1 font-2xl mr-1 float-left"></i>
                <div className="h5 text-danger mb-0 mt-h">{this.state.productsCount}</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Productos</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#/products">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
              </div>
            </div>
          </div>
        </div>
        <ChartSales />
        <ChartUsers />
      </div>
    )

  }
}

export default Authorization(Dashboard);
