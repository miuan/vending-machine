import * as JSON5 from 'json5'
import { apiMiddleware, userIsOwner, userHaveRoles, paramHaveFilter, RequestError, UnauthorizedError } from '../api-utils'

const createUser = (entry) => async (ctx) => {
    let body = ctx.request.body

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }
    if(body.roles && !await userHaveRoles(ctx, ['admin'], entry.models.userRole)){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

    if (entry.hooks.api['beforeCreateUser']) {
        body = (await entry.hooks.api['beforeCreateUser'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['user'].create(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterCreateUser']) {
        resData = (await entry.hooks.api['afterCreateUser'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'createUser')
}

const updateUser = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }
    if(body.roles && !await userHaveRoles(ctx, ['admin'], entry.models.userRole)){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

    if (entry.hooks.api['beforeUpdateUser']) {
        body = (await entry.hooks.api['beforeUpdateUser'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['user'].update(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterUpdateUser']) {
        resData = (await entry.hooks.api['afterUpdateUser'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'updateUser')
}

const removeUser = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }
    if(body.roles && !await userHaveRoles(ctx, ['admin'], entry.models.userRole)){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

    if (entry.hooks.api['beforeRemoveUser']) {
        body = (await entry.hooks.api['beforeRemoveUser'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['user'].remove(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterRemoveUser']) {
        resData = (await entry.hooks.api['afterRemoveUser'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'removeUser')
}

const oneUser = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }
    if(body.roles && !await userHaveRoles(ctx, ['admin'], entry.models.userRole)){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

    if (entry.hooks.api['beforeOneUser']) {
        body = (await entry.hooks.api['beforeOneUser'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['user'].one(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterOneUser']) {
        resData = (await entry.hooks.api['afterOneUser'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'user')
}

const allUser = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }
    if(body.roles && !await userHaveRoles(ctx, ['admin'], entry.models.userRole)){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

    if (entry.hooks.api['beforeAllUser']) {
        body = (await entry.hooks.api['beforeAllUser'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['user'].all(ctx.params, ctx.state?.user?.id)
    resData = resData.map((m) => {
        m.id = m._id
        delete m._id
        return m
    })

    if (entry.hooks.api['afterAllUser']) {
        resData = (await entry.hooks.api['afterAllUser'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'allUser')
}

const countUser = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }
    if(body.roles && !await userHaveRoles(ctx, ['admin'], entry.models.userRole)){
        throw new RequestError('Unauthorized user:roles operation', 401)
    }
  

    if (entry.hooks.api['beforeAllUser']) {
        body = (await entry.hooks.api['beforeAllUser'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    const query = ctx.request.query
    if (query.filter) {
        query.filter = JSON5.parse(query.filter)
    }
    let resData = await entry.services['user'].count(query, ctx.state?.user?.id)

    if (entry.hooks.api['afterAllUser']) {
        resData = (await entry.hooks.api['afterAllUser'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'countUser')
}

export function connectUserApi(apiRouter, entry) {
    apiRouter.post('/user', createUser(entry))
    apiRouter.put('/user/:id', updateUser(entry))
    apiRouter.delete('/user/:id', removeUser(entry))
    apiRouter.get('/user/all', allUser(entry))
    apiRouter.get('/user/count', countUser(entry))
    apiRouter.get('/user/:id', oneUser(entry))
}
