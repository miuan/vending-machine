/* eslint-disable prettier/prettier */
import { userRoleModel, Types } from '../models/UserRole'
import * as extras from '../extras'

export const userRoleAll = (entry) => {
    return async (data) => {
        if (entry.hooks && entry.hooks.services['beforeUserRoleAll']) {
            await entry.hooks.services['beforeUserRoleAll'](entry, data)
        }

        const filter = extras.filterGen(data.filter)
        let findPromise = userRoleModel.find(filter)
        if (data.skip) findPromise = findPromise.skip(data.skip)
        if (data.limit) findPromise = findPromise.limit(data.limit)
        if (data.orderBy) {
            const {
                groups: { field, type },
            } = data.orderBy.match(/(?<field>\w+)_(?<type>(asc|desc))/)
            findPromise = findPromise.sort([[field, type]])
        }

        let models = await findPromise.lean()

        if (entry.hooks && entry.hooks.services['afterUserRoleAll']) {
            models = await entry.hooks.services['afterUserRoleAll'](entry, { models, ...data })
        }
        return models
    }
}

export const userRoleCount = (entry) => {
    return async (data) => {
        if (entry.hooks && entry.hooks.services['beforeUserRoleCount']) {
            await entry.hooks.services['beforeUserRoleCount'](entry, data)
        }

        const filter = extras.filterGen(data.filter)
        let countPromise = userRoleModel.count(filter)

        let count = await countPromise.lean()

        if (entry.hooks && entry.hooks.services['afterUserRoleCount']) {
            count = await entry.hooks.services['afterUserRoleCount'](entry, { count, ...data })
        }
        return count
    }
}

export const userRoleOne = (entry) => {
    return async (id, userId = null) => {
        if (entry.hooks && entry.hooks.services['beforeUserRoleOne']) {
            await entry.hooks.services['beforeUserRoleOne'](entry, { id })
        }
        let model = await userRoleModel.findById(id).lean()
        model.id = id

        if (entry.hooks && entry.hooks.services['afterUserRoleOne']) {
            model = await entry.hooks.services['afterUserRoleOne'](entry, { id, model })
        }

        return model
    }
}

export const userRoleCreate = (entry) => {
    return async (data, ctxUserId = null) => {
        // before real object exist
        // we generate TEMPORARY-ID for related objects what they have a required relation...
        const id = Types.ObjectId()

        
            const usersLinkedIds = []
            
             // templates/service-transform-many-ids.ts
 // case where data.users have many ids or many objects
  if (data.users) {
    const idsOfCreated = []
    for(const createdFrom of data.users){
      // the related member is NOT required so we will update later with REAL-ID
		// createdFrom.rolesIds = [id]
      const created = await entry.services['user'].create(createdFrom);
      idsOfCreated.push(created.id)
      // backward relation is not setup yet, so need update later with REAL-ID
		 usersLinkedIds.push(created.id)
    }
    data.users = idsOfCreated
  }

  if (data.usersIds) {
    if(data.users && data.users.length > 0) data.users.push(...data.usersIds)
    else data.users = data.usersIds
    usersLinkedIds.push(...data.usersIds)
  }
  
            
      
        if (entry.hooks && entry.hooks.services['beforeUserRoleCreate']) {
            data = await entry.hooks.services['beforeUserRoleCreate'](entry, { data, ctxUserId })
        }
        
        let createdModel = await userRoleModel.create(data)

        
        
    if(usersLinkedIds && usersLinkedIds.length > 0) {
        await entry.models['user'].updateMany({ _id: {$in: usersLinkedIds} }, {  $push: {roles: { $each: [createdModel.id]}} })
      }
        if (entry.hooks && entry.hooks.services['afterUserRoleCreate']) {
            createdModel = await entry.hooks.services['afterUserRoleCreate'](entry, {
                id: createdModel._id,
                data: createdModel,
                ctxUserId,
            })
        }
        return createdModel
    }
}

export const userRoleUpdate = (entry) => {
    return async (data, updateuserRoleId = null, ctxUserId = null) => {
        let id = updateuserRoleId

        if (data.id) {
            id = data.id
            delete data.id
        }

        if (entry.hooks && entry.hooks.services['beforeUserRoleUpdate']) {
            data = await entry.hooks.services['beforeUserRoleUpdate'](entry, { data, id, ctxUserId })
        }

        // disconnect all relations
        if( (data.usersIds && data.usersIds.length > 0) || (data.users && data.users.length > 0) ){
      // relation is type: RELATION 
      await entry.models['user'].updateMany({roles:{$all: [id]}}, {$pull: {roles: id}})
    }
        
            const usersLinkedIds = []
            
             // templates/service-transform-many-ids.ts
 // case where data.users have many ids or many objects
  if (data.users) {
    const idsOfCreated = []
    for(const createdFrom of data.users){
      createdFrom.rolesIds = [id]
      const created = await entry.services['user'].create(createdFrom);
      idsOfCreated.push(created.id)
      // backward relation is already setup, so no need any update aditional
		// usersLinkedIds.push(created.id)
    }
    data.users = idsOfCreated
  }

  if (data.usersIds) {
    if(data.users && data.users.length > 0) data.users.push(...data.usersIds)
    else data.users = data.usersIds
    usersLinkedIds.push(...data.usersIds)
  }
  
            
      
        
        let updatedModel = await userRoleModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })

        // connect all relations
        
    if(usersLinkedIds && usersLinkedIds.length > 0) {
        await entry.models['user'].updateMany({ _id: {$in: usersLinkedIds} }, {  $push: {roles: { $each: [updatedModel.id]}} })
      }

        if (entry.hooks && entry.hooks.services['afterUserRoleUpdate']) {
            updatedModel = await entry.hooks.services['afterUserRoleUpdate'](entry, {
                data: updatedModel,
                id,
                ctxUserId,
            })
        }

        return updatedModel
    }
}

export const userRoleRemove = (entry, ctxUserId = null) => {
    return async (id, userId, skipRelations = []) => {
        if (entry.hooks && entry.hooks.services['beforeUserRoleRemove']) {
            await entry.hooks.services['beforeUserRoleRemove'](entry, { id, ctxUserId })
        }

        // disconnect all relations
        if( !skipRelations.includes('user') ){
      // relation is type: RELATION 
      await entry.models['user'].updateMany({roles:{$all: [id]}}, {$pull: {roles: id}})
    }
        
        let removedModel = await userRoleModel.findByIdAndRemove(id)

        if (entry.hooks && entry.hooks.services['afterUserRoleRemove']) {
            removedModel = await entry.hooks.services['afterUserRoleRemove'](entry, {
                data: removedModel,
                id,
                ctxUserId,
            })
        }

        return removedModel
    }
}



export const generateUserRoleService = (entry) => {
    return {
        all: userRoleAll(entry),
        count: userRoleCount(entry),
        one: userRoleOne(entry),
        create: userRoleCreate(entry),
        update: userRoleUpdate(entry),
        remove: userRoleRemove(entry),
        
    }
}
