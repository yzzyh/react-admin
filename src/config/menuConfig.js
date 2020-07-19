// 配置菜单的js文件

const menuList = [
    {
        key: '/home',
        Icon: "pie-chart",
        title: '首页',
        isShow: true

    },
    {
        key: '/products',
        Icon: 'mail',
        title: '商品' ,
        children: [
            {
                key: '/category',
                Icon: 'mail',
                title: '品类管理' 
            },
            {
                key: '/product',
                Icon: 'mail',
                title: '商品管理'
            }

        ]
    },
    {
        key: '/user',
        Icon: "user",
        title: '用户管理'

    },
    {
        key: '/role',
        Icon: "user",
        title: '角色管理'

    },
    {
        key: '/charts',
        Icon: 'mail',
        title: '统计报表' ,
        children: [
            {
                key: '/charts/bar',
                Icon: 'mail',
                title: '柱形图' 
            },
            {
                key: '/charts/line',
                Icon: 'mail',
                title: '折线图'
            },
            {
                key: '/charts/pie',
                Icon: 'mail',
                title: '饼图'
            }

        ]
    },


]

export default menuList