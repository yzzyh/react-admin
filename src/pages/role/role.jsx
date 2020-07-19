import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoleList, reqRoleAdd, reqRoleUpdate} from '../../api'
import AddForm from './add-form'
import Auth from './auth'
import memoryUtils from '../../utils/memoryUtils'
//import { render } from 'less'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

 //用户角色管理路由组件
 export default class Role extends Component{

   state = {
      roles: [
         {
            "menus": [
                "/role",
                "/charts/bar",
                "/home",
                "/category"
            ],
            "_id": "5ca9eaa1b49ef916541160d3",
            "name": "测试",
            "create_time": 1554639521749,
            "__v": 0,
            "auth_time": 1558679920395,
            "auth_name": "test007"
        },
        {
            "menus": [
                "/role",
                "/charts/bar",
                "/home",
                "/charts/line",
                "/category",
                "/product",
                "/products"
            ],
            "_id": "5ca9eab0b49ef916541160d4",
            "name": "经理",
            "create_time": 1554639536419,
            "__v": 0,
            "auth_time": 1558506990798,
            "auth_name": "test008"
        },
        {
            "menus": [
                "/home",
                "/products",
                "/category",
                "/product",
                "/role"
            ],
            "_id": "5ca9eac0b49ef916541160d5",
            "name": "角色1",
            "create_time": 1554639552758,
            "__v": 0,
            "auth_time": 1557630307021,
            "auth_name": "admin"
        }
      ], //角色列表
      role: {}, //用来保存是否有被点击的角色数据
      isShowAdd: false, //是否显示新增角色对话框
      isShowSetRole: false //是否显示设置角色权限对话框

   }
   constructor(porps){
      super(porps)

      this.authMeuns = React.createRef()
   }

   //初始化table每一列数据
   initColumns = () => {
      this.columns = [
         {
            title: '角色名称',
            dataIndex: 'name'
         },
         {
            title: '创建时间',
            dataIndex: 'create_time',
            render: formateDate
         },
         {
            title: '授权时间',
            dataIndex: 'auth_time',
            render: (auth_time) => formateDate(auth_time)
         },
         {
            title: '授权人',
            dataIndex: 'auth_name'
         },

      ]


   }

   //请求获取角色列表
   getRoles = async () => {
      const result = await reqRoleList()
      if(result.status===0){
         this.setState({
            roles: result.data
         })
      }
   }

   // 点击某一行回调，role是当前点击的数据对象
   onRow = (role) => {

      return {
         onClick: () => {
            this.setState({
               role
            })
            //console.log(role)
         }
      }
   }

   //新增角色
   add = () => {

      this.form.validateFieldsAndScroll( async (err, values) => {

         if(!err){

           const result = await reqRoleAdd(values)
           this.setState({isShowAdd: false})
           
           //清空输入框
           this.form.resetFields()
           if(result.status===0){
              message.success('角色新增成功！')
              //重新获取数据显示
              this.getRoles()
           }else{
              message.success('角色新增失败！')
           }
         }

      })  
   }
   //设置角色权限
   setRole = async () => {

      this.setState({isShowSetRole: false})
      const {role} = this.state
      const menus = this.authMeuns.current.getMenus()

      role.menus = menus
      role.auth_name = memoryUtils.user.username
      //console.log(role)

      const result = await reqRoleUpdate(role)
      if(result.status===0){

         if(role._id===memoryUtils.user.role._id){

            
            memoryUtils.user = {}
            storageUtils.removeUser()
            this.props.history.replace('/login')
            message.success('当前用户角色权限更新，请重新登录！')

         }else{
            message.success('设置权限成功！')
            //重新获取数据显示
            this.getRoles()

         }

        

      }





   }

   componentWillMount(){

      this.initColumns()
      this.getRoles()

   }

   render(){
      const {roles, role, isShowSetRole, isShowAdd} = this.state
      const title = (
         <span>
            <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
            <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowSetRole: true})}>设置角色权限</Button>
         </span>
      )
      
      return (
         <Card title={title} >

            <Table 
               rowKey="_id"
               bordered  
               columns={this.columns} 
               dataSource={roles} 
               rowSelection={{type: 'radio', 
               selectedRowKeys: [role._id],
               onSelect: (role) => {
                  this.setState({
                     role
                  })
               }
            }}
               onRow={this.onRow} 
               pagination={{
                 defaultPageSize: PAGE_SIZE,
                 
               }}
            
            />

            <Modal
              title="添加角色"
              visible={isShowAdd}
              onOk={this.add}
              cancelText= '取消'
              okText='确认'
              confirmLoading={false}
              onCancel={() => this.setState({isShowAdd: false})}
            >
              <AddForm 
                setForm={form => this.form = form}
                />

            </Modal>


            <Modal
              title="设置角色权限"
              visible={isShowSetRole}
              onOk={this.setRole}
              onCancel={() => this.setState({isShowSetRole: false})}
            >
               <Auth
                role={role}
                ref={this.authMeuns}
               />

            </Modal>

         </Card>
      )
   }
 }