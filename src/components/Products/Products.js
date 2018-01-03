import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ProductsList from '../../views/ProductsList'
import ProductDetail from '../../views/ProductDetail'
 

const Products = () => (
  <Switch>
    <Route exact path='/products' component={ProductsList}/>
    <Route path='/products/:id' component={ProductDetail}/>
  </Switch>
)


export default Products