import React, {Component} from 'react'
import { Card, Icon, Button, Table, Modal} from 'antd'

import {reqCategoryAdd, reqUpdateCategory, reqGetCategory} from '../../api'
import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateForm from './update-from'

//商品分类路由组件
export default class Category extends Component{


  state = {
    loading: false, //请求数据加载中
    categorys: [],  //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: '0', //一级分类id
    categoryName : '', //父级分类名称
    visible: 0, //对话框 0不显示 1显示新增分类 2显示修改分类
  }

  //获取一级分类列表函数
  getCategory = async (parentId) =>{

    //发请求前页面在加载loading
    this.setState({loading: true})
    
    //const {parentId} = this.state

    // parentId 可以传也可以不传
    parentId = parentId || this.state.parentId

    //发送请求
   const result = await reqGetCategory(parentId)

   //请求完成后去掉loading
   this.setState({loading: false})

   if(result.status===0){

    const categorys = result.data

    if(categorys){

      if(parentId==='0'){
      
        this.setState({categorys})
      }else{
        this.setState({
          subCategorys: categorys
        })
  
      }
    }
    
    
   }

  }
  //获取子分类列表函数
  getSubCategory = (category) =>{

    this.setState({
      parentId: category._id,
      categoryName: category.name

    },() =>{
      //状态更新完成后才能发请求，获取二级分类数据
      this.getCategory()
    })
  }

  //重新显示一级分类
  getFirstCategory = () =>{
    this.setState({
      subCategorys: [], 
      parentId: '0', 
      categoryName : ''
    })
  }

  //显示添加分类对话框
  categoryAdd = () =>{
    this.setState({
      visible: 1
    })
  }
  add = () =>{

    this.form.validateFieldsAndScroll((err, values) => {

      if(!err){
        //console.log('添加')
        this.setState({
          visible: 0
        })
        //收集表单数据
        const {parentId, categoryName} = values

        //console.log(parentId,categoryName)
        //发送请求
        reqCategoryAdd(parentId, categoryName)

        //清空输入数据
        this.form.resetFields()

        //如果是添加当前分类下的数据才重新获取显示
        if(parentId===this.state.parentId){
            //重新获取数据显示
            this.getCategory()
        }else if(parentId==='0'){//如果是在二级分类下添加一级分类，要重新获取数据但不需要要，重新渲染显示

          this.getCategory('0')
        }
      }
    })
  }

  //显示修改分类对话框
  updateCategory = (category) =>{
    this.category = category
    //console.log(category)
    this.setState({
      visible: 2
    })
  }
  update = () =>{

    this.form.validateFieldsAndScroll(async (err, values) => {

      if(!err){
        //console.log('修改')
        this.setState({
          visible: 0
        })
        const categoryId = this.category._id
        const {categoryName} = values
        const result = await reqUpdateCategory({categoryName, categoryId})
        
        //清空输入数据
        this.form.resetFields()

        if(result.status===0){
            //重新获取数据显示
            this.getCategory()
        }
      }
    })
  }

  //关闭对话框
  handleCancel = () =>{
    //清空输入数据
    this.form.resetFields()
    //关闭输入框
    this.setState({
      visible: 0
    })
    
  }


//第一次render之前准备数据
  componentWillMount(){
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
       
      },
      {
        title: '操作',
        key: 'action',
        width: 300,
        render: (category) => <span> 
          <LinkButton onClick={() => {this.updateCategory(category)}}>修改分类</LinkButton>
          { category.parentId==='0' ? <LinkButton onClick={() =>{this.getSubCategory(category)}}>查看子分类</LinkButton> : null }
        </span>
      },
    ]

  }

  componentDidMount(){
    this.getCategory()

  }

   render(){

     const {categorys, loading, categoryName, parentId, subCategorys, visible} = this.state
      
    //console.log(this.category)
      const title = (parentId ==='0' ? '一级分类' : (
        <span>
          <LinkButton onClick={this.getFirstCategory}>一级分类</LinkButton>
          <Icon type='arrow-right' style={{marginRight: 10}}></Icon>
          <span>{categoryName}</span>
        </span>
      ))
      const extra = (
         <Button type="primary" onClick={this.categoryAdd}>
            <Icon type='plus'/>
            添加
         </Button>
      )
      return (
         <Card title={title} extra={extra} style={{ width: '100%' }}>

            <Table
              loading= {loading}
              rowKey="_id"
              bordered  
              columns={this.columns} 
              dataSource={parentId==='0' ? categorys : subCategorys} 
              pagination={{
                defaultPageSize: 5,
                showQuickJumper: true
              }}
              />

            <Modal
              title="添加分类"
              visible={visible===1}
              onOk={this.add}
              onCancel={this.handleCancel}
            >
              <AddForm 
                categorys={categorys}
                parentId={parentId}
                setForm={form => this.form = form}
                />

            </Modal>

            <Modal
              title="修改分类"
              visible={visible===2}
              onOk={this.update}
              onCancel={this.handleCancel}
            >
              <UpdateForm setForm={form => this.form = form}
              category={this.category}
              />
              
            </Modal>

         </Card>
         )
   }
}