import React from 'react'
import { Layout } from 'antd';
import {Route, Switch, Redirect } from 'react-router-dom'

import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Role from '../role/role'
import User from '../user/user'
import memoryUtils from '../../utils/memoryUtils'
//import storageUtils from '../../utils/storageUtils'

const { Footer, Sider, Content } = Layout;

//admin主页路由组件
export default class Admin extends React.Component{

    componentDidMount(){
        //storageUtils.removeUser()
    }

    render(){
        const user = memoryUtils.user
        //debugger
       
        //console.log('render()', Boolean(user),user)
        if(JSON.stringify(user) === '{}'){
            
            //如果用户信息不存在，跳转到登陆页面
            return <Redirect to='/login' />
            
        }
        
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header />
                    <Content style={{backgroundColor: '#fff', margin: 15}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/> 
                            <Route path='/role' component={Role}/> 
                            <Route path='/user' component={User}/> 
                            <Route path='/charts/bar' component={Bar}/> 
                            <Route path='/charts/line' component={Line}/> 
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home'/>
                        
                        </Switch>

                    </Content>
                    <Footer style={{textAlign: 'center', color: 'rgb(204, 182, 182)'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}