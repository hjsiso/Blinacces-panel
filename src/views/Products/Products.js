import React, { Component } from 'react';
import firebase from '../../firebase';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

class Products extends Component {

    constructor() {
        super();
        this.state = {
            currentItem: '',
            items: [],
            allItems: [],
            categories: null,
            categoriesArray: [],
            showEditOpts: false,
            currentOrder: 'price',
            currentCategory: '',
            currentSearch: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);

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
            currentOrder: e.target.value,
            items: _.orderBy(this.state.items, e.target.value)
        });

    }

    handleChangeCategory(e) {
        if (e.target.value == "") {
            this.setState({
                items: _.orderBy(this.state.allItems, this.state.currentOrder)
            });
        } else {
            let tmpItem = _.filter(this.state.allItems, (item) => {
                return item.category == e.target.value
            });

            this.setState({
                items: _.orderBy(tmpItem, this.state.currentOrder)
            });
        }
    }

    handleChangeSearch(e) {
        if (e.target.value == "") {
            this.setState({
                items: _.orderBy(this.state.allItems, this.state.currentOrder)
            });
        } else {
            let updatedList = _.filter(this.state.allItems, (item) => {
                return item.name.toLowerCase().search(
                    e.target.value.toLowerCase()) !== -1;
            });
            this.setState({ items: updatedList });
        }
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

    filterList(){

    }

    onDropdownSelected(e) {
        console.log("THE VAL", e.target.value);
        //here you will see the current selected value of the select input
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
                                        <div className="col col-sm-4">
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
                                            <img src={item.thumbnail} className="rounded float-left" alt={item.name} />
                                        </td>
                                        <td>
                                            <h4>{item.name}</h4>
                                            <small>{item.description}</small>
                                            <br />
                                            <span className="badge badge-pill badge-info">{_.get(this.state.categories, `${item.category}.categoryName`)}</span>
                                        </td>
                                        <td width="150px">
                                            <span className="badge badge-pill badge-primary">
                                                <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>


            </div>

        )
    }

}



export default Products;