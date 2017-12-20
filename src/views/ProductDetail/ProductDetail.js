import React, { Component } from 'react'
import firebase from '../../firebase';

class ProductDetail extends Component {



    render() {
        const item = this.props.item;
        const categoriesArray = this.props.categoriesArray;
        return (



            <div className="animated fadeIn">
                <form>
                    {item ? (
                        <div className="row ml-2 mt-1 mr-2">
                            <div className="col col-sm-6">
                                <div class="form-group row">
                                    <label for="name" class="col-sm-4 col-form-label">Nombre</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="name" value={item[0].name} />
                                    </div>
                                </div>
                                <div class="form-group row" >
                                    <label for="price" class="col-sm-4 col-form-label">Precio</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" id="price" value={item[0].price} />
                                    </div>
                                </div>
                                <div class="form-group row" >
                                    <label for="category" class="col-sm-4 col-form-label">Categoría</label>
                                    <div class="col-sm-8">
                                        <select className="custom-select mb-2 mr-sm-2 mb-sm-0" onChange={this.handleChangeCategory}>
                                            <option value="">Seleccione</option>
                                            {
                                                categoriesArray.map((category) => {
                                                    return (

                                                        <option selected={category.id == item[0].category} key={category.id} value={category.id}>{category.categoryName}</option>
                                                    )
                                                })}
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="description">Descripción</label>
                                    <textarea class="form-control" id="description" rows="3">{item[0].description}</textarea>
                                </div>
                            </div>
                            <div className="col col-sm-6">
                                <div className="row ml-2 mt-1 mr-2">
                                    <div className="col col-sm-4">
                                        <img src={item[0].thumbnail} className="rounded float-left" alt={item[0].name} />
                                    </div>
                                    <div className="col col-sm-4">
                                        <img src={item[0].thumbnail} className="rounded float-left" alt={item[0].name} />
                                    </div>
                                    <div className="col col-sm-4">
                                        <img src={item[0].thumbnail} className="rounded float-left" alt={item[0].name} />
                                    </div>
                                </div>
                                <div className="row ml-2 mt-1 mr-2">
                                    <div className="col col-sm-12">
                                        <img src={item[0].thumbnail} className="rounded float-left" alt={item[0].name} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : (
                            <h2>Not Found!</h2>
                        )}
                </form>
            </div>



        );

    }

}

export default ProductDetail;