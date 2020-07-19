import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const { SubMenu } = Menu;

class LeftNav extends React.Component{

    userAuth = (item) => {
        //console.log(memoryUtils)
        const {username} = memoryUtils.user
        const {menus} = memoryUtils.user.role
        //console.log(menus)
        //当用户是admin 拥有全部的权限
        if(username==='admin' || menus.indexOf(item.key)!==-1 || item.isShow===true){
            return true
        }else if(item.children){
            return !!item.children.find( e => menus.indexOf(e.key)!==-1)
            
        }else{
            return false
        }

    }

    
    //根据menuList菜单数据，使用map数组方法生成菜单项+递归调用
    menuLists = (menuList) =>{
        //获取当前打开的路径
        const path = this.props.location.pathname

        return menuList.map(item => {

            if(!item.children){
                    return(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                        <Icon type={item.Icon} />
                        <span>{item.title}</span>
                        </Link> 
                    </Menu.Item>
                )
            }else{
                //获取当前选中的二级菜单的 key是否和当前请求的路径一致

                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem){
                    this.openKey = item.key
                }


                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.Icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {this.menuLists(item.children)}
                    
                    </SubMenu>
                )
            }
            
        })

    }
    //根据menuList菜单数据，使用reduce数组方法生成菜单项+递归调用
    get_menuLists = (menuList) =>{

        return menuList.reduce((add, item) =>{

            if(this.userAuth(item)){
                if(!item.children){
                    //累加新数组
                    add.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                            <Icon type={item.Icon} />
                            <span>{item.title}</span>
                            </Link> 
                        </Menu.Item>
                    )) 
                }else{
                    //累加新数组
                    add.push((
                        <SubMenu
                            key={item.key}
                            title={
                            <span>
                                <Icon type={item.Icon} />
                                <span>{item.title}</span>
                            </span>
                            }
                        >
                            {this.get_menuLists(item.children)}
                        
                        </SubMenu>
                    ))
                }

            }
            
            //返回累加完成后的数组
            return add

        },[])

    }
/**
 * componentWillMount在第一次render之前调用一次
 * 为第一次render准备数据
 */
    componentWillMount(){

        this.menu = this.get_menuLists(menuList)


    }

    render(){

        //获取当前请求路径
        let path = this.props.location.pathname

        if(path.indexOf('/product')===0){
            path = '/product'
        }

        const openKey = this.openKey
        //debugger
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                    //inlineCollapsed={this.state.collapsed}
                    >
                    {
                        this.menu
                    }
                    {/* <Menu.Item key="/home">
                        <Link to='/home'>
                        <Icon type="pie-chart" />
                        <span>首页</span>
                        </Link>
                        
                    </Menu.Item>
                    
                    <SubMenu
                        key="sub1"
                        title={
                        <span>
                            <Icon type="mail" />
                            <span>商品</span>
                        </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>品类管理</Link>
                        </Menu.Item>

                        <Menu.Item key="/product">
                            <Link to='/product'>商品管理</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" > 
                            <Link to='/user'>
                            <Icon type="user" />
                            <span>用户管理</span>
                            </Link>
                    </Menu.Item>
                    <Menu.Item key="/role" > 
                            <Link to='/role'>
                            <Icon type="user" />
                            <span>角色管理</span>
                            </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub2"
                        title={
                        <span>
                            <Icon type="mail" />
                            <span>统计报表</span>
                        </span>
                        }
                    >
                        <Menu.Item key="/charts/bar">
                            <Link to='/charts/bar'>柱形图</Link>
                        </Menu.Item>

                        <Menu.Item key="/charts/line">
                            <Link to='/charts/line'>折线图</Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/pie">
                            <Link to='/charts/pie'>饼图</Link>
                        </Menu.Item>
                    </SubMenu> */}
                </Menu>
            </div>
        )
    }
}

//withRouter高阶组件 包装非路由组件
//并向非路由组件传递 3个属性  history ， location ， match
export default withRouter(LeftNav)