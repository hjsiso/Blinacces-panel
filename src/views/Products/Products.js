import React, { Component } from 'react';
import firebase from '../../firebase';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Rodal from 'rodal';
import ProductDetail from '../../views/ProductDetail';

import 'rodal/lib/rodal.css';

class Products extends Component {

    constructor() {
        super();
        this.state = {
            currentItem: null,
            items: [],
            allItems: [],
            categories: null,
            categoriesArray: [],
            showEditOpts: false,
            currentOrder: 'price',
            currentCategory: '',
            currentSearch: '',
            visible: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.show = this.show.bind(this);
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('/');
        itemsRef.child("products").on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    name: items[item].name,
                    thumbnail: items[item].thumbnail + "/" + items[item].name,
                    description: items[item].description,
                    price: items[item].price,
                    category: items[item].category
                });
            }

            newState = _.orderBy(newState, this.state.currentOrder);

            this.setState({
                items: newState,
                allItems: newState
            });

        });

        this.loadCategories();

    }

    handleChange(e) {
        this.setState({
            currentOrder: e.target.value
        });
        this.filterList(this.state.currentCategory, e.target.value, this.state.currentSearch)

    }

    handleChangeCategory(e) {
        this.setState({
            currentCategory: e.target.value
        });
        this.filterList(e.target.value, this.state.currentOrder, this.state.currentSearch)
    }

    handleChangeSearch(e) {
        this.setState({
            currentSearch: e.target.value
        });
        this.filterList(this.state.currentCategory, this.state.currentOrder, e.target.value)
    }

    loadCategories() {
        const itemsRef = firebase.database().ref('/');
        itemsRef.child("categories").on('value', (snapshot) => {
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

        });


    }

    filterList(category, order, searchString) {
        let items = this.state.allItems;
        if (category != "") {
            items = _.filter(items, (item) => {
                return item.category == category
            });

            this.setState({
                items: items
            });
        }
        if (order != "") {
            this.setState({
                items: _.orderBy(items, order)
            });
        }
        if (searchString != "") {
            items = _.filter(items, (item) => {
                return item.name.toLowerCase().search(
                    searchString.toLowerCase()) !== -1;
            });
            this.setState({ items: items });
        }

    }

    getItembyId(id){
        let items = this.state.allItems;
        let selItem = _.filter(items, (item) => {
            return item.id == id
        });
        return selItem;
    }

    show(e) {
        let item = this.getItembyId(e.target.id);
        this.setState({currentItem: item, visible: true});
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        return (
  
            <div className="animated fadeIn">
                <table className="table table-sm table-inverse mb-2">
                    <thead>
                        <tr>
                            <th colSpan="3">
                                <div className="container">
                                    <div className="row">
                                        <div className="col col-sm-1">
                                            ITEMS:
                                        </div>
                                        <div className="col col-sm-1">
                                            <span className="badge badge-pill badge-primary">{this.state.items.length}</span>
                                        </div>
                                        <div className="col col-sm-2">
                                            CATEGORIA:
                                        </div>
                                        <div className="col col-sm-2">
                                            <select className="form-control form-control-sm" onChange={this.handleChangeCategory}>
                                                <option value="">Todas</option>
                                                {
                                                    this.state.categoriesArray.map((item) => {
                                                        return (
                                                            <option key={item.id} value={item.id}>{item.categoryName}</option>
                                                        )
                                                    })}
                                            </select>
                                        </div>
                                        <div className="col col-sm-2">
                                            ORDENAR POR:
                                        </div>
                                        <div className="col col-sm-2">
                                            <select className="form-control form-control-sm" onChange={this.handleChange}>
                                                <option value="price">Precio</option>
                                                <option value="name">Nombre</option>
                                            </select>
                                        </div>
                                        <div className="col col-sm-2">
                                            <input type="text" placeholder="Buscar..." className="form-control form-control-sm" onChange={this.handleChangeSearch} />
                                        </div>
                                    </div>
                                </div>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.items.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td width="100px">

                                            <img id={item.id} src={item.thumbnail} className="rounded float-left" alt={item.name} onClick={this.show} />

                                        </td>
                                        <td>
                                            <h4>{item.name}</h4>
                                            <small>{item.description}</small>
                                            <br />
                                            <span className="badge badge-pill badge-dark">{_.get(this.state.categories, `${item.category}.categoryName`)}</span>
                                        </td>
                                        <td width="150px">
                                            <h5>
                                            <span className="badge badge-pill badge-primary">
                                                <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </span>
                                            </h5>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>

                <Rodal visible={this.state.visible} animation="door" width="800" height="550" onClose={this.hide.bind(this)}>
                    <div><ProductDetail item={this.state.currentItem} categoriesArray={this.state.categoriesArray}/></div>
                </Rodal>

            </div>

        )
    }

}



export default Products;