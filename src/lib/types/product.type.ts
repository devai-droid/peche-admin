import { Product, ProductBackup, ProductCategory, ProductDetailPage } from "../orval/model"

export interface ExtendedProduct extends Omit<Product, "detailPage" | "category"> {
  visible: boolean
  visibleEN: boolean
  visibleZH: boolean
  visibleZHTW: boolean
  visibleJA: boolean
  visibleTH: boolean
  detailPageId?: string
  integratedCrmCategoryId?: string
  detailPage?: ExtendedProductDetail
  category?: ProductCategory
}

export interface ExtendedProductBackup extends ProductBackup {
  visible: boolean
  visibleEN: boolean
  visibleZH: boolean
  visibleZHTW: boolean
  visibleJA: boolean
  visibleTH: boolean
  detailPageId?: string
  integratedCrmCategoryId?: string
}

export interface ExtendedProductDetail extends Omit<ProductDetailPage, "relatedDetailPages"> {
  relatedDetailPages: {
    createdAt: string
    id: string
    relatedProductDetailPage: ProductDetailPage
  }[]
}

export interface ExtendedProductCategory extends Omit<ProductCategory, "detailPages"> {
  detailPages: ProductDetailPage[]
}
