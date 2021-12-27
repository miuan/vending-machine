import * as extras from '../extras'
import { UnauthorizedError, RequestError } from '../api-utils'

export const userRoleAll = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRoleAll']) {
            await entry.hooks.resolvers['beforeUserRoleAll'](entry, { root, data, ctx })
        }

        let models = await entry.services['userRole'].all(data, ctx.userId)
        models = models.map((m) => {
            m.id = m._id
            return m
        })

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRoleAll']) {
            models = await entry.hooks.resolvers['afterUserRoleAll'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const userRoleCount = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRoleCount']) {
            await entry.hooks.resolvers['beforeUserRoleCount'](entry, { root, data, ctx })
        }

        let models = await entry.services['userRole'].count(data, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRoleCount']) {
            models = await entry.hooks.resolvers['afterUserRoleCount'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const userRoleOne = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRoleOne']) {
            await entry.hooks.resolvers['beforeUserRoleOne'](entry, { root, data, ctx })
        }
        let model = await entry.services['userRole'].one(data.id)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRoleOne']) {
            model = await entry.hooks.resolvers['afterUserRoleOne'](entry, { id: data.id, model, entry, root, data, ctx })
        }

        return model
    }
}

export const userRoleCreate = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
        const presentProtectedFields = protections.checkDataContainProtectedFields(data)
        if (presentProtectedFields && presentProtectedFields.length) {
            ctx.throw(403, {
                type: 'ReachProtectedFields',
                message: 'Trying to update protected fields, which they are just read only',
                presentProtectedFields,
            })
        }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRoleCreate']) {
            data = await entry.hooks.resolvers['beforeUserRoleCreate'](entry, { root, data, ctx })
        }

        const userId = ctx.state?.user?.id
        
        let createdModel = await entry.services['userRole'].create(data, userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRoleCreate']) {
            createdModel = await entry.hooks.resolvers['afterUserRoleCreate'](entry, { root, data, ctx, createdModel })
        }

        return createdModel
    }
}

export const userRoleUpdate = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
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

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRoleUpdate']) {
            data = await entry.hooks.resolvers['beforeUserRoleUpdate'](entry, { root, data, ctx })
        }

        let updatedModel = await entry.services['userRole'].update(data, null, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRoleUpdate']) {
            updatedModel = await entry.hooks.resolvers['afterUserRoleUpdate'](entry, { root, data, ctx, updatedModel, id: data.id })
        }

        return updatedModel
    }
}

export const userRoleRemove = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeUserRoleRemove']) {
            await entry.hooks.resolvers['beforeUserRoleRemove'](entry, { root, data, ctx })
        }

        let removedModel = await entry.services['userRole'].remove(data.id, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterUserRoleRemove']) {
            removedModel = await entry.hooks.resolvers['afterUserRoleRemove'](entry, { removedModel, root, data, ctx })
        }

        return removedModel
    }
}



export const generateUserRoleResolver = (entry) => {
    const protections = extras.generateProtections(entry, 'userRole')
    return {
        all: userRoleAll(entry, protections),
        count: userRoleCount(entry, protections),
        one: userRoleOne(entry, protections),
        create: userRoleCreate(entry, protections),
        update: userRoleUpdate(entry, protections),
        remove: userRoleRemove(entry, protections),
        
    }
}
