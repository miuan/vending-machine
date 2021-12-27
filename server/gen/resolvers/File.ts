import * as extras from '../extras'
import { UnauthorizedError, RequestError } from '../api-utils'

export const fileAll = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeFileAll']) {
            await entry.hooks.resolvers['beforeFileAll'](entry, { root, data, ctx })
        }

        let models = await entry.services['file'].all(data, ctx.userId)
        models = models.map((m) => {
            m.id = m._id
            return m
        })

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterFileAll']) {
            models = await entry.hooks.resolvers['afterFileAll'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const fileCount = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin'])) ){
        throw new UnauthorizedError()
      }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeFileCount']) {
            await entry.hooks.resolvers['beforeFileCount'](entry, { root, data, ctx })
        }

        let models = await entry.services['file'].count(data, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterFileCount']) {
            models = await entry.hooks.resolvers['afterFileCount'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const fileOne = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.owner(ctx, data, 'user')) ){
        throw new UnauthorizedError()
      }
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeFileOne']) {
            await entry.hooks.resolvers['beforeFileOne'](entry, { root, data, ctx })
        }
        let model = await entry.services['file'].one(data.id)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterFileOne']) {
            model = await entry.hooks.resolvers['afterFileOne'](entry, { id: data.id, model, entry, root, data, ctx })
        }

        return model
    }
}

export const fileCreate = (entry, protections) => {
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

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeFileCreate']) {
            data = await entry.hooks.resolvers['beforeFileCreate'](entry, { root, data, ctx })
        }

        const userId = ctx.state?.user?.id
        
        let createdModel = await entry.services['file'].create(data, userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterFileCreate']) {
            createdModel = await entry.hooks.resolvers['afterFileCreate'](entry, { root, data, ctx, createdModel })
        }

        return createdModel
    }
}

export const fileUpdate = (entry, protections) => {
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

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeFileUpdate']) {
            data = await entry.hooks.resolvers['beforeFileUpdate'](entry, { root, data, ctx })
        }

        let updatedModel = await entry.services['file'].update(data, null, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterFileUpdate']) {
            updatedModel = await entry.hooks.resolvers['afterFileUpdate'](entry, { root, data, ctx, updatedModel, id: data.id })
        }

        return updatedModel
    }
}

export const fileRemove = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.owner(ctx, data, 'user')) ){
        throw new UnauthorizedError()
      }
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeFileRemove']) {
            await entry.hooks.resolvers['beforeFileRemove'](entry, { root, data, ctx })
        }

        let removedModel = await entry.services['file'].remove(data.id, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterFileRemove']) {
            removedModel = await entry.hooks.resolvers['afterFileRemove'](entry, { removedModel, root, data, ctx })
        }

        return removedModel
    }
}



export const generateFileResolver = (entry) => {
    const protections = extras.generateProtections(entry, 'file')
    return {
        all: fileAll(entry, protections),
        count: fileCount(entry, protections),
        one: fileOne(entry, protections),
        create: fileCreate(entry, protections),
        update: fileUpdate(entry, protections),
        remove: fileRemove(entry, protections),
        
    }
}
