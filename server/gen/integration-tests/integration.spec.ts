
    import { connectToServer, disconnectFromServer } from './helper'
    export async function createProduct(server, {user}, data){
        data.user = user.id
        return server.entry.models['product'].create(data)
    }
    
    describe('integration', () => {
        let server
        let admin, user, pub
        
        beforeAll(async ()=>{
            server = await connectToServer()

            const res = await server.post(
                "/auth/login_v1?fields=token,refreshToken,user.id&alias=login",
                {
                  email: "admin@admin.test",
                  password: "admin@admin.test",
                }
              );
          
              // expect(res).toHaveProperty('status', 200)
              expect(res).toHaveProperty("body.login.token");
              expect(res.body.login.token).toMatch(
                /^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/
              );
              expect(res).toHaveProperty("body.login.refreshToken");
              expect(res).toHaveProperty("body.login.user.id");
              expect(res).toHaveProperty("body.login.user.email", "admin@admin.test");
              // expect(res).toHaveProperty('body.login.user.roles', [{ name: 'admin' }])
              expect(res).not.toHaveProperty("errors");
          
              admin = res.body.login;

              const res2 = await server.post(
                "/auth/register_v1?fields=token,refreshToken,user.id&alias=register",
                {
                  email: "user@user.test",
                  password: "user@user.test",
                }
              );
          
              // expect(res).toHaveProperty('status', 200)
              expect(res2).toHaveProperty("body.register.token");
              expect(res2.body.register.token).toMatch(
                /^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/
              );
              expect(res2).toHaveProperty("body.register.refreshToken");
              expect(res2).toHaveProperty("body.register.user.id");
              expect(res2).toHaveProperty("body.register.user.email", "user@user.test");
              // expect(res).toHaveProperty('body.register.user.roles', [{ name: 'admin' }])
              expect(res2).not.toHaveProperty("errors");
          
              user = res2.body.register.token;

              pub = {user: user.user, token: ''};
        })

        afterAll(async () => {
            disconnectFromServer(server)
        });

        
        describe('Product', () => {
             
    describe('admin:graphql', ()=>{
        
        it('create Product', async()=>{
            const token = admin.token
              
            const data = {
	"updatedAt": "2020-08-21T22:12:52.810Z",
	"createdAt": "2021-09-27T22:58:11.071Z",
	"amountAvailable": 307986,
	"cost": 541523,
	"name": "Product/name/7mfdiyr8"
}
const createProductMutation = `mutation CreateProduct($amountAvailable: Int,$cost: Int!,$name: String!){
        createProduct(amountAvailable: $amountAvailable,cost: $cost,name: $name) {
           amountAvailable,cost,name
        }
    }`
    
    const createProductResponse = await server.mutate({
        mutation: createProductMutation,
        variables: data
      }, token);
    expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 307986)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 541523)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/7mfdiyr8')
        })
    
        
        it('one Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":896332,"cost":651502,"name":"Product/name/eeukdap3"})
                // createModelLine: end  
            const oneProductQuery = `query Product($id: ID!){
        Product(id: $id) {
            updatedAt,createdAt,id,amountAvailable,cost,name,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const oneProductResponse = await server.query({
        query: oneProductQuery,
        variables: { id: createProductResponse.id}
      }, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('data.Product.updatedAt')
expect(oneProductResponse).toHaveProperty('data.Product.createdAt')
expect(oneProductResponse).toHaveProperty('data.Product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('data.Product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('data.Product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('data.Product.name', createProductResponse.name)
expect(oneProductResponse).toHaveProperty('data.Product.user')

    
        })
    
        
        it('update Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":691553,"cost":142642,"name":"Product/name/ju40krqk"})
                // createModelLine: end  
            const updateProductMutation = `mutation UpdateProduct($id: ID!,$amountAvailable: Int,$cost: Int!,$name: String!){
        updateProduct(id: $id,amountAvailable: $amountAvailable,cost: $cost,name: $name) {
           id,amountAvailable,cost,name
        }
    }`
    
    const updateProductResponse = await server.mutate({
        mutation: updateProductMutation,
        variables: {
	"id": createProductResponse.id,
	"amountAvailable": 59461,
	"cost": 1730,
	"name": "Product/name/3z2cto3n"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 59461)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 1730)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/3z2cto3n')
    
        })
    
        
        it('remove Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":157319,"cost":612290,"name":"Product/name/lv7eau7r"})
                // createModelLine: end  
            const removeProductMutation = `mutation RemoveProduct($id: ID!){
        removeProduct(id: $id) {
           id
        }
    }`
    
    const removeProductResponse = await server.mutate({
        mutation: removeProductMutation,
        variables: { id:createProductResponse.id }
      }, token);

      expect(removeProductResponse).not.toHaveProperty('errors')
expect(removeProductResponse).toHaveProperty('data.removeProduct.id', createProductResponse.id)

          
          const productCheck = await server.entry.models['product'].findById(createProductResponse.id)
          expect(productCheck).toBeNull()
    
    
        })
    
        
        it('all Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":240681,"cost":537037,"name":"Product/name/c8f4iuy"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":861627,"cost":200594,"name":"Product/name/6gbabm5"})
                // createModelLine: end  
            const allProductQuery = `query allProduct {
        allProduct {
            updatedAt,createdAt,id,amountAvailable,cost,name,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const allProductResponse = await server.query({
        query: allProductQuery,
        variables: { id: createProductResponse.id}
      }, token)

    
expect(allProductResponse.data.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,name: createProductResponse.name}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,name: createProductResponse2.name})
    ]))
        })
    
    })

    describe('admin:api', ()=>{
        
        it('create:api Product', async()=>{
            const token = admin.token
              
            const data = {
	"updatedAt": "2020-07-21T22:23:49.946Z",
	"createdAt": "2021-10-04T22:47:16.632Z",
	"amountAvailable": 908274,
	"cost": 577187,
	"name": "Product/name/o73dsovo"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 908274)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 577187)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/o73dsovo')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":963565,"cost":933667,"name":"Product/name/s9hx8npg"})
                // createModelLine: end  
            
      const oneProductResponse = await server.get('/api/product/' + createProductResponse.id, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('body.product.updatedAt')
expect(oneProductResponse).toHaveProperty('body.product.createdAt')
expect(oneProductResponse).toHaveProperty('body.product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('body.product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('body.product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('body.product.name', createProductResponse.name)
expect(oneProductResponse).toHaveProperty('body.product.user')

    
        })
    
        
        it('update:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":498648,"cost":552796,"name":"Product/name/k8su24ma"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 163550,
	"cost": 227705,
	"name": "Product/name/otz3lum"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 163550)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 227705)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/otz3lum')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":190189,"cost":970108,"name":"Product/name/8qvmzegc"})
                // createModelLine: end  
            const removeProductMutation = `mutation RemoveProduct($id: ID!){
        removeProduct(id: $id) {
           id
        }
    }`
    
    const removeProductResponse = await server.mutate({
        mutation: removeProductMutation,
        variables: { id:createProductResponse.id }
      }, token);

      expect(removeProductResponse).not.toHaveProperty('errors')
expect(removeProductResponse).toHaveProperty('data.removeProduct.id', createProductResponse.id)

          
          const productCheck = await server.entry.models['product'].findById(createProductResponse.id)
          expect(productCheck).toBeNull()
    
    
        })
    
        
        it('all:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":895726,"cost":66884,"name":"Product/name/hbecpcjx"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":170430,"cost":165085,"name":"Product/name/rwpxwqbl"})
                // createModelLine: end  
             const allProductResponse = await server.get('/api/product/all', token);
expect(allProductResponse.body.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,name: createProductResponse.name}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,name: createProductResponse2.name})
    ]))
        })
    
    })


    describe('user:graphql', ()=>{
        
        it('create Product', async()=>{
            const token = user.token
              
            const data = {
	"updatedAt": "2020-06-25T22:11:59.809Z",
	"createdAt": "2020-10-08T22:31:10.728Z",
	"amountAvailable": 460183,
	"cost": 696843,
	"name": "Product/name/ptxtuzn"
}
const createProductMutation = `mutation CreateProduct($amountAvailable: Int,$cost: Int!,$name: String!){
        createProduct(amountAvailable: $amountAvailable,cost: $cost,name: $name) {
           amountAvailable,cost,name
        }
    }`
    
    const createProductResponse = await server.mutate({
        mutation: createProductMutation,
        variables: data
      }, token);
    expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 460183)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 696843)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/ptxtuzn')
        })
    
        
        it('one Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":955826,"cost":629499,"name":"Product/name/hznurx"})
                // createModelLine: end  
            const oneProductQuery = `query Product($id: ID!){
        Product(id: $id) {
            updatedAt,createdAt,id,amountAvailable,cost,name,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const oneProductResponse = await server.query({
        query: oneProductQuery,
        variables: { id: createProductResponse.id}
      }, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('data.Product.updatedAt')
expect(oneProductResponse).toHaveProperty('data.Product.createdAt')
expect(oneProductResponse).toHaveProperty('data.Product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('data.Product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('data.Product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('data.Product.name', createProductResponse.name)
expect(oneProductResponse).toHaveProperty('data.Product.user')

    
        })
    
        
        it('update Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":729436,"cost":97163,"name":"Product/name/hb6hwi1i"})
                // createModelLine: end  
            const updateProductMutation = `mutation UpdateProduct($id: ID!,$amountAvailable: Int,$cost: Int!,$name: String!){
        updateProduct(id: $id,amountAvailable: $amountAvailable,cost: $cost,name: $name) {
           id,amountAvailable,cost,name
        }
    }`
    
    const updateProductResponse = await server.mutate({
        mutation: updateProductMutation,
        variables: {
	"id": createProductResponse.id,
	"amountAvailable": 992025,
	"cost": 253288,
	"name": "Product/name/3jhjeinq"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 992025)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 253288)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/3jhjeinq')
    
        })
    
        
        it('remove Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":235315,"cost":873904,"name":"Product/name/t0e4iine"})
                // createModelLine: end  
            const removeProductMutation = `mutation RemoveProduct($id: ID!){
        removeProduct(id: $id) {
           id
        }
    }`
    
    const removeProductResponse = await server.mutate({
        mutation: removeProductMutation,
        variables: { id:createProductResponse.id }
      }, token);

      expect(removeProductResponse).not.toHaveProperty('errors')
expect(removeProductResponse).toHaveProperty('data.removeProduct.id', createProductResponse.id)

          
          const productCheck = await server.entry.models['product'].findById(createProductResponse.id)
          expect(productCheck).toBeNull()
    
    
        })
    
        
        it('all Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":222647,"cost":563347,"name":"Product/name/r14jzjzj"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":859714,"cost":679822,"name":"Product/name/0steudre"})
                // createModelLine: end  
            const allProductQuery = `query allProduct {
        allProduct {
            updatedAt,createdAt,id,amountAvailable,cost,name,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const allProductResponse = await server.query({
        query: allProductQuery,
        variables: { id: createProductResponse.id}
      }, token)

    
expect(allProductResponse.data.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,name: createProductResponse.name}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,name: createProductResponse2.name})
    ]))
        })
    
    })

    describe('user:api', ()=>{
        
        it('create:api Product', async()=>{
            const token = user.token
              
            const data = {
	"updatedAt": "2021-11-11T23:54:19.297Z",
	"createdAt": "2020-03-14T23:14:53.458Z",
	"amountAvailable": 558187,
	"cost": 107279,
	"name": "Product/name/ubjx51w"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 558187)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 107279)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/ubjx51w')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":965033,"cost":195512,"name":"Product/name/8rk7wzji"})
                // createModelLine: end  
            
      const oneProductResponse = await server.get('/api/product/' + createProductResponse.id, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('body.product.updatedAt')
expect(oneProductResponse).toHaveProperty('body.product.createdAt')
expect(oneProductResponse).toHaveProperty('body.product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('body.product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('body.product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('body.product.name', createProductResponse.name)
expect(oneProductResponse).toHaveProperty('body.product.user')

    
        })
    
        
        it('update:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":481651,"cost":639672,"name":"Product/name/3rslor2"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 343727,
	"cost": 987757,
	"name": "Product/name/jajkit1"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 343727)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 987757)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/jajkit1')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":458914,"cost":328472,"name":"Product/name/5xaavy4a"})
                // createModelLine: end  
            const removeProductMutation = `mutation RemoveProduct($id: ID!){
        removeProduct(id: $id) {
           id
        }
    }`
    
    const removeProductResponse = await server.mutate({
        mutation: removeProductMutation,
        variables: { id:createProductResponse.id }
      }, token);

      expect(removeProductResponse).not.toHaveProperty('errors')
expect(removeProductResponse).toHaveProperty('data.removeProduct.id', createProductResponse.id)

          
          const productCheck = await server.entry.models['product'].findById(createProductResponse.id)
          expect(productCheck).toBeNull()
    
    
        })
    
        
        it('all:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":172075,"cost":267543,"name":"Product/name/39tgb4b"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":47638,"cost":508686,"name":"Product/name/gpywuxzj"})
                // createModelLine: end  
             const allProductResponse = await server.get('/api/product/all', token);
expect(allProductResponse.body.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,name: createProductResponse.name}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,name: createProductResponse2.name})
    ]))
        })
    
    })


    describe('pub:graphql', ()=>{
        
        it('create Product', async()=>{
            const token = pub.token
              
            const data = {
	"updatedAt": "2020-07-29T22:40:14.340Z",
	"createdAt": "2020-07-03T22:38:19.862Z",
	"amountAvailable": 827640,
	"cost": 50361,
	"name": "Product/name/ctl71wlt"
}
const createProductMutation = `mutation CreateProduct($amountAvailable: Int,$cost: Int!,$name: String!){
        createProduct(amountAvailable: $amountAvailable,cost: $cost,name: $name) {
           amountAvailable,cost,name
        }
    }`
    
    const createProductResponse = await server.mutate({
        mutation: createProductMutation,
        variables: data
      }, token);
    expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 827640)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 50361)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/ctl71wlt')
        })
    
        
        it('one Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":742070,"cost":415620,"name":"Product/name/ws01ui59"})
                // createModelLine: end  
            const oneProductQuery = `query Product($id: ID!){
        Product(id: $id) {
            updatedAt,createdAt,id,amountAvailable,cost,name,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const oneProductResponse = await server.query({
        query: oneProductQuery,
        variables: { id: createProductResponse.id}
      }, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('data.Product.updatedAt')
expect(oneProductResponse).toHaveProperty('data.Product.createdAt')
expect(oneProductResponse).toHaveProperty('data.Product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('data.Product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('data.Product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('data.Product.name', createProductResponse.name)
expect(oneProductResponse).toHaveProperty('data.Product.user')

    
        })
    
        
        it('update Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":540877,"cost":183750,"name":"Product/name/9shcmk3o"})
                // createModelLine: end  
            const updateProductMutation = `mutation UpdateProduct($id: ID!,$amountAvailable: Int,$cost: Int!,$name: String!){
        updateProduct(id: $id,amountAvailable: $amountAvailable,cost: $cost,name: $name) {
           id,amountAvailable,cost,name
        }
    }`
    
    const updateProductResponse = await server.mutate({
        mutation: updateProductMutation,
        variables: {
	"id": createProductResponse.id,
	"amountAvailable": 412826,
	"cost": 13725,
	"name": "Product/name/q1zefme"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 412826)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 13725)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/q1zefme')
    
        })
    
        
        it('remove Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":78583,"cost":638867,"name":"Product/name/34oyoc6m"})
                // createModelLine: end  
            const removeProductMutation = `mutation RemoveProduct($id: ID!){
        removeProduct(id: $id) {
           id
        }
    }`
    
    const removeProductResponse = await server.mutate({
        mutation: removeProductMutation,
        variables: { id:createProductResponse.id }
      }, token);

      expect(removeProductResponse).not.toHaveProperty('errors')
expect(removeProductResponse).toHaveProperty('data.removeProduct.id', createProductResponse.id)

          
          const productCheck = await server.entry.models['product'].findById(createProductResponse.id)
          expect(productCheck).toBeNull()
    
    
        })
    
        
        it('all Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":291867,"cost":314682,"name":"Product/name/qdtpxd69"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":3838,"cost":497852,"name":"Product/name/1cun6hr"})
                // createModelLine: end  
            const allProductQuery = `query allProduct {
        allProduct {
            updatedAt,createdAt,id,amountAvailable,cost,name,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const allProductResponse = await server.query({
        query: allProductQuery,
        variables: { id: createProductResponse.id}
      }, token)

    
expect(allProductResponse.data.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,name: createProductResponse.name}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,name: createProductResponse2.name})
    ]))
        })
    
    })

    describe('pub:api', ()=>{
        
        it('create:api Product', async()=>{
            const token = pub.token
              
            const data = {
	"updatedAt": "2021-02-27T23:22:16.253Z",
	"createdAt": "2021-12-18T23:21:15.781Z",
	"amountAvailable": 845047,
	"cost": 934152,
	"name": "Product/name/qo4psswp"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 845047)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 934152)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/qo4psswp')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":268156,"cost":129840,"name":"Product/name/zs4db7i4"})
                // createModelLine: end  
            
      const oneProductResponse = await server.get('/api/product/' + createProductResponse.id, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('body.product.updatedAt')
expect(oneProductResponse).toHaveProperty('body.product.createdAt')
expect(oneProductResponse).toHaveProperty('body.product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('body.product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('body.product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('body.product.name', createProductResponse.name)
expect(oneProductResponse).toHaveProperty('body.product.user')

    
        })
    
        
        it('update:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":495253,"cost":627817,"name":"Product/name/zusd6scb"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 654980,
	"cost": 134559,
	"name": "Product/name/4wd3vxl"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 654980)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 134559)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/4wd3vxl')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":36926,"cost":302709,"name":"Product/name/7m5ct30x"})
                // createModelLine: end  
            const removeProductMutation = `mutation RemoveProduct($id: ID!){
        removeProduct(id: $id) {
           id
        }
    }`
    
    const removeProductResponse = await server.mutate({
        mutation: removeProductMutation,
        variables: { id:createProductResponse.id }
      }, token);

      expect(removeProductResponse).not.toHaveProperty('errors')
expect(removeProductResponse).toHaveProperty('data.removeProduct.id', createProductResponse.id)

          
          const productCheck = await server.entry.models['product'].findById(createProductResponse.id)
          expect(productCheck).toBeNull()
    
    
        })
    
        
        it('all:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":365840,"cost":839999,"name":"Product/name/y1jykx9n"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":441748,"cost":185760,"name":"Product/name/89gr0p4f"})
                // createModelLine: end  
             const allProductResponse = await server.get('/api/product/all', token);
expect(allProductResponse.body.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,name: createProductResponse.name}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,name: createProductResponse2.name})
    ]))
        })
    
    })

        })
    
       
    })