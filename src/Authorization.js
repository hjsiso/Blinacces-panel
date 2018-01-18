import React, { Component } from "react";
import store from "./store";
import { isAdmin } from "@firebase/util";
import { Route, Redirect } from "react-router-dom";
import { Container } from "reactstrap";

const Authorization = WrappedComponent => {
  return class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        user: store.getState().user,
        isAdmin: store.getState().isAdmin
      };

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
        return <WrappedComponent {...this.props} />;
      } else {
        return (
          <Container>
            <Redirect
              to={{
                pathname: "/login"
              }}
            />
          </Container>
        );
      }
    }
  };
};

export default Authorization;
