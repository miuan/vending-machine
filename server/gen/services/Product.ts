/* eslint-disable prettier/prettier */
import { productModel, Types } from '../models/Product'
import * as extras from '../extras'

export const productAll = (entry) => {
    return async (data) => {
        if (entry.hooks && entry.hooks.services['beforeProductAll']) {
            await entry.hooks.services['beforeProductAll'](entry, data)
        }

        const filter = extras.filterGen(data.filter)
        let findPromise = productModel.find(filter)
        if (data.skip) findPromise = findPromise.skip(data.skip)
        if (data.limit) findPromise = findPromise.limit(data.limit)
        if (data.orderBy) {
            const {
                groups: { field, type },
            } = data.orderBy.match(/(?<field>\w+)_(?<type>(asc|desc))/)
            findPromise = findPromise.sort([[field, type]])
        }

        let models = await findPromise.lean()

        if (entry.hooks && entry.hooks.services['afterProductAll']) {
            models = await entry.hooks.services['afterProductAll'](entry, { models, ...data })
        }
        return models
    }
}

export const productCount = (entry) => {
    return async (data) => {
        if (entry.hooks && entry.hooks.services['beforeProductCount']) {
            await entry.hooks.services['beforeProductCount'](entry, data)
        }

        const filter = extras.filterGen(data.filter)
        let countPromise = productModel.count(filter)

        let count = await countPromise.lean()

        if (entry.hooks && entry.hooks.services['afterProductCount']) {
            count = await entry.hooks.services['afterProductCount'](entry, { count, ...data })
        }
        return count
    }
}

export const productOne = (entry) => {
    return async (id, userId = null) => {
        if (entry.hooks && entry.hooks.services['beforeProductOne']) {
            await entry.hooks.services['beforeProductOne'](entry, { id })
        }
        let model = await productModel.findById(id).lean()
        model.id = id

        if (entry.hooks && entry.hooks.services['afterProductOne']) {
            model = await entry.hooks.services['afterProductOne'](entry, { id, model })
        }

        return model
    }
}

export const productCreate = (entry) => {
    return async (data, ctxUserId = null) => {
        // before real object exist
        // we generate TEMPORARY-ID for related objects what they have a required relation...
        const id = Types.ObjectId()

        
            const userLinkedIds = []
            
              // templates/service-transform-one-id.ts
  // case where data.user have multiple ids or multiple object
  if (data.userId) {
    userLinkedIds.push(data.userId);
    data.user = data.userId
  } 

            
      
        if (entry.hooks && entry.hooks.services['beforeProductCreate']) {
            data = await entry.hooks.services['beforeProductCreate'](entry, { data, ctxUserId })
        }
        
        let createdModel = await productModel.create(data)

        
        
    if(userLinkedIds && userLinkedIds.length > 0) {
        await entry.models['user'].updateMany({ _id: {$in: userLinkedIds} }, {  $push: {_product: { $each: [createdModel.id]}} })
      }
        if (entry.hooks && entry.hooks.services['afterProductCreate']) {
            createdModel = await entry.hooks.services['afterProductCreate'](entry, {
                id: createdModel._id,
                data: createdModel,
                ctxUserId,
            })
        }
        return createdModel
    }
}

export const productUpdate = (entry) => {
    return async (data, updateproductId = null, ctxUserId = null) => {
        let id = updateproductId

        if (data.id) {
            id = data.id
            delete data.id
        }

        if (entry.hooks && entry.hooks.services['beforeProductUpdate']) {
            data = await entry.hooks.services['beforeProductUpdate'](entry, { data, id, ctxUserId })
        }

        // disconnect all relations
        if( data.userId || data.undefined ){
      // relation is type: RELATION 
      await entry.models['user'].updateMany({_product:{$all: [id]}}, {$pull: {_product: id}})
    }
        
            const userLinkedIds = []
            
              // templates/service-transform-one-id.ts
  // case where data.user have multiple ids or multiple object
  if (data.userId) {
    userLinkedIds.push(data.userId);
    data.user = data.userId
  } 

            
      
        
        let updatedModel = await productModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })

        // connect all relations
        
    if(userLinkedIds && userLinkedIds.length > 0) {
        await entry.models['user'].updateMany({ _id: {$in: userLinkedIds} }, {  $push: {_product: { $each: [updatedModel.id]}} })
      }

        if (entry.hooks && entry.hooks.services['afterProductUpdate']) {
            updatedModel = await entry.hooks.services['afterProductUpdate'](entry, {
                data: updatedModel,
                id,
                ctxUserId,
            })
        }

        return updatedModel
    }
}

export const productRemove = (entry, ctxUserId = null) => {
    return async (id, userId, skipRelations = []) => {
        if (entry.hooks && entry.hooks.services['beforeProductRemove']) {
            await entry.hooks.services['beforeProductRemove'](entry, { id, ctxUserId })
        }

        // disconnect all relations
        if( !skipRelations.includes('user') ){
      // relation is type: RELATION 
      await entry.models['user'].updateMany({_product:{$all: [id]}}, {$pull: {_product: id}})
    }
        
        let removedModel = await productModel.findByIdAndRemove(id)

        if (entry.hooks && entry.hooks.services['afterProductRemove']) {
            removedModel = await entry.hooks.services['afterProductRemove'](entry, {
                data: removedModel,
                id,
                ctxUserId,
            })
        }

        return removedModel
    }
}



export const generateProductService = (entry) => {
    return {
        all: productAll(entry),
        count: productCount(entry),
        one: productOne(entry),
        create: productCreate(entry),
        update: productUpdate(entry),
        remove: productRemove(entry),
        
    }
}
