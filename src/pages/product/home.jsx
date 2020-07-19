import React, {Component} from 'react'
import {Card, Icon, Input, Button, Table, Select, message, Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProdcts, reqSearchProdct, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const { confirm } = Modal;
//商品管理默认路由组件
export default class ProductHome extends Component{
    state ={
        total: 0, //总页数
        loading: false, //是否正在加载中
        product: [], //商品列表数组
        searchType: 'productName',
        searchName: ''
    }


    //搜索商品或者请求获取商品列表
    getProdcts = async (pageNum) =>{
        this.pageNum = pageNum

        const {searchName, searchType} = this.state

        let result
        this.setState({loading: true})

        if(searchName){
            result = await reqSearchProdct({pageNum, pageSize: PAGE_SIZE, searchName, searchType})

        }else{

            result = await reqProdcts(pageNum, PAGE_SIZE)
        }
        
       if(result.status===0){
           const {total, list} = result.data
           this.setState({
            total,
            product: list,
            loading: false
           })
       }

    }
   
    //商品上架下架操作
    setStatus =  (status, e) => {   
        //console.log(status, e);
        confirm({
            okText: '确定',
            title: `确定${status===1 ? '下架' : '上架'}商品吗？`,
            content: '',
            cancelText: '取消',
            onOk: async () => {
              //
                if(status===1){
                    status={
                        status: 2,
                        productId: e._id
                    }
    
                    const result = await reqUpdateStatus(status)
                    if(result.status===0){
                        message.success('商品下架成功')
                        this.getProdcts(1)
                    }
                
                }else if(status===2){
                    status={
                        status: 1,
                        productId: e._id
                    }
        
                    const result = await reqUpdateStatus(status)
                    if(result.status===0){
                        message.success('商品上架成功')
                        this.getProdcts(1)
                    }
                }
  
  
            },
            onCancel() {
              //console.log('Cancel');
            },
          });
        

    }

    componentWillMount(){
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
             
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
               
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price) => "￥"+ price

             
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (status, e) => {
                    return (
                        <span>
                    <Button type='primary' onClick={() => this.setStatus(status, e)}>{status===1 ? '下架' : '上架'}</Button>
                    <span>{status===1 ? '在售' : '已下架'}</span>
                </span>
                    )
                }
               
            },
            {
              title: '操作',
              key: 'action',
              width: 100,
              render: (product) => <div> 
                <LinkButton onClick={() => this.props.history.push('/product/detail',product)}>详情</LinkButton>
                <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
              </div>
            },
          ]
    }

    componentDidMount(){
        this.getProdcts(1)
    }

   render(){
       const {loading, product, total,searchType } = this.state
       const title = (
           <span>
               <Select value={searchType} style={{width: 150}} onChange={vul => this.setState({searchType: vul})}>
                   <Select.Option value='productName'>按名称搜索</Select.Option>
                   <Select.Option value='productDesc'>按描述搜索</Select.Option>
               </Select>
               <Input placeholder="关键字" style={{width: 150, margin: '0 15px'}} onChange={e => this.setState({searchName: e.target.value})}></Input>
               <Button type='primary' onClick={() => this.getProdcts(1)}>搜索</Button>
           </span>
       )
       const extra = (
           <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
               <Icon type="plus"/>
               添加
            </Button>
       )

      return (
        <Card title={title} extra={extra} style={{ width: '100%' }}>

            <Table
              loading={loading}
              rowKey="_id"
              bordered  
              columns={this.columns} 
              dataSource={product} 
              pagination={{
                current: this.pageNum,
                total,
                defaultPageSize: PAGE_SIZE,
                showQuickJumper: true,
                onChange: this.getProdcts

              }}
            />
            


        </Card>
      )
   }
}