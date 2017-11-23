import React, { Component } from 'react';
import Chart from 'chart.js';


class ChartSales extends Component {
  componentDidMount() {
    var ctx = document.getElementById("ChartSales");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [{
          label: '# Pedidos',
          data: [12, 19, 31, 15, 23, 3, 4, 2, 23, 11, 17, 12],
          backgroundColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 162, 235, 1)',
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
            'rgba(54, 162, 235, 3)',
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
      <canvas id="ChartSales" width="400" height="100"></canvas>
    )

  }


}

export default ChartSales