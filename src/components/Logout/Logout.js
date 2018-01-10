import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import firebase, { auth, provider } from '../../firebase';
import { Container } from 'reactstrap';
import store from "../../store"


class Logout extends Component {

    componentDidMount() {
        auth.signOut()
            .then(() => {
                store.dispatch({
                    type: "SET_AUTH_USER",
                    user: null
                });
            });
    }



    render() {
        return (
            <Container>
                <Redirect
                    to={{
                        pathname: '/login'

                    }}
                />
            </Container>
        );
    }

}


export default Logout;