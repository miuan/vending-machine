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
 *     UserRole: 
 *       type: "object"
 *       properties: 
 *         updatedAt: 
 *           type: "string"
 *         createdAt: 
 *           type: "string"
 *         id: 
 *           type: "integer"
 *         name: 
 *           type: "string"
 *         users: 
 *           type: "string"
 * paths: 
 *   /api/userRole/all: 
 *     get: 
 *       tags: 
 *         - "UserRole"
 *         - "all"
 *         - "query"
 *       summary: "Retrive all UserRole"
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
 *           description: "List of UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "array"
 *                 items: 
 *                   $ref: "#/components/schemas/UserRole"
 *   /api/userRole/owned: 
 *     get: 
 *       tags: 
 *         - "UserRole"
 *         - "owned"
 *         - "query"
 *       summary: "Retrive only owned (my) UserRole"
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
 *           description: "List of UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "array"
 *                 items: 
 *                   $ref: "#/components/schemas/UserRole"
 *   /api/userRole/count: 
 *     get: 
 *       tags: 
 *         - "UserRole"
 *         - "count"
 *         - "query"
 *       summary: "Count of UserRole"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/SortParam"
 *         - 
 *           $ref: "#/components/parameters/FilterParam"
 *       responses: 
 *         200: 
 *           description: "Count of UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "integer"
 *   /api/userRole: 
 *     post: 
 *       tags: 
 *         - "UserRole"
 *         - "create"
 *         - "mutation"
 *       summary: "Create UserRole with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *       requestBody: 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: "#/components/schemas/UserRole"
 *       responses: 
 *         200: 
 *           description: "updated model UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/UserRole"
 *   /api/userRole/{id}: 
 *     get: 
 *       tags: 
 *         - "UserRole"
 *         - "one"
 *         - "query"
 *       summary: "Retrive one UserRole by id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       responses: 
 *         200: 
 *           description: "One UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/UserRole"
 *     put: 
 *       tags: 
 *         - "UserRole"
 *         - "update"
 *         - "mutation"
 *       summary: "Update UserRole with id"
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
 *               $ref: "#/components/schemas/UserRole"
 *       responses: 
 *         200: 
 *           description: "updated model UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/UserRole"
 *     delete: 
 *       tags: 
 *         - "UserRole"
 *         - "delete"
 *         - "mutation"
 *       summary: "Delete UserRole with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       responses: 
 *         200: 
 *           description: "updated model UserRole"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/UserRole"
 */

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
