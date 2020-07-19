import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd';
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

//登陆路由组件
class Login extends React.Component{

    
    handleSubmit = (event) =>{
        //阻止默认行为
        event.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values

                //resul 可以直接拿到请求数据
                const result = await reqLogin(username, password)

                
                if(result.status===0){

                    message.success('登录成功')

                    //获取用户数据
                    const user = result.data
                    
                    //用户数据保存到内存中
                    memoryUtils.user = user

                    //用户数据保存到本地浏览器
                    storageUtils.saveUser(user)

                    //登录成功不需要回退到登录页面要使用 replace，不应该使用 push
                    this.props.history.replace('/')
                    // console.log('跳转首页')


                }else{

                    message.error(result.msg)
                }
                //console.log("请求成功", response.data)
            
                //console.log('验证成功', values);
                // const {username, password} = values
                // reqLogin(username, password).then(response => {
                //     console.log('请求成功')

                // }).catch(error => {
                //     console.log('请求失败')

                // })
            }else{
                //console.log('验证失败！！')
            }
          });

    }

    render(){

        const { getFieldDecorator } = this.props.form;

        //获取登陆信息，如果登陆信息存在，直接跳转到首页
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/' />

        }


        return (
            <div className='login'>
                <div className='login-head'>
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </div>

                <div className='login-content' >
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('username',{
                                    rules: [
                                        { required: true, whitespace: true, message: '请输入用户名' },
                                        { min: 4, message: '用户名至少4位' },
                                        { max: 12, message: '用户名最多12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须以英文、数字或下划线组成' },
                                    
                                    ],
                                    initialValue: 'admin'
                                  })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    rules: [
                                        { required: true, whitespace: true, message: '请输入密码' },
                                        { min: 4, message: '密码至少4位' },
                                        { max: 12, message: '密码最多12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须以英文、数字或下划线组成' },
                                    
                                    ],
                                    
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>

                </div>
            </div>
        )
    }
}

const LoginForm = Form.create()(Login)
export default LoginForm