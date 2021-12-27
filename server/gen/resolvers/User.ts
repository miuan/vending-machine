import * as extras from '../extras'
import { UnauthorizedError, RequestError } from '../api-utils'

export const userAll = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
    if((data.roles || data.rolesIds) && !await protections.role(ctx, ['admin'])){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserAll']) {
            await entry.hooks.resolvers['beforeUserAll'](entry, { root, data, ctx })
        }

        let models = await entry.services['user'].all(data, ctx.userId)
        models = models.map((m) => {
            m.id = m._id
            return m
        })

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserAll']) {
            models = await entry.hooks.resolvers['afterUserAll'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const userCount = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
    if((data.roles || data.rolesIds) && !await protections.role(ctx, ['admin'])){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserCount']) {
            await entry.hooks.resolvers['beforeUserCount'](entry, { root, data, ctx })
        }

        let models = await entry.services['user'].count(data, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserCount']) {
            models = await entry.hooks.resolvers['afterUserCount'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const userOne = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
    if((data.roles || data.rolesIds) && !await protections.role(ctx, ['admin'])){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserOne']) {
            await entry.hooks.resolvers['beforeUserOne'](entry, { root, data, ctx })
        }
        let model = await entry.services['user'].one(data.id)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserOne']) {
            model = await entry.hooks.resolvers['afterUserOne'](entry, { id: data.id, model, entry, root, data, ctx })
        }

        return model
    }
}

export const userCreate = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
    if((data.roles || data.rolesIds) && !await protections.role(ctx, ['admin'])){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  
        const presentProtectedFields = protections.checkDataContainProtectedFields(data)
        if (presentProtectedFields && presentProtectedFields.length) {
            ctx.throw(403, {
                type: 'ReachProtectedFields',
                message: 'Trying to update protected fields, which they are just read only',
                presentProtectedFields,
            })
        }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserCreate']) {
            data = await entry.hooks.resolvers['beforeUserCreate'](entry, { root, data, ctx })
        }

        const userId = ctx.state?.user?.id
        
        let createdModel = await entry.services['user'].create(data, userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserCreate']) {
            createdModel = await entry.hooks.resolvers['afterUserCreate'](entry, { root, data, ctx, createdModel })
        }

        return createdModel
    }
}

export const userUpdate = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
    if((data.roles || data.rolesIds) && !await protections.role(ctx, ['admin'])){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

        // any fields start with double underscore are protected, example __port, __readolny, ...
        const presentProtectedFields = protections.checkDataContainProtectedFields(data)
        if (presentProtectedFields && presentProtectedFields.length) {
            ctx.throw(403, {
                type: 'ReachProtectedFields',
                message: 'Trying to update protected fields, which they are just read only',
                presentProtectedFields,
            })
        }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserUpdate']) {
            data = await entry.hooks.resolvers['beforeUserUpdate'](entry, { root, data, ctx })
        }

        let updatedModel = await entry.services['user'].update(data, null, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserUpdate']) {
            updatedModel = await entry.hooks.resolvers['afterUserUpdate'](entry, { root, data, ctx, updatedModel, id: data.id })
        }

        return updatedModel
    }
}

export const userRemove = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
    if((data.roles || data.rolesIds) && !await protections.role(ctx, ['admin'])){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRemove']) {
            await entry.hooks.resolvers['beforeUserRemove'](entry, { root, data, ctx })
        }

        let removedModel = await entry.services['user'].remove(data.id, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRemove']) {
            removedModel = await entry.hooks.resolvers['afterUserRemove'](entry, { removedModel, root, data, ctx })
        }

        return removedModel
    }
}

export const addRoleToUser = (entry, protections) => {
    return async (root, data, ctx) => {
      
      if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
      if (entry.hooks && entry.hooks.resolvers['beforeaddRoleToUser']) {
       await entry.hooks.resolvers['beforeaddRoleToUser'](entry, { root, data, ctx });
      }
  
      let model = await entry.services['user'].addRoleToUser(data.userId, data.userRoleId);
  
      if (entry.hooks && entry.hooks.resolvers['afteraddRoleToUser']) {
        model = await entry.hooks.resolvers['afteraddRoleToUser'](entry, { model, root, data, ctx });
      }
  
      return model;
    };
  };

  export const removeRoleFromUser = (entry, protections) => {
    return async (root, data, ctx) => {
      
      if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
      
            if(ctx.state?.user?.id == data.userId){
                if(data.userRoleName === 'admin') {
                    throw new Error('Unlinking yourself from admin')
                } else {
                    const role = await entry.models['userRole'].findById(data.userRoleId, 'name').lean()
                    if(role.name === 'admin') {
                        throw new Error('Unlinking yourself from admin')
                    }
                }
            }
        
      
      if (entry.hooks && entry.hooks.resolvers['beforeremoveRoleFromUser']) {
       await entry.hooks.resolvers['beforeremoveRoleFromUser'](entry, { root, data, ctx });
      }
  
      let model = await entry.services['user'].removeRoleFromUser(data.userId, data.userRoleId);
  
      if (entry.hooks && entry.hooks.resolvers['afterremoveRoleFromUser']) {
        model = await entry.hooks.resolvers['afterremoveRoleFromUser'](entry, { model, root, data, ctx });
      }
  
      return model;
    };
  };

export const generateUserResolver = (entry) => {
    const protections = extras.generateProtections(entry, 'user')
    return {
        all: userAll(entry, protections),
        count: userCount(entry, protections),
        one: userOne(entry, protections),
        create: userCreate(entry, protections),
        update: userUpdate(entry, protections),
        remove: userRemove(entry, protections),
        addRoleToUser : addRoleToUser(entry, protections),
removeRoleFromUser : removeRoleFromUser(entry, protections),
    }
}
