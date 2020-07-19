import React, {Component} from 'react'
import { Form, Input, Tree } from 'antd'

import menuList from '../../config/menuConfig'


const { TreeNode } = Tree;
export default  class Auth extends Component{

    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }

    }
    //点击设置权限回调
    onCheck = checkedKeys => {
        //console.log('onCheck', checkedKeys)
        this.setState({ checkedKeys })
      }

    getMenus = () => this.state.checkedKeys

    initMenuList = (menuList) => {
        return  menuList.reduce((add,item) => {
            add.push(
                (<TreeNode title={item.title} key={item.key} >
                    {item.children ? this.initMenuList(item.children) : null}
                </TreeNode>)
            )

            return add
            
        } ,[])

    }

    //当组件接收到新的props时会调用,根据新的role更新checkedKeys状态
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
        //this.state.checkedKeys = menus
        //console.log(nextState)
    }
    
    
    componentWillMount(){
        //初始化权限列表
        this.TreeNodes = this.initMenuList(menuList)
    }

    render(){

        const {role} = this.props
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: {  //左侧label的宽度
               span: 4
            },
            wrapperCol: { //右侧包裹的宽度
              span: 12
            },
          }
        
        return (
            <div>
                <Form {...formItemLayout}>
                    <Form.Item label="角色名称">
                        <Input value={role.name} disabled></Input>  
                    </Form.Item>
                </Form>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.TreeNodes}
                        
                    </TreeNode>
                </Tree>
            </div>
        )
    }

}

