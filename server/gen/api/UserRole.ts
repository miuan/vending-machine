import * as JSON5 from 'json5'
import { apiMiddleware, userIsOwner, userHaveRoles, paramHaveFilter, RequestError, UnauthorizedError } from '../api-utils'

const createUserRole = (entry) => async (ctx) => {
    let body = ctx.request.body

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeCreateUserRole']) {
        body = (await entry.hooks.api['beforeCreateUserRole'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['userRole'].create(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterCreateUserRole']) {
        resData = (await entry.hooks.api['afterCreateUserRole'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'createUserRole')
}

const updateUserRole = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeUpdateUserRole']) {
        body = (await entry.hooks.api['beforeUpdateUserRole'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['userRole'].update(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterUpdateUserRole']) {
        resData = (await entry.hooks.api['afterUpdateUserRole'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'updateUserRole')
}

const removeUserRole = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeRemoveUserRole']) {
        body = (await entry.hooks.api['beforeRemoveUserRole'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['userRole'].remove(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterRemoveUserRole']) {
        resData = (await entry.hooks.api['afterRemoveUserRole'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'removeUserRole')
}

const oneUserRole = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeOneUserRole']) {
        body = (await entry.hooks.api['beforeOneUserRole'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['userRole'].one(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterOneUserRole']) {
        resData = (await entry.hooks.api['afterOneUserRole'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'userRole')
}

const allUserRole = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeAllUserRole']) {
        body = (await entry.hooks.api['beforeAllUserRole'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['userRole'].all(ctx.params, ctx.state?.user?.id)
    resData = resData.map((m) => {
        m.id = m._id
        delete m._id
        return m
    })

    if (entry.hooks.api['afterAllUserRole']) {
        resData = (await entry.hooks.api['afterAllUserRole'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'allUserRole')
}

const countUserRole = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeAllUserRole']) {
        body = (await entry.hooks.api['beforeAllUserRole'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    const query = ctx.request.query
    if (query.filter) {
        query.filter = JSON5.parse(query.filter)
    }
    let resData = await entry.services['userRole'].count(query, ctx.state?.user?.id)

    if (entry.hooks.api['afterAllUserRole']) {
        resData = (await entry.hooks.api['afterAllUserRole'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'countUserRole')
}

export function connectUserRoleApi(apiRouter, entry) {
    apiRouter.post('/userRole', createUserRole(entry))
    apiRouter.put('/userRole/:id', updateUserRole(entry))
    apiRouter.delete('/userRole/:id', removeUserRole(entry))
    apiRouter.get('/userRole/all', allUserRole(entry))
    apiRouter.get('/userRole/count', countUserRole(entry))
    apiRouter.get('/userRole/:id', oneUserRole(entry))
}
