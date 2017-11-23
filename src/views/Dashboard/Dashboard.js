import React, { Component } from 'react';
import firebase from '../../firebase';

import ChartSales from '../../components/ChartSales';
import ChartUsers from '../../components/ChartUsers';

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      categoryCount: 0
    }

  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('categories');
    itemsRef.on('value', (snapshot) => {
      let count = snapshot.numChildren();
      this.setState({
        categoryCount: count
      });
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-6 col-lg-3">
            <div className="card">
              <div className="card-block p-1 clearfix">
                <i className="fa fa-user bg-info p-1 font-2xl mr-1 float-left"></i>
                <div className="h5 text-info mb-0 mt-h">8</div>
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
                <div className="h5 text-primary mb-0 mt-h">45</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Pedidos</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#/orders">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card">
              <div className="card-block p-1 clearfix">
                <i className="fa fa-puzzle-piece bg-warning p-1 font-2xl mr-1 float-left"></i>
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
                <div className="h5 text-danger mb-0 mt-h">31</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Productos</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
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

export default Dashboard;
