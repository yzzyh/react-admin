/*
发送异步ajas请求的函数模块
封装axios库
函数返回的是promise对象
1.优化1：同意处理请求异常？
    在外层包一个自己创建的Promise对象
    在请求出错时，不调用reject(error),而是直接显示错误
2.优化2：异步得到的不是 reponse，而是reponse.data
    在请求成功时resolve： resolve(reponse.data)
*/

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET') {

    return new Promise((resolve, reject) =>{
        let promise
        //发送异步请求
        if(type==='GET'){
            promise = axios.get(url, {
                params: data
            })
        }else{
            promise = axios.post(url, data)
        }
        //发送异步请求成功
        promise.then(response =>{
            resolve(response.data)

        }).catch(error =>{
            message.error('请求出错！'+ error.message)
        })


    })
    

    
}