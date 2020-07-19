import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'

import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import { reqUsers, reqAddorUpdateUser, reqDeleteUsers } from '../../api'
import UserForm from './user-form'
import {formateDate} from '../../utils/dateUtils'

const { confirm } = Modal
 //用户管理路由组件
 export default class User extends Component{

   state = {
      users: [], // 用户列表数据
      roles: [], //用户角色列表
      isShow: false, //是否显示对话框
      isLoading: false,//点击确认按钮显示加载中
      
   }

   initColumns = () => {
      this.columns = [
         
            {
               title: '用户名',
               dataIndex: 'username'
            },
            {
               title: '邮箱',
               dataIndex: 'email'
            },
            {
               title: '电话',
               dataIndex: 'phone'
               //render: (auth_time) => formateDate(auth_time)
            },
            {
               title: '注册时间',
               dataIndex: 'create_time',
               render: formateDate

            },
            {
               title: '所属角色',
               dataIndex: 'role_id',
               //render: role_id => this.state.roles.find(role => role._id===role_id).name
               render: role_id => this.initRolesName[role_id]
            },
            {
               title: '操作',
               render: (user) => (
                  <span>
                     <LinkButton onClick={() => this.updateUser(user)}>修改</LinkButton>
                     <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                  </span>
               )
            } 
      ]
   }
   //创建一个key是角色id ， value是角色名称的对象
   initRolesNames = (roles) => {
      
      this.initRolesName = roles.reduce((pre, role) => {
         pre[role._id] = role.name
         return pre
      } ,{})

      //console.log(this.initRolesName)

   }

   //获取用户列表
   getUser = async () => {
      const result = await reqUsers()
      if(result.status===0){
         const {users, roles} = result.data
         
         //创建一个key是角色id ， value是角色名称的对象
         this.initRolesNames(roles)

         this.setState({
            users,
            roles
         })
      }
   }
   //新增用户,弹出对话框
   addUser = () => {
      this.setState({
         isShow: true
      })
      
   }
    //修改用户,弹出对话框
    updateUser = (user) => {
      this.setState({
         isShow: true
      })
      this.user = user
   }

   //用户对话框点击确定
   onOk = () => {
      this.form.validateFieldsAndScroll( async (err, values) => {

         if(!err){

            let user = values

            if(this.user){
               user._id = this.user._id 
            }
            const result = await reqAddorUpdateUser(user)
            this.setState({isShow: false})
            if(result.status===0){
               message.success(`用户${this.user._id ? '修改' : '新增'}成功！`)
               //重新获取数据显示
               this.getUser()
            }else{
               message.error(`用户${this.user._id ? '修改' : '新增'}失败！`)
            } 
            //清空输入框
            this.form.resetFields()
            this.user = null
         }

      })
   }

   //用户对话框点击取消
   onCancel = () => {
      this.setState({isShow: false})
      //清空输入框
      this.form.resetFields()
      this.user = null
   }

   //删除用户
   deleteUser = (user) => {
      //console.log(user)
      confirm({
         okText: '确定',
         title: '确定删除用户？',
         content: '点击确定'+ user.username +'将会删除',
         cancelText: '取消',
         onOk: async () => {
           let userId = {
            userId: user._id
           }

           const result = await reqDeleteUsers(userId)
           //重新获取数据显示
           this.getUser()
           if(result.status===0){
              message.success('删除用户成功')
           }else{
            message.error('删除用户失败')
           }
         },
         onCancel() {
           //console.log('Cancel');
         },
       })

   }

   componentWillMount(){
      this.initColumns()
      
   }

   componentDidMount(){
      this.getUser()
   }
   
   

   render(){
      const {users, isShow, isLoading, roles} = this.state
      const user = this.user || {}
      const title = (
          <span>
             <Button type='primary' onClick={this.addUser}>创建用户</Button>
          </span>
       )
       return (
          <Card title={title}>
             <Table
               rowKey="_id"
               bordered  
               columns={this.columns} 
               dataSource={users} 
               //rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
               onRow={this.onRow} 
               pagination={{
                 defaultPageSize: PAGE_SIZE,
                 
               }}
             >

             </Table>

             <Modal
              title={this.user ? '修改用户' : '创建用户'}
              visible={isShow}
              onOk={this.onOk}
              cancelText= '取消'
              okText='确认'
              confirmLoading={isLoading}
              onCancel={this.onCancel}
            >
               <UserForm 
                setForm={form => this.form = form}
                user={user}
                roles={roles}
                /> 

            </Modal>


          </Card>
       )
   }
 }