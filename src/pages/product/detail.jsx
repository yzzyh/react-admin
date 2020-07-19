import React, {Component} from 'react'
import {Card, List, Icon} from 'antd'

import RichTextEditor from './rich-text-editor'
import {BASE_IMG_URL} from '../../utils/constants'


//商品详情管理路由子组件
export default class ProductDetail extends Component{

    componentWillMount(){
        const product = this.props.location.state
        this.product = product || {}
    }


   render(){

        const {product} = this
       const title = (
           <span>
               <Icon 
               type='arrow-left' 
               style={{fontSize: 20, marginRight: 15}}
               onClick={() => this.props.history.goBack()} 
               ></Icon>
               <span style={{fontSize: 20}}>商品详情</span>

           </span>
       )
      return (
        <Card title={title} className='produot-detail'>

            <List>
                <List.Item>
                    <span className='left'>商品名称：</span>
                    <span>{product.name}</span>
                </List.Item>
                <List.Item>
                    <span className='left'>商品描述：</span>
                    <span>{product.desc}</span>
                </List.Item>
                <List.Item>
                    <span className='left'>商品价格：</span>
                    <span>{product.price}</span>
                </List.Item>
                <List.Item>
                    <span className='left'>商品分类：</span>
                    <span>3商品名称商品名称商品名称商品名称商品名称商品名称商品名称</span>
                </List.Item>
                <List.Item>
                    <span className='left'>商品图片：</span>
                    <span>
                        {
                            product.imgs.map(e => <img className='produot-img' src={BASE_IMG_URL + e} alt="img"/> )
                        }
                        
                    </span>
                </List.Item>
                <List.Item>
                    <span className='left'>商品详情：</span>
                    <span>
                        <RichTextEditor detail={product.detail}/>
                        
                    </span>
                </List.Item>

            </List>


        </Card>
      )
   }
}