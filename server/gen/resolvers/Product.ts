import * as extras from '../extras'
import { UnauthorizedError, RequestError } from '../api-utils'

export const productAll = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin']))&&!(await protections.public()) ){
        throw new UnauthorizedError()
      }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeProductAll']) {
            await entry.hooks.resolvers['beforeProductAll'](entry, { root, data, ctx })
        }

        let models = await entry.services['product'].all(data, ctx.userId)
        models = models.map((m) => {
            m.id = m._id
            return m
        })

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterProductAll']) {
            models = await entry.hooks.resolvers['afterProductAll'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const productCount = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin']))&&!(await protections.public()) ){
        throw new UnauthorizedError()
      }

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeProductCount']) {
            await entry.hooks.resolvers['beforeProductCount'](entry, { root, data, ctx })
        }

        let models = await entry.services['product'].count(data, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterProductCount']) {
            models = await entry.hooks.resolvers['afterProductCount'](entry, { models, root, data, ctx })
        }
        return models
    }
}

export const productOne = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin']))&&!(await protections.owner(ctx, data, 'user')) ){
        throw new UnauthorizedError()
      }
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeProductOne']) {
            await entry.hooks.resolvers['beforeProductOne'](entry, { root, data, ctx })
        }
        let model = await entry.services['product'].one(data.id)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterProductOne']) {
            model = await entry.hooks.resolvers['afterProductOne'](entry, { id: data.id, model, entry, root, data, ctx })
        }

        return model
    }
}

export const productCreate = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin']))&&!(await protections.public()) ){
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

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeProductCreate']) {
            data = await entry.hooks.resolvers['beforeProductCreate'](entry, { root, data, ctx })
        }

        const userId = ctx.state?.user?.id
        if(!data.userId && userId){
        data.userId = userId
      }
        let createdModel = await entry.services['product'].create(data, userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterProductCreate']) {
            createdModel = await entry.hooks.resolvers['afterProductCreate'](entry, { root, data, ctx, createdModel })
        }

        return createdModel
    }
}

export const productUpdate = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin']))&&!(await protections.owner(ctx, data, 'user')) ){
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

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeProductUpdate']) {
            data = await entry.hooks.resolvers['beforeProductUpdate'](entry, { root, data, ctx })
        }

        let updatedModel = await entry.services['product'].update(data, null, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterProductUpdate']) {
            updatedModel = await entry.hooks.resolvers['afterProductUpdate'](entry, { root, data, ctx, updatedModel, id: data.id })
        }

        return updatedModel
    }
}

export const productRemove = (entry, protections) => {
    return async (root, data, ctx) => {
        if( !(await protections.role(ctx, ['admin']))&&!(await protections.owner(ctx, data, 'user')) ){
        throw new UnauthorizedError()
      }
        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['beforeProductRemove']) {
            await entry.hooks.resolvers['beforeProductRemove'](entry, { root, data, ctx })
        }

        let removedModel = await entry.services['product'].remove(data.id, ctx.userId)

        if (entry.hooks && entry.hooks.resolvers && entry.hooks.resolvers['afterProductRemove']) {
            removedModel = await entry.hooks.resolvers['afterProductRemove'](entry, { removedModel, root, data, ctx })
        }

        return removedModel
    }
}



export const generateProductResolver = (entry) => {
    const protections = extras.generateProtections(entry, 'product')
    return {
        all: productAll(entry, protections),
        count: productCount(entry, protections),
        one: productOne(entry, protections),
        create: productCreate(entry, protections),
        update: productUpdate(entry, protections),
        remove: productRemove(entry, protections),
        
    }
}
