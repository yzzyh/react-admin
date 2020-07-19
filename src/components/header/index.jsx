import React from 'react'
import { withRouter } from 'react-router-dom';
import { Modal} from 'antd';

import  LinkButton  from '../../components/link-button'
import './index.less'
import { formateDate } from "../../utils/dateUtils"
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils"
import  {requestWeather}  from "../../api"
import menuConfig from "../../config/menuConfig";
//import Item from 'antd/lib/list/Item';



const { confirm } = Modal;



 class Header extends React.Component{
    state = {
        
        presentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
        title: ''
    }

    //更新时间函数
    getTime = () =>{
        this.time = setInterval(() =>{
            let presentTime = formateDate(Date.now())
            this.setState({presentTime})
        },1000)
        
    }
    //获取天气时间函数
    getWeather = async () =>{

       const {dayPictureUrl, weather} = await requestWeather('广州')
       this.setState({dayPictureUrl, weather})

    }

    //动态获取title函数
    
    getTitle = () =>{
        const path = this.props.location.pathname
        let title
        menuConfig.forEach(Item =>{
            if(Item.key===path){
                title = Item.title
                //this.setState({title})

            }else if(Item.children){

                const cItem = Item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem){
                    title = cItem.title
                    //this.setState({title})
                }
            }
        })
        return title
    }
    //退出登录
    showConfirm = (event) => {
        event.preventDefault()

        confirm({
          okText: '确定',
          title: '确定退出登录吗？',
          content: 'Some descriptions',
          cancelText: '取消',
          onOk: () => {
            //console.log('OK');
            storageUtils.removeUser()
            memoryUtils.user = {}
            this.props.history.replace('/login')


          },
          onCancel() {
            //console.log('Cancel');
          },
        });
      }

//第一次render之后执行
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }

    //当前组件死亡之前调用 
    componentWillUnmount(){

        clearInterval(this.time)

    }


    render(){

        const {presentTime, dayPictureUrl, weather} = this.state
        const {username} = memoryUtils.user
        const title = this.getTitle()
        
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username} </span>
                    {/* <a href="" onClick={this.showConfirm}>退出</a> */}
                    {/* <Button onClick={this.showConfirm}>退出</Button> */}
                    <LinkButton onClick={this.showConfirm}>退出</LinkButton>
                </div>

                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{presentTime}</span>
                        <img src={dayPictureUrl} alt="img"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)