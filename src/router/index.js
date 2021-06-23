import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Main from '../views/Main';
import QuestionList from '../views/QuestionList';
import AddQuestion from '../views/QuestionAdd';
import QuestionInfo from '../views/QuestionInfo';
import Statistics from "../views/Statistics";
import Rank from "../views/Rank";
import Test from "../views/Test";
import UserList from "../views/UserList";
import UserInfo from "../views/UserInfo";
import ArticleEdit from "../views/ArticleEdit";
import ArticleList from "../views/ArticleList";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login,
        meta: {
            title: "管理员登录"
        },
        show: false
    },
    // {path: '/login', redirect: '/'},//重定向，访问/login会跳转到
    {
        path: '/condition',
        name: '答题情况',
        component: Main,
        meta: {
            title: "答题情况"
        },
        show: true,
        children: [
            {
                path: '/statistics',
                name: '答题统计',
                component: Statistics,
                meta: {
                    title: "答题统计"
                },
                show: true
            },
            {
                path: '/rank',
                name: '答题排行',
                component: Rank,
                meta: {
                    title: "答题排行"
                },
                show: true
            }
        ]

    },
    {
        path: '/manage',
        name: '题库管理',
        component: Main,
        meta: {
            title: "知识竞答管理系统"
        },
        show: true,
        children: [
            {
                path: '/questionList',
                name: '题目列表',
                show: true,
                meta: {
                    title: "题目列表"
                },
                component: QuestionList
            },
            {
                path: '/addQuestion',
                name: '题目录入',
                show: true,
                meta: {
                    title: "题目录入"
                },
                component: AddQuestion
            },
            {
                path: '/detail',
                name: '题目详情',
                show: false,
                meta: {
                    title: "详情"
                },
                component: QuestionInfo
            },
            {
                path: '/userList',
                name: '用户列表',
                show: false,
                meta: {
                    title: "用户列表"
                },
                component: UserList

            },
            {
                path: '/userInfo',
                name: "用户详情",
                show: false,
                meta: {
                    title: "用户详情"
                },
                component: UserInfo

            },
            {
                path: '/test',
                name: 'test',
                show: false,
                component: Test
            }
        ]
    },
    {
        path: '/article',
        name: '文章管理',
        show: false,
        component: Main,
        meta: {
            title: "文章管理"
        },
        children: [
            {
                path: '/articleEdit',
                name: '发布文章',
                show: true,
                component: ArticleEdit
            },
            {
                path: '/articleList',
                name: '历史文章',
                show: true,
                component: ArticleList
            }
        ]

    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        if (token === 'null' || token === '') {
            //如果没有token则返回到登录页面
            next('/');
        } else {
            next();
        }
    }
});
export default router
