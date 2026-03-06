// export interface Product {
//   _id: string
//   title: string
//   description?: string
//   price: number
//   slug: string
//   thumbnail?: string

//   likesCount?: number
//   favoritesCount?: number
//   viewsCount?: number

//   liked?: boolean
//   saved?: boolean

//   createdBy?: {
//     username: string
//   }
// }







export type ProductStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

//////////////////////////////////////////////////////
// DB PRODUCT TYPE (matches mongoose schema)
//////////////////////////////////////////////////////

export interface ProductDB {

  _id: string

  title: string
  slug: string
  description: string
  price: number
  thumbnail?: string

  createdBy: string

  status: ProductStatus
  rejectionReason?: string | null

  likesCount: number
  favoritesCount: number
  commentsCount: number
  viewsCount: number

  isDeleted: boolean
  deletedAt?: Date

  createdAt: string
  updatedAt: string
}

//////////////////////////////////////////////////////
// PUBLIC PRODUCT (used by marketplace UI)
//////////////////////////////////////////////////////

export interface Product {

  _id: string

  title: string
  slug: string
  description: string
  price: number
  thumbnail?: string

  likesCount?: number
  favoritesCount?: number
  viewsCount?: number

  liked?: boolean
  saved?: boolean

  createdBy?: {
    username: string
  }

}

//////////////////////////////////////////////////////
// DASHBOARD PRODUCT (creator panel)
//////////////////////////////////////////////////////

export interface DashboardProduct {

  _id: string

  title: string
  description: string
  price: number

  status: ProductStatus
  rejectionReason?: string

}






