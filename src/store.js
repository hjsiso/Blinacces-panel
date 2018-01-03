import {createStore} from 'redux';

const reducer = (state, action) => {
    if (action.type === "SET_PRODUCT_LIST"){
        console.log(action.type);
        console.dir(action.products);
        return{
            ...state,
            products: action.products
        };
    } else if (action.type === "SET_CATEGORY_LIST"){
        console.log(action.type);
        console.dir(action.categories);
        return{
            ...state,
            categories: action.categories
        };
    }
    return state;
}


export default createStore(reducer, {products: [], categories: []});