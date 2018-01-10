import React, { Component } from "react"
import { Container } from 'reactstrap';
import firebase, { auth, provider } from '../../firebase';
import { Route, Redirect } from 'react-router-dom';
import Full from '../../containers/Full/'
import store from "../../store";
import { isAdmin } from "@firebase/util";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            user: null,
            isAdmin: false,
            err: null,
            intentLogin: false
        }

        store.subscribe(() => {
            this.setState({
                user: store.getState().user,
                isAdmin: store.getState().isAdmin
            });
        });

        this.login = this.login.bind(this);
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                store.dispatch({
                    type: "SET_AUTH_USER",
                    user: user
                });
            } else {
                //this.setState({ err: `Disculpe, su acceso no ha sido autorizado.` });
                auth.signOut()
                    .then(() => {
                        store.dispatch({
                            type: "SET_ADMIN_USER",
                            isAdmin: false
                        });
                        store.dispatch({
                            type: "SET_AUTH_USER",
                            user: null
                        });
                    });


            }
        });
    }

    login(e) {
        e.preventDefault();
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.dir(user);
                store.dispatch({
                    type: "SET_AUTH_USER",
                    user: user
                });

                this.checkAdmin(user);

            });
    }

    checkAdmin(user) {
        let userRef = `admins/${user.uid}`
        console.log(`checkAdmin userRef ${userRef}`);
        const itemsRef = firebase.database().ref(userRef);
        itemsRef.on("value", snapshot => {
            let items = snapshot.val();
            console.dir(items)
            if (items) {
                console.log("checkAdmin return true")
                store.dispatch({
                    type: "SET_ADMIN_USER",
                    isAdmin: true
                });
            } else {
                this.setState({ err: `Disculpe, su acceso no ha sido autorizado.`, intentLogin: true });
            }
        });
    }

    render() {
        return (
            <Container>
                {
                    this.state.isAdmin ?
                        (
                            <div>
                                <Redirect
                                    to={{
                                        pathname: '/'

                                    }}
                                />

                            </div>
                        ) : (
                            <div className="d-flex flex-column">
                                <div className="p-2"><h2>Bienvenido !</h2></div>
                                <div className="p-2"><button type="button" className="btn btn-danger btn-lg btn-block" onClick={this.login}>Login con <i className="fa fa-google" aria-hidden="true">oogle</i>
                                </button></div>
                                {(this.state.err !== "" && this.state.intentLogin) && (
                                    <div className="p-2">
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.err}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )

                }

            </Container>
        )
    }

}

export default Login;