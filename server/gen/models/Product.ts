import { Schema, Model, Types, model } from 'mongoose'
import { ProductModel } from '../model-types'
export { Types } from 'mongoose'


export const productSchema: Schema = new Schema(
    {
        		amountAvailable: {type: Schema.Types.Number, default: 1},
		cost: {type: Schema.Types.Number, required: true},
		productName: {type: Schema.Types.String, required: function () { 
                // Mongoose required string can't be a empty
                // but GraphQL required string can be a empty
                // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
                return !(typeof this?.productName === 'string') 
            }, unique: true},
		user: {type: Schema.Types.ObjectId, ref: 'server_User', index: true},

    },
    {
        timestamps: true,
        usePushEach: true,
        versionKey: false,
    },
)



productSchema.set('toJSON', {
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


        export const productModel: Model<ProductModel> = model<ProductModel>(
            'server_Product', productSchema
        );
