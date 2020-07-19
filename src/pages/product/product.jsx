 import React, {Component} from 'react'
 import {Switch, Route, Redirect} from 'react-router-dom'

 import ProductHome from './home'
 import AddUpdate from './add-update'
 import ProductDetail from './detail'
 import './product-style.less'
 

 //商品管理路由组件
 export default class Product extends Component{


    render(){
       return (
          <Switch>
             <Route path='/product' component={ProductHome} exact></Route>
             <Route path='/product/addupdate' component={AddUpdate}></Route>
             <Route path='/product/detail' component={ProductDetail}></Route>
             <Redirect to='/product'/>
          </Switch>
       )
    }
 }