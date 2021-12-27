import { Document } from 'mongoose'

    // type for model: `File`
    export interface FileModel extends Document {
		updatedAt: Date
		createdAt: Date
		id: string
		name: string
		publicKey: string
		type: string
		size: number
		user: UserModel
		__path?: string,

    }
  
    // type for model: `Product`
    export interface ProductModel extends Document {
		updatedAt: Date
		createdAt: Date
		id: string
		amountAvailable: number
		cost: number
		name: string
		user: UserModel
    }
  
    // type for model: `User`
    export interface UserModel extends Document {
		updatedAt: Date
		createdAt: Date
		id: string
		username: string
		deposit: number
		email: string
		password: string
		verified: Boolean
		roles: UserRoleModel[]
		files: FileModel[]
		_product: ProductModel[]
		__token?: string,

		__refreshToken?: string,

		__verifyToken?: string,

		__password: string,

		__resetPasswordToken: string,

		__parent_access_token: string,

    }
  
    // type for model: `UserRole`
    export interface UserRoleModel extends Document {
		updatedAt: Date
		createdAt: Date
		id: string
		name: string
		users: UserModel[]
    }
  