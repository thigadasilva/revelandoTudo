import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/home.vue"
import Login from "../pages/login.vue"
import Cadastro from "../pages/cadastro.vue"
import CadastroAdmin from "../pages/cadastroAdmin.vue"
import CadastroUsuario from "../pages/cadastroUsuario.vue"

import Dashboard from "../pages/dashboard.vue"
import Demandas from "../pages/demandas.vue"

import AdminDashboard from "../pages/adminDashboard.vue"
import StudentDashboard from "../pages/studentDashboard.vue"
import SwaggerPage from "../pages/swagger.vue"




const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/cadastro",
    component: Cadastro
  },
  {
    path: "/cadastro-admin",
    component: CadastroAdmin
  },
  {
    path: "/cadastro-usuario",
    component: CadastroUsuario
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      role: "admin"
    }
  },
  

  {
    path: "/student",
    component: StudentDashboard,
    meta: {
      requiresAuth: true,
      role: "student"
    }
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/demandas",
    component: Demandas,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/docs",
    component: SwaggerPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  if (to.meta.requiresAuth && !token) {
    return "/login"
  }

  if (to.meta.role && user.role !== to.meta.role) {
    return "/" 
  }

  return true 
})

export default router