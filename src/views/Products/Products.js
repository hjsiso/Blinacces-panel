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
            categories: [],
            showEditOpts: false,
            currentOrder: 'price'
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                    thumbnail: items[item].thumbnail,
                    description: items[item].description,
                    price: items[item].price,
                    category: items[item].category
                });
            }

            newState = _.orderBy(newState, this.state.currentOrder);

            this.setState({
                items: newState
            });

        });

        this.loadCategories();
    }

    editItem(item, e) {
        e.preventDefault();
        //console.log(item);
        this.setState({
            currentItem: item.id,
            productName: item.productName,
            showEditOpts: true
        })
    }

    delItem(item, e) {
        e.preventDefault();
        //console.log(item);
        let category = prompt("Por favor escriba la categoria a eliminar", "");

        if (category == item.productName) {

            if (confirm('Seguro que desea eliminar la categoria ' + category + ' ?')) {
                const itemsRef = firebase.database().ref('categories/' + item.id).remove();
                this.setState({
                    currentItem: '',
                    productName: '',
                    showEditOpts: false
                })
            }
        }


    }

    updateItem(e) {
        e.preventDefault();
        //console.log(this.state.currentItem);
        const itemsRef = firebase.database().ref('categories/' + this.state.currentItem).update({
            productName: this.state.productName
        });
        this.setState({
            currentItem: '',
            productName: '',
            showEditOpts: false
        })
    }

    hideEditOpts(e) {
        this.setState({
            showEditOpts: false,
            productName: '',
            currentItem: ''
        })
    }

    handleChange(e) {
        this.setState({
            currentOrder: e.target.value,
            items: _.orderBy(this.state.items, e.target.value)
        });

    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('categories');
        const item = {
            productName: this.state.productName,
            visible: true
        }
        itemsRef.push(item);
        this.setState({
            productName: '',
            currentItem: ''
        });
    }

    loadCategories(){
        const itemsRef = firebase.database().ref('/');
        itemsRef.child("categories").on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
           /* for (let item in items) {
                newState.push({
                    id: item,
                    categoryName: items[item].categoryName
                });
            }*/
            newState = items;
            this.setState({
                categories: newState
            });

            console.log("CATEGORIAS " + newState);
        });
    }

    render() {
        return (
            <div className="animated fadeIn">



                <table className="table table-sm table-inverse mb-2">
                    <thead>
                        <tr>
                            <th colSpan="3">
                                <div class="container">
                                    <div class="row">
                                        <div class="col col-sm-2">
                                            CATEGORIA:
                                        </div>
                                        <div class="col col-sm-2">
                                            <select class="form-control form-control-sm">
                                                <option selected>Todas</option>
                                            </select>
                                        </div>
                                        <div class="col col-sm-2">
                                            ORDENAR POR:
                                        </div>
                                        <div class="col col-sm-2">
                                            <select class="form-control form-control-sm" onChange={this.handleChange}>
                                                <option value="price">Precio</option>
                                                <option value="name">Nombre</option>
                                            </select>
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
                                        <img src={item.thumbnail} class="rounded float-left" alt={item.name} />
                                    </td>
                                    <td>
                                        <h4>{item.name}</h4>
                                        <small>{item.description}</small>
                                        <br/>
                                        <span class="badge badge-pill badge-info">{_.get(this.state.categories, `${item.category}.categoryName`)}</span>
                                    </td>
                                    <td width="150px">
                                        <span class="badge badge-pill badge-primary">
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