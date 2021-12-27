/* eslint-disable prettier/prettier */
import { fileModel, Types } from '../models/File'
import * as extras from '../extras'

export const fileAll = (entry) => {
    return async (data) => {
        if (entry.hooks && entry.hooks.services['beforeFileAll']) {
            await entry.hooks.services['beforeFileAll'](entry, data)
        }

        const filter = extras.filterGen(data.filter)
        let findPromise = fileModel.find(filter)
        if (data.skip) findPromise = findPromise.skip(data.skip)
        if (data.limit) findPromise = findPromise.limit(data.limit)
        if (data.orderBy) {
            const {
                groups: { field, type },
            } = data.orderBy.match(/(?<field>\w+)_(?<type>(asc|desc))/)
            findPromise = findPromise.sort([[field, type]])
        }

        let models = await findPromise.lean()

        if (entry.hooks && entry.hooks.services['afterFileAll']) {
            models = await entry.hooks.services['afterFileAll'](entry, { models, ...data })
        }
        return models
    }
}

export const fileCount = (entry) => {
    return async (data) => {
        if (entry.hooks && entry.hooks.services['beforeFileCount']) {
            await entry.hooks.services['beforeFileCount'](entry, data)
        }

        const filter = extras.filterGen(data.filter)
        let countPromise = fileModel.count(filter)

        let count = await countPromise.lean()

        if (entry.hooks && entry.hooks.services['afterFileCount']) {
            count = await entry.hooks.services['afterFileCount'](entry, { count, ...data })
        }
        return count
    }
}

export const fileOne = (entry) => {
    return async (id, userId = null) => {
        if (entry.hooks && entry.hooks.services['beforeFileOne']) {
            await entry.hooks.services['beforeFileOne'](entry, { id })
        }
        let model = await fileModel.findById(id).lean()
        model.id = id

        if (entry.hooks && entry.hooks.services['afterFileOne']) {
            model = await entry.hooks.services['afterFileOne'](entry, { id, model })
        }

        return model
    }
}

export const fileCreate = (entry) => {
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

            
      
        if (entry.hooks && entry.hooks.services['beforeFileCreate']) {
            data = await entry.hooks.services['beforeFileCreate'](entry, { data, ctxUserId })
        }
        if (data.data) await entry.storage.saveDataToFile(null, data)
        let createdModel = await fileModel.create(data)

        
        
    if(userLinkedIds && userLinkedIds.length > 0) {
        await entry.models['user'].updateMany({ _id: {$in: userLinkedIds} }, {  $push: {files: { $each: [createdModel.id]}} })
      }
        if (entry.hooks && entry.hooks.services['afterFileCreate']) {
            createdModel = await entry.hooks.services['afterFileCreate'](entry, {
                id: createdModel._id,
                data: createdModel,
                ctxUserId,
            })
        }
        return createdModel
    }
}

export const fileUpdate = (entry) => {
    return async (data, updatefileId = null, ctxUserId = null) => {
        let id = updatefileId

        if (data.id) {
            id = data.id
            delete data.id
        }

        if (entry.hooks && entry.hooks.services['beforeFileUpdate']) {
            data = await entry.hooks.services['beforeFileUpdate'](entry, { data, id, ctxUserId })
        }

        // disconnect all relations
        if( data.userId || data.undefined ){
      // relation is type: RELATION 
      await entry.models['user'].updateMany({files:{$all: [id]}}, {$pull: {files: id}})
    }
        
            const userLinkedIds = []
            
              // templates/service-transform-one-id.ts
  // case where data.user have multiple ids or multiple object
  if (data.userId) {
    userLinkedIds.push(data.userId);
    data.user = data.userId
  } 

            
      
        if (data.data) await entry.storage.saveDataToFile(id, data)
        let updatedModel = await fileModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })

        // connect all relations
        
    if(userLinkedIds && userLinkedIds.length > 0) {
        await entry.models['user'].updateMany({ _id: {$in: userLinkedIds} }, {  $push: {files: { $each: [updatedModel.id]}} })
      }

        if (entry.hooks && entry.hooks.services['afterFileUpdate']) {
            updatedModel = await entry.hooks.services['afterFileUpdate'](entry, {
                data: updatedModel,
                id,
                ctxUserId,
            })
        }

        return updatedModel
    }
}

export const fileRemove = (entry, ctxUserId = null) => {
    return async (id, userId, skipRelations = []) => {
        if (entry.hooks && entry.hooks.services['beforeFileRemove']) {
            await entry.hooks.services['beforeFileRemove'](entry, { id, ctxUserId })
        }

        // disconnect all relations
        if( !skipRelations.includes('user') ){
      // relation is type: RELATION 
      await entry.models['user'].updateMany({files:{$all: [id]}}, {$pull: {files: id}})
    }
        await entry.storage.unlinkFile(id)
        let removedModel = await fileModel.findByIdAndRemove(id)

        if (entry.hooks && entry.hooks.services['afterFileRemove']) {
            removedModel = await entry.hooks.services['afterFileRemove'](entry, {
                data: removedModel,
                id,
                ctxUserId,
            })
        }

        return removedModel
    }
}



export const generateFileService = (entry) => {
    return {
        all: fileAll(entry),
        count: fileCount(entry),
        one: fileOne(entry),
        create: fileCreate(entry),
        update: fileUpdate(entry),
        remove: fileRemove(entry),
        
    }
}
