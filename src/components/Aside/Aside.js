import React, { Component } from 'react';
import { Container } from 'reactstrap';
import store from '../../store';
import { Route, Redirect, Switch } from 'react-router-dom';

class Aside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: store.getState().user
    }
  }

  componentWillMount() {
    this.setState({ user: store.getState().user });
  }

  render() {
    return (

      <aside className="aside-menu">
        {this.state.user ?
          (
            <Container>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-center p-2 mt-3"><img className="rounded-circle" style={{ height: '80px', width: '80px' }} src={this.state.user.photoURL} /></div>
                <div className="d-flex justify-content-center p-2"><h2>{this.state.user.displayName}</h2></div>
                <div className="d-flex justify-content-center p-2">
                  <a href="#/logout" className="btn btn-primary">Logout</a>
                </div>
              </div>
            </Container>
          ) : (
            <Redirect
              to={{
                pathname: '/login'

              }}
            />
          )}

      </aside>
    )
  }
}

export default Aside;
