import React, { Component } from 'react';
import firebase from '../../firebase';
import _ from "lodash";
import Authorization from '../../Authorization'
import numeral from 'numeral'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import store from '../../store';

class Orders extends Component {

  constructor(props) {
    super(props)

    this.state = {
      orders: store.getState().orders,
      ordersPending: store.getState().ordersPending,
      ordersRevised: store.getState().ordersRevised,
      profiles: null
    }


    this.handleInputChange = this.handleInputChange.bind(this);
  }


  componentDidMount() {

    this.unsubscribe = store.subscribe(() => {
      this.setState({
        orders: store.getState().orders,
        ordersPending: store.getState().ordersPending,
        ordersRevised: store.getState().ordersRevised
      });
    });


    const itemsRef = firebase.database().ref('/');
    //et orders = itemsRef.child("orders")
    //console.log("orders " +  orders )
    let ordersCount = 0
    var newState = [];


    itemsRef.child("orders").on('value', function (snapshot) {
      //console.log(snapshot.val());
      newState = [];
      snapshot.forEach(function (childSnapshot) {
        var childKey = childSnapshot.key;
        var items = childSnapshot.val();
        //console.log(items);
        for (let item in items) {
          //console.log(item)
          newState.push({
            id: item,
            startedAt: items[item].startedAt,
            dateString: moment("/Date(" + items[item].startedAt + ")/").format("DD/MM/YYYY HH:mm"),
            amount: numeral(items[item].amount).format('$ 0,0.00'),
            products: items[item].products,
            state: items[item].state === 'pending' ? false : true,
            icon: items[item].state === 'pending' ? 'work' : 'work',
            iconColor: items[item].state === 'pending' ? '#b3b3b3' : 'green',
            urlPDF: items[item].urlPDF,
            user: childKey
          });
          //console.log("newState")
          //console.log(newState)

        }

        newState = _.orderBy(newState, ['startedAt'], ['desc']);

        const ordersPending = _.filter(newState, item => {
          return item.state == false;
        });

        const ordersRevised = _.filter(newState, item => {
          return item.state == true;
        });

        store.dispatch({
          type: "SET_ORDERS",
          orders: newState
        });

        store.dispatch({
          type: "SET_ORDERS_PENDING",
          orders: ordersPending
        });

        store.dispatch({
          type: "SET_ORDERS_REVISED",
          orders: ordersRevised
        });

      });


    });

    newState = [];
    /*orders.on('child_added', (snapshot) => {
      let items = snapshot.val();
      let user = snapshot.key;
      console.log('child_added');
      console.log(items);
      for (let item in items) {
        newState.push({
          id: item,
          startedAt: items[item].startedAt,
          dateString: moment("/Date(" + items[item].startedAt + ")/").format("DD/MM/YYYY"),
          amount: numeral(items[item].amount).format('$ 0,0.00'),
          products: items[item].products,
          state: items[item].state === 'pending' ? false : true,
          icon: items[item].state === 'pending' ? 'work' : 'work',
          iconColor: items[item].state === 'pending' ? '#b3b3b3' : 'green',
          urlPDF: items[item].urlPDF,
          user: user
        });

        //console.log(newState)
      }


    })*/

    /*
     console.log(newState)
     this.setState({
       orders: _.orderBy(newState, ['startedAt'], ['desc'])
     })*/


    /*
        let p1 = new Promise((resolve, reject) => {
          orders.on('child_changed', (snapshot) => {
            let items = snapshot.val();
            let user = snapshot.key;
            console.log('child_changed');
            console.log(items);
            for (let item in items) {
              newState.push({
                id: item,
                startedAt: items[item].startedAt,
                dateString: moment("/Date(" + items[item].startedAt + ")/").format("DD/MM/YYYY"),
                amount: numeral(items[item].amount).format('$ 0,0.00'),
                products: items[item].products,
                state: items[item].state === 'pending' ? false : true,
                icon: items[item].state === 'pending' ? 'work' : 'work',
                iconColor: items[item].state === 'pending' ? '#b3b3b3' : 'green',
                urlPDF: items[item].urlPDF,
                user: user
              });
    
              //console.log(newState)
            }
          })
    
          resolve("fin");
        })
    
    
        p1.then((msg)=> {
          console.log("cambio completado " + msg)
        })
    
        this.setState({
          orders: _.orderBy(newState, ['startedAt'], ['desc'])
        })*/



    let profiles = itemsRef.child("profiles");
    profiles.once("value", snapshot => {

      this.setState({
        profiles: snapshot.val()
      })

      console.dir(snapshot.val())
    })



  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const id = target.id;
    console.log(id)
    this.updateItem(id, value);
  }

  updateItem(id, state) {

    const order = _.filter(this.state.orders, item => {
      return item.id == id;
    });

    if (!state) {
      state = 'pending'
    }

    console.log(order[0].user)
    const itemsRef = firebase
      .database()
      .ref("orders/" + order[0].user + "/" + id)
      .update({
        state: state
      }).then(() => {
        console.log("updated");
        toast.success("Los datos fueron guardados !", {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }).catch((error) => {
        console.log("updated");
        toast.error(`${error}`, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      });
  }

  render() {
    return (
      <div>
        <ToastContainer autoClose={2000}/>
        <h4>Pendientes</h4>
        <table className="table table-inverse">
          <thead>
            <tr>
              <th></th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Items</th>
              <th>Compañia</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Revisado</th>
            </tr>
          </thead>
          <tbody>
            {this.state.ordersPending.map(order => {
              return (
                <tr key={order.id}>
                  <th scope="row">
                  </th>
                  <td>{order.dateString}</td>
                  <td>{order.amount}</td>
                  <td>{order.products.length}</td>
                  <td>
                    {_.get(this.state.profiles, `${order.user}.userProfile.company`)}
                  </td>
                  <td>
                    {_.get(this.state.profiles, `${order.user}.userProfile.name`)}
                  </td>
                  <td><a href={order.urlPDF}><img width="32" height="32" src="img/purchase_order.png" /></a></td>
                  <td>
                    <input
                      type="checkbox"
                      className="form-control"
                      id={order.id}
                      name="revisado"
                      checked={order.state}
                      onChange={this.handleInputChange}

                    />

                  </td>
                </tr>
              );
            })}


          </tbody>
        </table>
        <hr/>    
        <h4>Revisadas</h4>
        <table className="table table-inverse">
          <thead>
            <tr>
              <th></th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Items</th>
              <th>Compañia</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Revisado</th>
            </tr>
          </thead>
          <tbody>
            {this.state.ordersRevised.map(order => {
              return (
                <tr key={order.id}>
                  <th scope="row">
                  </th>
                  <td>{order.dateString}</td>
                  <td>{order.amount}</td>
                  <td>{order.products.length}</td>
                  <td>
                    {_.get(this.state.profiles, `${order.user}.userProfile.company`)}
                  </td>
                  <td>
                    {_.get(this.state.profiles, `${order.user}.userProfile.name`)}
                  </td>
                  <td><a href={order.urlPDF}><img width="32" height="32" src="img/purchase_order.png" /></a></td>
                  <td>
                  <input
                      type="checkbox"
                      className="form-control"
                      id={order.id}
                      name="revisado"
                      checked={order.state}
                      onChange={this.handleInputChange}

                    />

                  </td>
                </tr>
              );
            })}


          </tbody>
        </table>
      </div>
    )
  }
}

export default Authorization(Orders);