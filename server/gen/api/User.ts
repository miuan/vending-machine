import * as JSON5 from 'json5'
import { apiMiddleware, userIsOwner, userHaveRoles, paramHaveFilter, RequestError, UnauthorizedError } from '../api-utils'

/**
 * @swagger
 * components: 
 *   parameters: 
 *     FieldParam: 
 *       name: "fields"
 *       in: "query"
 *       type: "array"
 *       collectionType: "csv"
 *       items: 
 *         type: "string"
 *     AliasParam: 
 *       name: "alias"
 *       in: "query"
 *       type: "string"
 *     SortParam: 
 *       name: "sort"
 *       in: "query"
 *       type: "string"
 *     FilterParam: 
 *       name: "filter"
 *       in: "query"
 *       type: "string"
 *     IdParam: 
 *       name: "id"
 *       in: "path"
 *       type: "string"
 *   schemas: 
 *     User: 
 *       type: "object"
 *       properties: 
 *         updatedAt: 
 *           type: "string"
 *         createdAt: 
 *           type: "string"
 *         id: 
 *           type: "integer"
 *         username: 
 *           type: "string"
 *         deposit: 
 *           type: "integer"
 *         email: 
 *           type: "string"
 *         password: 
 *           type: "string"
 *         verified: 
 *           type: "string"
 *         roles: 
 *           type: "string"
 *         files: 
 *           type: "string"
 *         _product: 
 *           type: "string"
 * paths: 
 *   /api/user/all: 
 *     get: 
 *       tags: 
 *         - "User"
 *         - "all"
 *         - "query"
 *       summary: "Retrive all User"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/SortParam"
 *         - 
 *           $ref: "#/components/parameters/FilterParam"
 *       responses: 
 *         200: 
 *           description: "List of User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "array"
 *                 items: 
 *                   $ref: "#/components/schemas/User"
 *   /api/user/owned: 
 *     get: 
 *       tags: 
 *         - "User"
 *         - "owned"
 *         - "query"
 *       summary: "Retrive only owned (my) User"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/SortParam"
 *         - 
 *           $ref: "#/components/parameters/FilterParam"
 *       responses: 
 *         200: 
 *           description: "List of User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "array"
 *                 items: 
 *                   $ref: "#/components/schemas/User"
 *   /api/user/count: 
 *     get: 
 *       tags: 
 *         - "User"
 *         - "count"
 *         - "query"
 *       summary: "Count of User"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/SortParam"
 *         - 
 *           $ref: "#/components/parameters/FilterParam"
 *       responses: 
 *         200: 
 *           description: "Count of User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "integer"
 *   /api/user: 
 *     post: 
 *       tags: 
 *         - "User"
 *         - "create"
 *         - "mutation"
 *       summary: "Create User with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *       requestBody: 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: "#/components/schemas/User"
 *       responses: 
 *         200: 
 *           description: "updated model User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/User"
 *   /api/user/{id}: 
 *     get: 
 *       tags: 
 *         - "User"
 *         - "one"
 *         - "query"
 *       summary: "Retrive one User by id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       responses: 
 *         200: 
 *           description: "One User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/User"
 *     put: 
 *       tags: 
 *         - "User"
 *         - "update"
 *         - "mutation"
 *       summary: "Update User with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       requestBody: 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: "#/components/schemas/User"
 *       responses: 
 *         200: 
 *           description: "updated model User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/User"
 *     delete: 
 *       tags: 
 *         - "User"
 *         - "delete"
 *         - "mutation"
 *       summary: "Delete User with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       responses: 
 *         200: 
 *           description: "updated model User"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/User"
 */

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
