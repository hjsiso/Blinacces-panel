import React, {Component} from 'react';
import Chart from 'chart.js';


class ChartUsers extends Component {
    componentDidMount() {
        var ctx = document.getElementById("ChartUsers");
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul","Ago","Sep","Oct","Nov", "Dic"],
            datasets: [{
              label: '# Usuarios',
              data: [4, 6, 7, 3, 12, 16, 11, 4, 7, 12, 32, 13],
              backgroundColor: [
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107',
                '#ffc107'
              ],
              borderColor: [
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00',
                '#f8cb00'
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
        render(){
            return(
                <canvas id="ChartUsers" width="400" height="100"></canvas>
            )

        }


}

export default ChartUsers