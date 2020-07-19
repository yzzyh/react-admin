import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from './ajax'


const BASE = ''

//登陆接口
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')


// 添加用户
export const reqAdd = (user) => ajax(BASE + '/manage/user/add', user, 'POST')


//添加分类  /manage/category/add
export const reqCategoryAdd = (parentId,categoryName) => ajax(BASE + '/manage/category/add', {parentId,categoryName} ,'POST')


//获取分类 /manage/category/list
export const reqGetCategory = (parentId) => ajax(BASE + '/manage/category/list', {parentId} ,'GET')


//更新品类名称 /manage/category/update
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update', {categoryId,categoryName} ,'POST')

//获取商品列表/manage/product/list
export const reqProdcts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

//添加商品/manage/product/add
export const reqProdctAdd = ({categoryId,pCategoryId,name,desc,price,detail,imgs}) => {
    return ajax(BASE+'/manage/product/add', {categoryId,pCategoryId,name,desc,price,detail,imgs}, 'POST')
}

//搜索商品/manage/product/search
//searchType 有可能是productName或者productDesc
export const reqSearchProdct = ({pageNum,pageSize,searchType,searchName}) => {
    return ajax(BASE+'/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchName
    })
}

//删除图片/manage/img/delete
export const reqDelectImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

//添加或修改商品/manage/product/add或update
export const reqAddorUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id? 'update':'add'), product, 'POST')

//商品上架、下架 /manage/product/updateStatus
export const reqUpdateStatus = (status) => ajax(BASE + '/manage/product/updateStatus', status, 'POST')

//请求获取角色列表，前台分页 /manage/role/list
export const reqRoleList = () => ajax(BASE + '/manage/role/list')

//添加角色/manage/role/add
export const reqRoleAdd = (roleName) => ajax(BASE + '/manage/role/add', roleName, 'POST')

//更新角色权限/manage/role/update
export const reqRoleUpdate = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取用户列表/manage/user/list
export const reqUsers = () => ajax(BASE + '/manage/user/list')

//新增用户/manage/user/add或者修改用户/manage/user/update
export const reqAddorUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id? 'update':'add'), user, 'POST')

//删除用户/manage/user/delete
export const reqDeleteUsers = (userId) => ajax(BASE + '/manage/user/delete', userId, 'POST')

//封装jsonp请求，获取天气数据
export const requestWeather = (city) => {

    return new Promise((resolve, reject) =>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) =>{
            //console.log('weather()', err, data)
            if(!err && data.status==='success'){

                const {dayPictureUrl, weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})

            }else{
                message.error('获取天气信息失败！')
            }
        })
    })

    

}
//weather('广州')