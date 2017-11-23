import React, { Component } from 'react';
import firebase from '../../firebase';

class Categories extends Component {

    constructor() {
        super();
        this.state = {
            currentItem: '',
            categoryName: '',
            items: [],
            showEditOpts: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('categories');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    categoryName: items[item].categoryName
                });
            }
            this.setState({
                items: newState
            });

            //console.log(newState);
        });
    }

    editItem(item, e) {
        e.preventDefault();
        //console.log(item);
        this.setState({
            currentItem: item.id,
            categoryName: item.categoryName,
            showEditOpts: true
        })
    }

    updateItem(e) {
        e.preventDefault();
        //console.log(this.state.currentItem);
        const itemsRef = firebase.database().ref('categories/' + this.state.currentItem).set({
            categoryName: this.state.categoryName
        });
        this.setState({
            currentItem: '',
            categoryName: '',
            showEditOpts: false
        })
    }

    hideEditOpts(e) {
        this.setState({
            showEditOpts: false,
            categoryName: '',
            currentItem: ''
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('categories');
        const item = {
            categoryName: this.state.categoryName
        }
        itemsRef.push(item);
        this.setState({
            categoryName: '',
            currentItem: ''
        });
    }

    render() {
        return (
            <div className="animated fadeIn">

                <form className="form-inline mb-2" onSubmit={this.handleSubmit}>
                    <label className="sr-only">Categoria</label>
                    <input type="text" className="form-control mb-2 mr-sm-2 mb-sm-0" name="categoryName" id="categoryName" placeholder="Nueva Categoria..." onChange={this.handleChange} value={this.state.categoryName} required />
                    <div class="invalid-feedback">
                        Please provide a valid Categoria.
                    </div>
                    <button type="submit" className={!this.state.showEditOpts ? "btn btn-outline-success btn-sm mr-2 float-left visible" : "btn btn-outline-success btn-sm mr-2 invisible"}><i className="fa fa-plus-square-o" aria-hidden="true"></i></button>
                    <button type="button" className={this.state.showEditOpts ? "btn btn-outline-success btn-sm mr-2 float-left visible" : "btn btn-outline-success btn-sm mr-2 invisible"} onClick={(e) => this.updateItem(e)}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                    <button type="button" className={this.state.showEditOpts ? "btn btn-outline-danger btn-sm mr-2 float-left visible" : "btn btn-outline-success btn-sm mr-2 invisible"} onClick={(e) => this.hideEditOpts(e)}><i className="fa fa-ban" aria-hidden="true"></i></button>
                </form>

                <table className="table table-sm table-inverse mb-2">
                    <thead>
                        <tr>
                            <th colSpan="2">Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.categoryName}</td>
                                    <td>
                                        <button type="button" className="btn btn-outline-primary btn-sm mr-2 float-right" onClick={(e) => this.editItem(item, e)}><i className="sm icon-pencil" /></button>
                                        <button type="button" className="btn btn-outline-danger btn-sm mr-2 float-right"><i className="sm icon-trash" /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span className="sr-only">Previous</span>
                            </a>
                        </li>
                        <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                            <a className="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span className="sr-only">Next</span>
                            </a>
                        </li>
                    </ul>
                </nav>

            </div>

        )
    }

}

export default Categories;