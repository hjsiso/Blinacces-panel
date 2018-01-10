import React, { Component } from "react";
import store from '../../store';

import firebase from "../../firebase";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import _ from "lodash";
import Rodal from "rodal";
import ProductDetail from "../../views/ProductDetail";
import Authorization from '../../Authorization'
import "rodal/lib/rodal.css";

class ProductsList extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: null,
      items: [],
      allItems: [],
      categories: null,
      categoriesArray: [],
      showEditOpts: false,
      currentOrder: store.getState().filterProducts.order,
      currentCategory: store.getState().filterProducts.category,
      currentSearch: store.getState().filterProducts.searchString,
      visible: false
    };

    this.handleChangeOrder = this.handleChangeOrder.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.show = this.show.bind(this);
  }



  componentDidMount() {
    const itemsRef = firebase.database().ref("/");
    itemsRef.child("products").on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          name: items[item].name,
          images: items[item].images,
          description: items[item].description,
          price: items[item].price,
          category: items[item].category,
          outstanding: items[item].outstanding
        });
      }

      newState = _.orderBy(newState, this.state.currentOrder);

      this.setState({
        items: newState,
        allItems: newState
      }, () => { this.filterList() });

      store.dispatch({
        type: "SET_PRODUCT_LIST",
        products: newState
      });

    });
    this.loadCategories();

  }

  handleChangeOrder(e) {
    this.setState({
      currentOrder: e.target.value
    }, () => { this.filterList() });
  }

  handleChangeCategory(e) {
    this.setState({
      currentCategory: e.target.value
    }, () => { this.filterList() });
  }

  handleChangeSearch(e) {
    this.setState({
      currentSearch: e.target.value
    }, () => { this.filterList() });
  }


  loadCategories() {
    const itemsRef = firebase.database().ref("/");
    itemsRef.child("categories").on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          categoryName: items[item].categoryName
        });
      }

      this.setState({
        categories: snapshot.val(),
        categoriesArray: newState
      });

      store.dispatch({
        type: "SET_CATEGORY_LIST",
        categories: newState
      })
    });
  }

  filterList() {
    let items = this.state.allItems;
    if (this.state.currentCategory !== "") {
      items = _.filter(items, item => {
        return item.category == this.state.currentCategory;
      });

      this.setState({
        items: items
      });
    }
    if (this.state.currentOrder !== "") {
      this.setState({
        items: _.orderBy(items, this.state.currentOrder)
      });
    }
    if (this.state.currentSearch !== "") {
      items = _.filter(items, item => {
        return (
          item.name.toLowerCase().search(this.state.currentSearch.toLowerCase()) !== -1
        );
      });
      this.setState({ items: items });
    }

    store.dispatch({
      type: "SET_PRODUCT_FILTER",
      filterProducts: {
        order: this.state.currentOrder,
        category: this.state.currentCategory,
        searchString: this.state.currentSearch
      }
    });

    store.dispatch({
      type: "SET_PRODUCT_LIST",
      products: items
    })
  }

  getItembyId(id) {
    let items = this.state.allItems;
    let selItem = _.filter(items, item => {
      return item.id == id;
    });
    return selItem;
  }

  show(e) {
    let item = this.getItembyId(e.target.id);
    this.setState({ currentItem: item, visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <table className="table table-sm table-inverse table-striped">
          <thead>
            <tr>
              <th colSpan="3">
                <div className="container">
                  <div className="row">
                    <div className="col col-sm-1">ITEMS:</div>
                    <div className="col col-sm-1">
                      <span className="badge badge-pill badge-primary">
                        {this.state.items.length}
                      </span>
                    </div>
                    <div className="col col-sm-2">CATEGORIA:</div>
                    <div className="col col-sm-2">
                      <select
                        className="form-control form-control-sm"
                        onChange={this.handleChangeCategory}
                      >
                        <option value="">Todas</option>
                        {this.state.categoriesArray.map(item => {
                          return (
                            <option key={item.id} value={item.id} selected={item.id === this.state.currentCategory}>
                              {item.categoryName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col col-sm-2">ORDENAR POR:</div>
                    <div className="col col-sm-2">
                      <select
                        className="form-control form-control-sm"
                        onChange={this.handleChangeOrder}
                      >
                        <option value="price" selected={'price' === this.state.currentOrder}>Precio</option>
                        <option value="name" selected={'name' === this.state.currentOrder}>Nombre</option>
                      </select>
                    </div>
                    <div className="col col-sm-2">
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="form-control form-control-sm"
                        onChange={this.handleChangeSearch}
                        value={this.state.currentSearch}
                      />
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.items.map(item => {
              return (
                <tr key={item.id}>
                  <td width="100px">
                    <div className="mt-2">
                      {item.images && item.images[0] ? (
                        <Link to={`/products/${item.id}`}>
                          <img
                            id={item.id}
                            src={item.images[0].thumbnail}
                            className="rounded float-left"
                            alt={item.name}

                          />
                        </Link>
                      ) : (
                          <Link to={`/products/${item.id}`}>
                            <img
                              id={item.id}
                              src="img/logo-symbol.png"
                              className="rounded float-left"
                              alt={item.name}

                            />
                          </Link>
                        )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">
                      <div className="p-2">
                        <h4>{item.name}</h4>
                      </div>
                      <div className="p-2">
                        <small>{item.description}</small>
                      </div>
                      <div className="p-2">
                        <span className="badge badge-pill badge-info p-2">
                          {_.get(
                            this.state.categories,
                            `${item.category}.categoryName`
                          )}
                        </span>
                        {item.outstanding && (
                         <span class="badge badge-pill badge-warning p-2 ml-2">Destacado</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td width="150px">
                    <div className="mt-3">
                      <h4>
                        <span className="badge badge-pill badge-primary p-2">
                          <NumberFormat
                            value={item.price}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$ "}
                          />
                        </span>
                      </h4>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Authorization(ProductsList);
