import React, { Component } from 'react';
import Chart from 'chart.js';

class Dashboard extends Component {

  componentDidMount() {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [{
          label: '# Pedidos',
          data: [12, 19, 31, 15, 23, 3],
          backgroundColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 3)',
            'rgba(54, 162, 235, 3)',
            'rgba(54, 162, 235, 3)',
            'rgba(54, 162, 235, 3)',
            'rgba(54, 162, 235, 3)',
            'rgba(54, 162, 235, 3)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
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
                <div className="text-muted text-uppercase font-weight-bold font-xs">Usuarios</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#/users">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
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
                <div className="h5 text-warning mb-0 mt-h">7</div>
                <div className="text-muted text-uppercase font-weight-bold font-xs">Categorias</div>
              </div>
              <div className="card-footer p-x-1 py-h">
                <a className="font-weight-bold font-xs btn-block text-muted" href="#">Ver Más <i className="fa fa-angle-right float-right font-lg"></i></a>
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

        <canvas id="myChart" width="400" height="150"></canvas>
      </div>
    )

  }
}

export default Dashboard;
