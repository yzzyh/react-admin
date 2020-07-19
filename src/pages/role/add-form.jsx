import React, {Component} from 'react'
import { Form, Input } from 'antd'

class AddForm extends Component{

    componentWillMount(){
        this.props.setForm(this.props.form)
    }


    render(){
        const formItemLayout = {
            labelCol: {  //左侧label的宽度
               span: 4
            },
            wrapperCol: { //右侧包裹的宽度
              span: 12
            },
          }
        const {getFieldDecorator} = this.props.form
        return (
            <Form {...formItemLayout}>
                <Form.Item label="角色名称">
                    {
                        getFieldDecorator('roleName',{
                            rules: [{ required: true, message: '请输入角色名称' }],
                        })(
                            <Input placeholder='请输入角色名称' maxLength={12}></Input>
                        )
                    }
                    
                </Form.Item>
            </Form>
        )
    }

}

export default Form.create()(AddForm)