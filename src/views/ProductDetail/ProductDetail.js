import React, { Component } from 'react'
import firebase from '../../firebase';

class ProductDetail extends Component {



    render() {
        const item = this.props.item;

        return (

            

            <div>
                 {item ? (
                <h2>Detalle Product {item[0].name}</h2>
            ) : (
                <h2>Not Found!</h2>
            )}
            </div>



        );

    }

}

export default ProductDetail;