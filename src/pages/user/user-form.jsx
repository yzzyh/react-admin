import React, {Component} from 'react'
import { Form, Input, Select} from 'antd'

class UserForm extends Component{

    componentWillMount(){
        this.props.setForm(this.props.form)
    }


    render(){
        const {roles} = this.props
        const formItemLayout = {
            labelCol: {  //左侧label的宽度
               span: 4
            },
            wrapperCol: { //右侧包裹的宽度
              span: 16            },
          }
        const {getFieldDecorator} = this.props.form
        const {user} = this.props
        
        return (
            <Form {...formItemLayout}>
                <Form.Item label="用户名">
                    {
                        getFieldDecorator('username',{
                            rules: [{ required: true, message: '请输入用户名称' }],
                            initialValue: user.username
                        })(
                            <Input placeholder='请输入用户名称' maxLength={12}></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="密码">
                    {
                        getFieldDecorator('password',{
                            rules: [{ required: true, message: '请输入密码' }],
                            initialValue: user.password
                        })(
                            <Input placeholder='请输入密码' maxLength={18} minLength={6}></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="手机号">
                    {
                        getFieldDecorator('phone',{
                            rules: [{ required: true, message: '请输入手机号' }],
                            initialValue: user.phone
                        })(
                            <Input placeholder='请输入手机号' maxLength={11}></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="邮箱">
                    {
                        getFieldDecorator('email',{
                            rules: [{ required: true, message: '请输入邮箱' }],
                            initialValue: user.email
                        })(
                            <Input placeholder='请输入邮箱' maxLength={20}></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="角色">
                   
                    {
                        getFieldDecorator('role_id',{
                            initialValue: user.role_id,
                            rules: [{ required: true, message: '请选择角色' }],
                        })(
                            <Select>
                                {
                                    roles.map((c, i) => <Select.Option value={c._id} key={i}>{c.name}</Select.Option>)
                                }
                            </Select>
                        )
                    }

                </Form.Item>
            </Form>
        )
    }

}

export default Form.create()(UserForm)