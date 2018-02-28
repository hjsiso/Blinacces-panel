import React, { Component } from 'react';
import firebase from '../../firebase';
import Authorization from '../../Authorization'

class Customers extends Component {
    constructor(props) {
        super(props)

        this.state = {
            customers: null
        }
    }


    componentWillMount() {
        const itemsRef = firebase.database().ref('/');

        itemsRef.child("profiles").on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    name: items[item].userProfile.name,
                    email: items[item].userProfile.email,
                    company: items[item].userProfile.company,
                    phone: items[item].userProfile.phone,
                    photoURL: items[item].userProfile.photoURL,
                });
            }
            console.log("customers " + newState)
            this.setState({
                customers: newState
            })
        });
    }

    render() {
        return (
            <table className="table table-inverse">
                <thead>
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th>Compañia</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.customers.map(customer => {
                        return (
                            <tr key={customer}>
                                <th scope="row">
                                    <img
                                        src={customer.photoURL}
                                        className="rounded"
                                        alt={customer.name}
                                        style={{ height: 60, width: 60 }}
                                    />
                                </th>
                                <td>{customer.email}</td>
                                <td>{customer.name}</td>
                                <td>{customer.company}</td>
                                <td>{customer.phone}</td>
                            </tr>
                        );
                    })}


                </tbody>
            </table>
        )
    }

}

export default Authorization(Customers);
