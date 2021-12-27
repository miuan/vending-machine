import * as JSON5 from 'json5'
import { apiMiddleware, userIsOwner, userHaveRoles, paramHaveFilter, RequestError, UnauthorizedError } from '../api-utils'

const createProduct = (entry) => async (ctx) => {
    let body = ctx.request.body

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole))&&!(await userHaveRoles(ctx, ['seller'], entry.models.userRole)) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeCreateProduct']) {
        body = (await entry.hooks.api['beforeCreateProduct'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['product'].create(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterCreateProduct']) {
        resData = (await entry.hooks.api['afterCreateProduct'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'createProduct')
}

const updateProduct = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole))&&!(await userIsOwner(ctx, body, entry.models.product, entry.models.userRole, 'user')) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeUpdateProduct']) {
        body = (await entry.hooks.api['beforeUpdateProduct'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['product'].update(body, ctx.state?.user?.id)

    if (entry.hooks.api['afterUpdateProduct']) {
        resData = (await entry.hooks.api['afterUpdateProduct'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'updateProduct')
}

const removeProduct = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole))&&!(await userIsOwner(ctx, body, entry.models.product, entry.models.userRole, 'user')) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeRemoveProduct']) {
        body = (await entry.hooks.api['beforeRemoveProduct'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['product'].remove(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterRemoveProduct']) {
        resData = (await entry.hooks.api['afterRemoveProduct'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'removeProduct')
}

const oneProduct = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    if( !(await userHaveRoles(ctx, ['admin'], entry.models.userRole))&&!(await userIsOwner(ctx, body, entry.models.product, entry.models.userRole, 'user')) ){
            throw new UnauthorizedError()
          }

    if (entry.hooks.api['beforeOneProduct']) {
        body = (await entry.hooks.api['beforeOneProduct'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['product'].one(body.id, ctx.state?.user?.id)

    if (entry.hooks.api['afterOneProduct']) {
        resData = (await entry.hooks.api['afterOneProduct'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'product')
}

const allProduct = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    

    if (entry.hooks.api['beforeAllProduct']) {
        body = (await entry.hooks.api['beforeAllProduct'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    let resData = await entry.services['product'].all(ctx.params, ctx.state?.user?.id)
    resData = resData.map((m) => {
        m.id = m._id
        delete m._id
        return m
    })

    if (entry.hooks.api['afterAllProduct']) {
        resData = (await entry.hooks.api['afterAllProduct'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'allProduct')
}

const countProduct = (entry) => async (ctx) => {
    let body = ctx.request.body || {}
    // user is owner need id
    body.id = ctx.params.id

    

    if (entry.hooks.api['beforeAllProduct']) {
        body = (await entry.hooks.api['beforeAllProduct'](entry, ctx, body)) || body
    }

    body.user = body.user || ctx.state?.user?.id
    const query = ctx.request.query
    if (query.filter) {
        query.filter = JSON5.parse(query.filter)
    }
    let resData = await entry.services['product'].count(query, ctx.state?.user?.id)

    if (entry.hooks.api['afterAllProduct']) {
        resData = (await entry.hooks.api['afterAllProduct'](entry, ctx, resData, body)) || resData
    }

    ctx.body = apiMiddleware(ctx, resData, 'countProduct')
}

export function connectProductApi(apiRouter, entry) {
    apiRouter.post('/product', createProduct(entry))
    apiRouter.put('/product/:id', updateProduct(entry))
    apiRouter.delete('/product/:id', removeProduct(entry))
    apiRouter.get('/product/all', allProduct(entry))
    apiRouter.get('/product/count', countProduct(entry))
    apiRouter.get('/product/:id', oneProduct(entry))
}
