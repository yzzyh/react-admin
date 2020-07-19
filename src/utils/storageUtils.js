import store from 'store'

const USER_KEY = 'user_key'

export default {
    //保存user登陆信息
    saveUser(user){
        // localStroage 只能保存 string, 如果传递是对象, 会自动调用对象的 toString()并保存 
        //localStorage.setItem(USER_KEY, JSON.stringify(user)) // 保存的必须是对象的 json 串

        //使用store对象写法
        store.set(USER_KEY, user)
    },

    //获取user登陆信息
    getUser(){
        // 如果存在, 需要返回的是对象, 如果没有值, 返回{}
        //return JSON.parse(localStorage.getItem(USER_KEY) || '{}')

        //使用store对象写法
        return store.get(USER_KEY) || {}
    },
    
    //删除user信息
    removeUser(){
        //localStorage.removeItem(USER_KEY)

        //使用store对象写法
        store.remove(USER_KEY)
    }
    
}