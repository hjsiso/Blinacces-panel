import React, { Component } from 'react';

class Orders extends Component {

  render() {
    return (
      <table className="table table-sm table-inverse">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    )

  }
}

export default Orders;