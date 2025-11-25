import { Navigate, useRoutes } from "react-router-dom"

import Login from "@/pages/top-menu/login/login.page"
import Register from "@/pages/top-menu/register/register.page"

import Home from "@/pages/home/home.page"
import WithAuth from "./with-auth.component"
import PopupList from "@/pages/sidebar-menu/popup/popup-list.page"
import Popup from "@/pages/sidebar-menu/popup/popup.page"
import MainPageProductList from "@/pages/sidebar-menu/mainpage-product/mainpage-product-list.page"
import MainPageProduct from "@/pages/sidebar-menu/mainpage-product/mainpage-product.page"
import SlotManagement from "@/pages/sidebar-menu/reservation/slot-management.page"
import ReservationList from "@/pages/sidebar-menu/reservation/reservation-list.page"
import CrmOrderManagement from "@/pages/sidebar-menu/reservation/crm-order-management.page"
import ProductCategoryList from "@/pages/sidebar-menu/product/product-category-list.page"
import ProductListPage from "@/pages/sidebar-menu/product/product-list.page"
import ProductDetailListPage from "@/pages/sidebar-menu/product/product-detail-list.page"
import CrmCategory from "@/pages/sidebar-menu/reservation/crm-category.page"
import LanguageCrmCategory from "@/pages/sidebar-menu/reservation/lang-crm-category.page"
import SavedProductListPage from "@/pages/sidebar-menu/product/saved-product-list.page"
import EventCategoryListPage from "@/pages/sidebar-menu/event/event-category-list.page"
import EventListPage from "@/pages/sidebar-menu/event/event-list.page"
import SavedEventListPage from "@/pages/sidebar-menu/event/saved-event-list.page"
import KeywordsList from "@/pages/sidebar-menu/keywords/keywords-list.page"
import StaffsList from "@/pages/sidebar-menu/staffs/staffs-list.page"
import Staffs from "@/pages/sidebar-menu/staffs/staffs.page"
import EquipmentsList from "@/pages/sidebar-menu/equipments/equipments-list.page"
import Equipments from "@/pages/sidebar-menu/equipments/equipments.page"
import AccountsList from "@/pages/sidebar-menu/accounts/accounts-list.page"
import Accounts from "@/pages/sidebar-menu/accounts/accounts.page"
import AccountsChangePassword from "@/pages/sidebar-menu/accounts/accounts-change-password.page"
import PopularProductList from "@/pages/sidebar-menu/popular-product/popular-product-list.page"
import PopularProductPage from "@/pages/sidebar-menu/popular-product/popular-product.page"
import CelebPicturesList from "@/pages/sidebar-menu/celeb-pictures/celeb-pictures-list.page"
import CelebPicturesPage from "@/pages/sidebar-menu/celeb-pictures/celeb-pictures.page"
import MostPopularCategoryListPage from "@/pages/sidebar-menu/most-popular/category/most-popular-category-list.page"
import MostPopularCategoryDetailPage from "@/pages/sidebar-menu/most-popular/category/most-popular-category-detail.page"
import MostPopularItemCreatePage from "@/pages/sidebar-menu/most-popular/item/most-popular-item-create.page"
import MostPopularItemEditPage from "@/pages/sidebar-menu/most-popular/item/most-popular-item-edit.page"

function RootRoutes() {
  const renderRoutes = useRoutes([
    {
      path: "/",
      element: (
        <WithAuth>
          <Home />
        </WithAuth>
      ),
      children: [
        {
          path: "/",
          element: <></>,
        },
        {
          path: "/popups",
          element: <PopupList />,
        },
        {
          path: "/popups/new",
          element: <Popup />,
        },
        {
          path: "/popups/:id",
          element: <Popup />,
        },
        {
          path: "/mainpage-products",
          element: <MainPageProductList />,
        },
        {
          path: "/mainpage-products/new",
          element: <MainPageProduct />,
        },
        {
          path: "/mainpage-products/:id",
          element: <MainPageProduct />,
        },
        {
          path: "/popular-products",
          element: <PopularProductList />,
        },
        {
          path: "/popular-products/new",
          element: <PopularProductPage />,
        },
        {
          path: "/popular-products/:id",
          element: <PopularProductPage />,
        },
        {
          path: "/most-popular",
          element: <MostPopularCategoryListPage />,
        },
        {
          path: "/most-popular/new",
          element: <MostPopularCategoryDetailPage />,
        },
        {
          path: "/most-popular/:id",
          element: <MostPopularCategoryDetailPage />,
        },
        {
          path: "/most-popular/:id/items/new",
          element: <MostPopularItemCreatePage />,
        },
        {
          path: "/most-popular/items/:itemId",
          element: <MostPopularItemEditPage />,
        },
        {
          path: "/staffs",
          element: <StaffsList />,
        },
        {
          path: "/staffs/new",
          element: <Staffs />,
        },
        {
          path: "/staffs/:id",
          element: <Staffs />,
        },
        {
          path: "/equipments",
          element: <EquipmentsList />,
        },
        {
          path: "/equipments/new",
          element: <Equipments />,
        },
        {
          path: "/equipments/:id",
          element: <Equipments />,
        },
        {
          path: "/keywords",
          element: <KeywordsList />,
        },
        {
          path: "/accounts",
          element: <AccountsList />,
        },
        {
          path: "/accounts/new",
          element: <Accounts />,
        },
        {
          path: "/accounts/:id",
          element: <Accounts />,
        },
        {
          path: "/accounts/changepassword/:id",
          element: <AccountsChangePassword />,
        },

        {
          path: "/slot",
          element: <SlotManagement />,
        },

        {
          path: "/reservations",
          element: <ReservationList />,
        },

        {
          path: "/products",
          element: <ProductListPage />,
        },
        {
          path: "/products/backups/:id",
          element: <SavedProductListPage />,
        },

        {
          path: "/product-categories",
          element: <ProductCategoryList />,
        },
        {
          path: "/product-details",
          element: <ProductDetailListPage />,
        },

        {
          path: "/events",
          element: <EventListPage />,
        },
        {
          path: "/events/backups/:id",
          element: <SavedEventListPage />,
        },
        {
          path: "/event-categories",
          element: <EventCategoryListPage />,
        },

        {
          path: "/crm-order",
          element: <CrmOrderManagement />,
        },
        {
          path: "/crm",
          element: <CrmCategory />,
        },
        {
          path: "/lang-crm",
          element: <LanguageCrmCategory />,
        },
      ],
    },

    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/register",
      element: <Register />,
    },

    {
      path: "*",
      element: <Navigate replace to="/" />,
    },
  ])

  return renderRoutes
}

export default RootRoutes
