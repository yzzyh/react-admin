import React, {Component} from 'react'
import {Form, Input} from 'antd'


class UpdateForm extends Component{



    componentWillMount(){

        this.props.setForm(this.props.form)

    }

    render(){
        const {category} = this.props
        //console.log(parentId)
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            
                            rules: [{ required: true, message: '请输入分类名称' }],
                            initialValue: category.name
                          })(
                            <Input placeholder={'请输入分类名称'}></Input>
                        )
                    }
                    

                </Form.Item>
            </Form>

        )
    }
}

export default Form.create()(UpdateForm)