import React from 'react'
import ReactDOM from 'react-dom'
//import 'antd/dist/antd.css'

import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取本地保存的登录状态信息
const user = storageUtils.getUser()

//保存登录信息到内存中
memoryUtils.user = user



ReactDOM.render(<App/>,document.getElementById('root'))