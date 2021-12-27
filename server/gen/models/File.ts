import { Schema, Model, Types, model } from 'mongoose'
import { FileModel } from '../model-types'
export { Types } from 'mongoose'


export const fileSchema: Schema = new Schema(
    {
        		name: {type: Schema.Types.String, required: function () { 
                // Mongoose required string can't be a empty
                // but GraphQL required string can be a empty
                // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
                return !(typeof this?.name === 'string') 
            }},
		publicKey: {type: Schema.Types.String, required: function () { 
                // Mongoose required string can't be a empty
                // but GraphQL required string can be a empty
                // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
                return !(typeof this?.publicKey === 'string') 
            }, unique: true},
		type: {type: Schema.Types.String, required: function () { 
                // Mongoose required string can't be a empty
                // but GraphQL required string can be a empty
                // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
                return !(typeof this?.type === 'string') 
            }, default: 'text/plain'},
		size: {type: Schema.Types.Number, required: true},
		user: {type: Schema.Types.ObjectId, ref: 'server_User', index: true},
__path: { type: Schema.Types.String, required: true, index: true},

    },
    {
        timestamps: true,
        usePushEach: true,
        versionKey: false,
    },
)



fileSchema.set('toJSON', {
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


        export const fileModel: Model<FileModel> = model<FileModel>(
            'server_File', fileSchema
        );
