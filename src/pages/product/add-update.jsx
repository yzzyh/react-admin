import React, {Component} from 'react'
import {
    Input,
    Card,
    Form,
    Icon,
    Cascader,
    Button,
    message
   } from 'antd'

import LinkButton from '../../components/link-button'
import {reqGetCategory, reqAddorUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'




//商品新增修改路由子组件
class AddUpdate extends Component{
   state = {
      options: [],
   }
   constructor(props){
      super(props)
      //创建用来保存ref标识的标签对象的容器
      this.img = React.createRef()
      this.detail = React.createRef()
   }

   submit = () =>{
      this.props.form.validateFieldsAndScroll(async (err, value) => {
         if(!err){
            //alert('验证通过')
            const {categoryIds, desc, name, price} = value
            //收集图片数据
            const imgs =  this.img.current.getImges()
            //收集富文本数据
            const detail =  this.detail.current.getDetail()
            let pCategoryId, categoryId
            if(categoryIds.length===1){
               pCategoryId = 0
               categoryId = categoryIds[0]
            }else{
               pCategoryId= categoryIds[0]
               categoryId = categoryIds[1]
            }
            const product = {desc, name, price, pCategoryId, categoryId, imgs, detail}
            //如果是修改商品需要传商品_id
            if(this.isUpdate){
               product._id = this.product._id
            }

            //发送新增或修改请求
            const result = await reqAddorUpdateProduct(product)

            //根据请求结果信息提示
            if(result.status===0){
               message.success(`${this.isUpdate? '修改':'新增'}商品成功！`)
               this.props.history.goBack()
            }else{
               message.error(`${this.isUpdate? '修改':'新增'}商品失败！`)
            }
            //console.log(value, imgs, detail )
         }
      })
   }

   //验证价格合法性，必须大于0
   validator = (rule, value, callback) =>{

      if(value*1 > 0){
         callback()
      }else{
         callback('价格必须大于0')
      }

   }

   loadData = async selectedOptions => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;


      //获取二级分类列表数组
      const subCategorys = await this.getCategory(targetOption.value)

      targetOption.loading = false;

      if(subCategorys && subCategorys.length > 0){

         const subOptions = subCategorys.map((item) =>(
            {
               value: item._id,
               label: item.name,
               isLeaf: true
             }
         ))
         targetOption.children = subOptions

      }else{
         //如果二级分类没有数据，是叶子
         targetOption.isLeaf = true
      }
      this.setState({
         options: [...this.state.options]
       });
  
    }

    //async 函数的返回值是一个新的Promise对象， Promise对象的异步结果数据是根据async函数的返回值决定。
    //调用acync函数时 也要使用await和async来接收异步结果数据
    //获取分类数据
   getCategory = async (parentId) =>{
     const result = await reqGetCategory(parentId)
     if(result.status===0){
      const category = result.data
      
      //如果是一级分类列表，初始化options数组
      if(parentId===0){
         this.initOptions(category)
      }else{
         return category
      }
     }
   }

   //初始化级联信息数组
   initOptions = async (category) =>{
      const options = category.map((item) => {
         return {
            value: item._id,
            label: item.name,
            isLeaf: false,
          }
      })

      //修改时要显示二级分类
      const {product, isUpdate} = this
      const { pCategoryId} = product
      if(isUpdate && pCategoryId!=='0'){

         const subCategorys = await this.getCategory(pCategoryId)
         const subOptions = subCategorys.map((item) => (
            {
               value: item._id,
               label: item.name,
               isLeaf: true
             }
         ))
         const targetOption = options.find( option => option.value===pCategoryId)
         targetOption.children = subOptions
        
      }


      this.setState({
         options
      })
   }

   componentWillMount(){
      //判断当前页面是否是新增或修改this.isUpdate
      const product = this.props.location.state
      this.isUpdate = !!product
      //console.log(this.isUpdate, product)
      //保存商品信息，如果是新增则为空对象
      this.product = product || {}
   }

   componentDidMount(){  
      this.getCategory(0)
   }
   render(){

      const {product, isUpdate} = this
     
      const {categoryId, pCategoryId, imgs, detail} = product
      //修改时 用来接收级联分类数据id的数组
      const categoryIds = []
      if(isUpdate){
         if(pCategoryId==='0'){//如果是一级分类的商品
            categoryIds.push(categoryId)
         }else{//如果是二级分类的商品,注意要先添加父分类id
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
         }
         
      }
      //console.log(categoryIds)
      const {getFieldDecorator} = this.props.form
      const title = (
         <span>
            <LinkButton onClick={() => this.props.history.goBack()}>
               <Icon type='arrow-left' style={{marginRight: 15, fontSize: 20}} />
            </LinkButton>
            <span style={{fontSize: 20}}>{isUpdate ? '修改商品':'添加商品'}</span>

         </span>
      )
      const formItemLayout = {
         labelCol: {  //左侧label的宽度
            span: 2
         },
         wrapperCol: { //右侧包裹的宽度
           span: 8
         },
       };
       

      return (
         <Card title={title}>
            <Form {...formItemLayout}>

               <Form.Item label="商品名称" >
                  {
                     getFieldDecorator('name',{
                        rules: [{ required: true, message: '请输入商品名称' }],
                        initialValue: product.name
                     })(
                        <Input placeholder="请输入商品名称"/>
                     )
                  }
                  

               </Form.Item>
               <Form.Item label="商品描述" >
               {
                     getFieldDecorator('desc',{
                        rules: [{ required: true, message: '请输入商品描述' }],
                        initialValue: product.desc
                     })(
                        <Input.TextArea placeholder="请输入商品描述"/>
                     )
                  }
                  

               </Form.Item>
               <Form.Item label="商品价格" >

               {
                     getFieldDecorator('price',{
                        rules: [
                           { required: true, message: '请输入商品价格' },
                           {validator: this.validator}
                        ],
                        initialValue: product.price
                     })(
                        <Input type='number' placeholder="请输入商品价格" addonAfter="元"/>
                     )
                  }
                 

               </Form.Item>
               <Form.Item label="商品分类" >

                  {
                     getFieldDecorator('categoryIds',{
                        rules: [
                           { required: true, message: '请输入商品分类' }
                        ],
                        initialValue: categoryIds
                     })(
                        <Cascader 
                        options={this.state.options}
                        loadData={this.loadData}
                        placeholder="请选择分类" />

                     )
                  }
               

               </Form.Item>
               <Form.Item label="商品图片" >
                  <PicturesWall ref={this.img} imgs={imgs} />

               </Form.Item>
               <Form.Item label="商品详情"  labelCol={{span: 2}} wrapperCol={{span: 20}} >
                  <RichTextEditor ref={this.detail} detail={detail}/>
               </Form.Item>
               <Form.Item>
                  <Button type='primary' onClick={this.submit}>提交</Button>
               </Form.Item>

            </Form>

         </Card>
         
      )
   }
}
export default Form.create()(AddUpdate)

//子组件向父组件传递数据的方法
//1.子组件调用父组件的方法 数据以函数参数的形式传递给父组件
//2.父组件调用子组件的方法
// 2-1 创建用来保存ref标识的标签对象的容器 this.img = React.createRef()
// 2-2 用ref属性绑定子组件标签对象  <标签 ref={this.img} />
// 2-3 调用 this.img.current 属性可以获取子组件的方法
