import { Schema, Model, Types, model } from "mongoose";
import { ProductModel } from "../model-types";
export { Types } from "mongoose";

export const productSchema: Schema = new Schema(
  {
    amountAvailable: { type: Schema.Types.Number, default: 1 },
    cost: { type: Schema.Types.Number, required: true },
    name: {
      type: Schema.Types.String,
      required: function () {
        // Mongoose required string can't be a empty
        // but GraphQL required string can be a empty
        // so make required conditional https://stackoverflow.com/questions/44320745/in-mongoose-how-do-i-require-a-string-field-to-not-be-null-or-undefined-permitt
        return !(typeof this?.name === "string");
      },
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "server_User", index: true },
  },
  {
    timestamps: true,
    usePushEach: true,
    versionKey: false,
  }
);

// productSchema.pre('find', function() {
//   (<any>this)._startTime = Date.now();
// });

// productSchema.post('find', function() {
//   if ((<any>this)._startTime != null) {
//     // console.log('Runtime in MS: ', Date.now() - (<any>this)._startTime);
//   }
// })

// productSchema.pre('findOne', function() {
//   (<any>this)._startTime = Date.now();
// });

// productSchema.post('findOne', function() {
//   if ((<any>this)._startTime != null) {
//     // console.log('Runtime in MS: ', Date.now() - (<any>this)._startTime);
//   }
// })

// productSchema.pre('update', function() {
//   (<any>this)._startTime = Date.now();
// });

// productSchema.post('update', function() {
//   if ((<any>this)._startTime != null) {
//     // console.log('Runtime in MS: ', Date.now() - (<any>this)._startTime);
//   }
// })

// productSchema.post('save', (error, doc, next) => {
//   if (error.name === 'ValidationError') {
//     next(new Error('email must be unique'));
//   } else {
//     next(error);
//   }
//   })

export const productModel: Model<ProductModel> = model<ProductModel>("server_Product", productSchema);
