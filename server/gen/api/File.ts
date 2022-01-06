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
 *     File: 
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
 *         publicKey: 
 *           type: "string"
 *         type: 
 *           type: "string"
 *         size: 
 *           type: "integer"
 *         data: 
 *           type: "string"
 *         user: 
 *           type: "string"
 * paths: 
 *   /api/file/all: 
 *     get: 
 *       tags: 
 *         - "File"
 *         - "all"
 *         - "query"
 *       summary: "Retrive all File"
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
 *           description: "List of File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "array"
 *                 items: 
 *                   $ref: "#/components/schemas/File"
 *   /api/file/owned: 
 *     get: 
 *       tags: 
 *         - "File"
 *         - "owned"
 *         - "query"
 *       summary: "Retrive only owned (my) File"
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
 *           description: "List of File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "array"
 *                 items: 
 *                   $ref: "#/components/schemas/File"
 *   /api/file/count: 
 *     get: 
 *       tags: 
 *         - "File"
 *         - "count"
 *         - "query"
 *       summary: "Count of File"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/SortParam"
 *         - 
 *           $ref: "#/components/parameters/FilterParam"
 *       responses: 
 *         200: 
 *           description: "Count of File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 type: "integer"
 *   /api/file: 
 *     post: 
 *       tags: 
 *         - "File"
 *         - "create"
 *         - "mutation"
 *       summary: "Create File with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *       requestBody: 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: "#/components/schemas/File"
 *       responses: 
 *         200: 
 *           description: "updated model File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/File"
 *   /api/file/{id}: 
 *     get: 
 *       tags: 
 *         - "File"
 *         - "one"
 *         - "query"
 *       summary: "Retrive one File by id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       responses: 
 *         200: 
 *           description: "One File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/File"
 *     put: 
 *       tags: 
 *         - "File"
 *         - "update"
 *         - "mutation"
 *       summary: "Update File with id"
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
 *               $ref: "#/components/schemas/File"
 *       responses: 
 *         200: 
 *           description: "updated model File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/File"
 *     delete: 
 *       tags: 
 *         - "File"
 *         - "delete"
 *         - "mutation"
 *       summary: "Delete File with id"
 *       parameters: 
 *         - 
 *           $ref: "#/components/parameters/FieldParam"
 *         - 
 *           $ref: "#/components/parameters/AliasParam"
 *         - 
 *           $ref: "#/components/parameters/IdParam"
 *       responses: 
 *         200: 
 *           description: "updated model File"
 *           content: 
 *             application/json: 
 *               schema: 
 *                 $ref: "#/components/schemas/File"
 */

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
