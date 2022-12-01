export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'Help',
    path: '/help',
    key: 'help',
    icon: 'HomeOutlined',
    component: './Index'
  },
  {
    name: 'Start Up',
    path: '/arrangement',
    key: 'arrangement',
    icon: 'FundProjectionScreenOutlined',
    component: './project/arrangement/Index'
  },
  {
    name: 'Project',
    path: '/project',
    key: 'project',
    icon: 'ProfileOutlined',
    routes: [
      {
        path: '/project',
        redirect: '/project/list'
      },
      {
        path: '/project/list',
        component: './project'
      },
      {
        path: '/project/detail',
        component: "./project/arrangement/Index"
      }
    ],
  },
  {
    name: 'RunTemplate',
    icon: 'ReadOutlined',
    path: '/run',
    routes: [
      {
        path: "/run",
        redirect: '/run/list'
      },
      {
        path: "/run/list",
        component: './run/Manager',
        hideInMenu: true,
      },
      {
        //创建模板
        path: "/run/manager",
        component: './run/Manager/AddTemplate',
        hideInMenu: true,
      }
    ]
  },
  {
    path: '/',
    redirect: '/help',
  },
  {
    component: './404',
  },
];
