import React, {Component} from 'react'
import {Form, Select, Input} from 'antd'


class AddForm extends Component{



    componentWillMount(){

        this.props.setForm(this.props.form)

    }

    render(){
        const {categorys, parentId} = this.props
        //console.log(parentId)
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Form.Item>
                   
                    {
                        getFieldDecorator('parentId',{
                            initialValue: parentId
                        })(
                            <Select>
                                <Select.Option value='0'>一级分类</Select.Option>
                                {
                                    categorys.map(c => <Select.Option value={c._id}>{c.name}</Select.Option>)
                                }
                            </Select>
                        )
                    }

                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            rules: [{ required: true, message: '请输入分类名称' }],
                          })(
                            <Input placeholder='请输入分类名称'></Input>
                        )
                    }
                    

                </Form.Item>
            </Form>

        )
    }
}

export default Form.create()(AddForm)