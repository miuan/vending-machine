import { Schema, Model, Types, model } from 'mongoose'
import { UserModel } from '../model-types'
export { Types } from 'mongoose'


export const userSchema: Schema = new Schema(
    {
        		username: {type: Schema.Types.String},
		deposit: {type: Schema.Types.Number, default: 0},
		email: {type: Schema.Types.String, required: function () { 
                // Mongoose required string can't be a empty
                // but GraphQL required string can be a empty
                // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
                return !(typeof this?.email === 'string') 
            }, unique: true},
		password: {type: Schema.Types.String, required: function () { 
                // Mongoose required string can't be a empty
                // but GraphQL required string can be a empty
                // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
                return !(typeof this?.password === 'string') 
            }, default: '*****'},
		verified: {type: Schema.Types.Boolean},
		roles: {type: [Schema.Types.ObjectId], ref: 'server_UserRole', index: true},
		files: {type: [Schema.Types.ObjectId], ref: 'server_File', index: true},
		_product: {type: [Schema.Types.ObjectId], ref: 'server_Product', index: true},
__token: { type: Schema.Types.String, required: false},
__refreshToken: { type: Schema.Types.String, required: false},
__verifyToken: { type: Schema.Types.String, required: false},
__password: { type: Schema.Types.String, required: true},
__resetPasswordToken: { type: Schema.Types.String},
__parent_access_token: { type: Schema.Types.String},

    },
    {
        timestamps: true,
        usePushEach: true,
        versionKey: false,
    },
)


  userSchema.index(
    { __resetPasswordToken: 1 },
    { unique: true, partialFilterExpression: { __resetPasswordToken: { $exists: true } } }
  )
  userSchema.index(
    { __verifyToken: 1 },
    { unique: true, partialFilterExpression: { __verifyToken: { $exists: true } } }
  )
  userSchema.path('email').validate((email) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,64})?$/.test(email), 'The e-mail is not in correct format.')


userSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id

        // remove hidden fields __
        for (const key in ret) {
            if (key.startsWith('__')) {
                delete ret[key]
            }
        }
    },
})


        export const userModel: Model<UserModel> = model<UserModel>(
            'server_User', userSchema
        );
