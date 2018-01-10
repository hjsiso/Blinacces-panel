import React, { Component } from "react";
import store from './store';
import { isAdmin } from '@firebase/util';

const Authorization = (WrappedComponent) => {
  return class WithAuthorization extends React.Component {
    constructor(props) {
      super(props)

      // In this case the user is hardcoded, but it could be loaded from anywhere.
      // Redux, MobX, RxJS, Backbone...
      this.state = {
        user: store.getState().user,
        isAdmin: store.getState().isAdmin
      }

      store.subscribe(() => {
          this.setState({
              user: store.getState.user,
              isAdmin: store.getState().isAdmin
          });
      });
    }
    

    render() {
      //const { role } = this.state.user
      if (this.state.isAdmin) {
        return <WrappedComponent {...this.props} />
      } else {
        return <h1>Disculpe, su acceso no ha sido autorizado.</h1>
      }
    }
  }
}

export default Authorization;