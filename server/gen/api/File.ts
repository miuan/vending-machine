import * as JSON5 from 'json5'
import { apiMiddleware, userIsOwner, userHaveRoles, paramHaveFilter, RequestError, UnauthorizedError } from '../api-utils'

const createFile = (entry) => async (ctx) => {
    let body = ctx.request.body

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeCreateFile']) {
        body = (await entry.hooks.api['beforeCreateFile'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['file'].create(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterCreateFile']) {
        resData = (await entry.hooks.api['afterCreateFile'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'createFile')
}

const updateFile = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeUpdateFile']) {
        body = (await entry.hooks.api['beforeUpdateFile'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['file'].update(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterUpdateFile']) {
        resData = (await entry.hooks.api['afterUpdateFile'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'updateFile')
}

const removeFile = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userIsOwner(ctx, body, entry.models.file, entry.models.userRole, 'user')) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeRemoveFile']) {
        body = (await entry.hooks.api['beforeRemoveFile'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['file'].remove(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterRemoveFile']) {
        resData = (await entry.hooks.api['afterRemoveFile'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'removeFile')
}

const oneFile = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userIsOwner(ctx, body, entry.models.file, entry.models.userRole, 'user')) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeOneFile']) {
        body = (await entry.hooks.api['beforeOneFile'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['file'].one(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterOneFile']) {
        resData = (await entry.hooks.api['afterOneFile'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'file')
}

const allFile = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeAllFile']) {
        body = (await entry.hooks.api['beforeAllFile'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['file'].all(ctx.params, ctx.state?.user?.id)
    resData = resData.map((m) => {
        m.id = m._id
        delete m._id
        return m
    })

    if (entry.hooks.api['afterAllFile']) {
        resData = (await entry.hooks.api['afterAllFile'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'allFile')
}

const countFile = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeAllFile']) {
        body = (await entry.hooks.api['beforeAllFile'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    const query = ctx.request.query
    if (query.filter) {
        query.filter = JSON5.parse(query.filter)
    }
    let resData = await entry.services['file'].count(query, ctx.state?.user?.id)

    if (entry.hooks.api['afterAllFile']) {
        resData = (await entry.hooks.api['afterAllFile'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'countFile')
}

export function connectFileApi(apiRouter, entry) {
    apiRouter.post('/file', createFile(entry))
    apiRouter.put('/file/:id', updateFile(entry))
    apiRouter.delete('/file/:id', removeFile(entry))
    apiRouter.get('/file/all', allFile(entry))
    apiRouter.get('/file/count', countFile(entry))
    apiRouter.get('/file/:id', oneFile(entry))
}
