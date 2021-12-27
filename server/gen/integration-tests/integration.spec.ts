
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
	"updatedAt": "2021-09-12T22:26:52.502Z",
	"createdAt": "2020-03-15T23:58:50.612Z",
	"amountAvailable": 661866,
	"cost": 885866,
	"productName": "Product/productName/u0va5lnk"
}
const createProductMutation = `mutation CreateProduct($amountAvailable: Int,$cost: Int!,$productName: String!){
        createProduct(amountAvailable: $amountAvailable,cost: $cost,productName: $productName) {
           amountAvailable,cost,productName
        }
    }`
    
    const createProductResponse = await server.mutate({
        mutation: createProductMutation,
        variables: data
      }, token);
    expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 661866)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 885866)
expect(createProductResponse).toHaveProperty('data.createProduct.productName', 'Product/productName/u0va5lnk')
        })
    
        
        it('one Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":275623,"cost":187679,"productName":"Product/productName/8g8syls"})
                // createModelLine: end  
            const oneProductQuery = `query Product($id: ID!){
        Product(id: $id) {
            updatedAt,createdAt,id,amountAvailable,cost,productName,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
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
expect(oneProductResponse).toHaveProperty('data.Product.productName', createProductResponse.productName)
expect(oneProductResponse).toHaveProperty('data.Product.user')

    
        })
    
        
        it('update Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":663438,"cost":339729,"productName":"Product/productName/s459gbu"})
                // createModelLine: end  
            const updateProductMutation = `mutation UpdateProduct($id: ID!,$amountAvailable: Int,$cost: Int!,$productName: String!){
        updateProduct(id: $id,amountAvailable: $amountAvailable,cost: $cost,productName: $productName) {
           id,amountAvailable,cost,productName
        }
    }`
    
    const updateProductResponse = await server.mutate({
        mutation: updateProductMutation,
        variables: {
	"id": createProductResponse.id,
	"amountAvailable": 974824,
	"cost": 24686,
	"productName": "Product/productName/9gduzera"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 974824)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 24686)
expect(updateProductResponse).toHaveProperty('data.updateProduct.productName', 'Product/productName/9gduzera')
    
        })
    
        
        it('remove Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":511394,"cost":973767,"productName":"Product/productName/neglsumc"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":938852,"cost":402125,"productName":"Product/productName/kdxhgauh"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":836993,"cost":678673,"productName":"Product/productName/xxgi5u7e"})
                // createModelLine: end  
            const allProductQuery = `query allProduct {
        allProduct {
            updatedAt,createdAt,id,amountAvailable,cost,productName,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const allProductResponse = await server.query({
        query: allProductQuery,
        variables: { id: createProductResponse.id}
      }, token)

    
expect(allProductResponse.data.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,productName: createProductResponse.productName}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,productName: createProductResponse2.productName})
    ]))
        })
    
    })

    describe('admin:api', ()=>{
        
        it('create:api Product', async()=>{
            const token = admin.token
              
            const data = {
	"updatedAt": "2021-04-14T22:14:07.811Z",
	"createdAt": "2020-06-27T22:38:50.895Z",
	"amountAvailable": 291847,
	"cost": 110273,
	"productName": "Product/productName/u0yka8m7"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 291847)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 110273)
expect(createProductResponse).toHaveProperty('body.createProduct.productName', 'Product/productName/u0yka8m7')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":229183,"cost":759181,"productName":"Product/productName/kkqoprak"})
                // createModelLine: end  
            
      const oneProductResponse = await server.get('/api/product/' + createProductResponse.id, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('body.product.updatedAt')
expect(oneProductResponse).toHaveProperty('body.product.createdAt')
expect(oneProductResponse).toHaveProperty('body.product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('body.product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('body.product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('body.product.productName', createProductResponse.productName)
expect(oneProductResponse).toHaveProperty('body.product.user')

    
        })
    
        
        it('update:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":155308,"cost":911700,"productName":"Product/productName/r449szm5"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 23694,
	"cost": 520817,
	"productName": "Product/productName/pjb1yqtg"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 23694)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 520817)
expect(updateProductResponse).toHaveProperty('body.updateProduct.productName', 'Product/productName/pjb1yqtg')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":184381,"cost":491072,"productName":"Product/productName/ui5iy27d"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":399782,"cost":376099,"productName":"Product/productName/mfnqnvdr"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":237406,"cost":987214,"productName":"Product/productName/dmk5bc9"})
                // createModelLine: end  
             const allProductResponse = await server.get('/api/product/all', token);
expect(allProductResponse.body.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,productName: createProductResponse.productName}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,productName: createProductResponse2.productName})
    ]))
        })
    
    })


    describe('user:graphql', ()=>{
        
        it('create Product', async()=>{
            const token = user.token
              
            const data = {
	"updatedAt": "2021-08-31T22:20:03.727Z",
	"createdAt": "2021-06-17T22:59:37.938Z",
	"amountAvailable": 69783,
	"cost": 960969,
	"productName": "Product/productName/3vtdr5v7"
}
const createProductMutation = `mutation CreateProduct($amountAvailable: Int,$cost: Int!,$productName: String!){
        createProduct(amountAvailable: $amountAvailable,cost: $cost,productName: $productName) {
           amountAvailable,cost,productName
        }
    }`
    
    const createProductResponse = await server.mutate({
        mutation: createProductMutation,
        variables: data
      }, token);
    expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 69783)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 960969)
expect(createProductResponse).toHaveProperty('data.createProduct.productName', 'Product/productName/3vtdr5v7')
        })
    
        
        it('one Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":127877,"cost":590590,"productName":"Product/productName/qcni3i6"})
                // createModelLine: end  
            const oneProductQuery = `query Product($id: ID!){
        Product(id: $id) {
            updatedAt,createdAt,id,amountAvailable,cost,productName,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
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
expect(oneProductResponse).toHaveProperty('data.Product.productName', createProductResponse.productName)
expect(oneProductResponse).toHaveProperty('data.Product.user')

    
        })
    
        
        it('update Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":1159,"cost":378025,"productName":"Product/productName/ltjyjwpr"})
                // createModelLine: end  
            const updateProductMutation = `mutation UpdateProduct($id: ID!,$amountAvailable: Int,$cost: Int!,$productName: String!){
        updateProduct(id: $id,amountAvailable: $amountAvailable,cost: $cost,productName: $productName) {
           id,amountAvailable,cost,productName
        }
    }`
    
    const updateProductResponse = await server.mutate({
        mutation: updateProductMutation,
        variables: {
	"id": createProductResponse.id,
	"amountAvailable": 109384,
	"cost": 800872,
	"productName": "Product/productName/aa9vgs8d"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 109384)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 800872)
expect(updateProductResponse).toHaveProperty('data.updateProduct.productName', 'Product/productName/aa9vgs8d')
    
        })
    
        
        it('remove Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":138205,"cost":679782,"productName":"Product/productName/4zlwypaa"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":389693,"cost":522059,"productName":"Product/productName/a846egru"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":62178,"cost":886275,"productName":"Product/productName/5cx052lr"})
                // createModelLine: end  
            const allProductQuery = `query allProduct {
        allProduct {
            updatedAt,createdAt,id,amountAvailable,cost,productName,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const allProductResponse = await server.query({
        query: allProductQuery,
        variables: { id: createProductResponse.id}
      }, token)

    
expect(allProductResponse.data.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,productName: createProductResponse.productName}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,productName: createProductResponse2.productName})
    ]))
        })
    
    })

    describe('user:api', ()=>{
        
        it('create:api Product', async()=>{
            const token = user.token
              
            const data = {
	"updatedAt": "2021-08-07T22:07:42.745Z",
	"createdAt": "2021-01-03T23:00:05.624Z",
	"amountAvailable": 421193,
	"cost": 737782,
	"productName": "Product/productName/08zbicl"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 421193)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 737782)
expect(createProductResponse).toHaveProperty('body.createProduct.productName', 'Product/productName/08zbicl')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":657684,"cost":477104,"productName":"Product/productName/powjx64p"})
                // createModelLine: end  
            
      const oneProductResponse = await server.get('/api/product/' + createProductResponse.id, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('body.product.updatedAt')
expect(oneProductResponse).toHaveProperty('body.product.createdAt')
expect(oneProductResponse).toHaveProperty('body.product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('body.product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('body.product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('body.product.productName', createProductResponse.productName)
expect(oneProductResponse).toHaveProperty('body.product.user')

    
        })
    
        
        it('update:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":509371,"cost":293483,"productName":"Product/productName/n9xicpv"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 976825,
	"cost": 781209,
	"productName": "Product/productName/vx81sxvp"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 976825)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 781209)
expect(updateProductResponse).toHaveProperty('body.updateProduct.productName', 'Product/productName/vx81sxvp')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":613967,"cost":643454,"productName":"Product/productName/8parh6x4"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":756812,"cost":654510,"productName":"Product/productName/x96eg81y"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":873588,"cost":362541,"productName":"Product/productName/ov3vocrf"})
                // createModelLine: end  
             const allProductResponse = await server.get('/api/product/all', token);
expect(allProductResponse.body.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,productName: createProductResponse.productName}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,productName: createProductResponse2.productName})
    ]))
        })
    
    })


    describe('pub:graphql', ()=>{
        
        it('create Product', async()=>{
            const token = pub.token
              
            const data = {
	"updatedAt": "2021-05-19T22:46:15.725Z",
	"createdAt": "2020-03-05T23:16:37.705Z",
	"amountAvailable": 678584,
	"cost": 127236,
	"productName": "Product/productName/roa0exuj"
}
const createProductMutation = `mutation CreateProduct($amountAvailable: Int,$cost: Int!,$productName: String!){
        createProduct(amountAvailable: $amountAvailable,cost: $cost,productName: $productName) {
           amountAvailable,cost,productName
        }
    }`
    
    const createProductResponse = await server.mutate({
        mutation: createProductMutation,
        variables: data
      }, token);
    expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 678584)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 127236)
expect(createProductResponse).toHaveProperty('data.createProduct.productName', 'Product/productName/roa0exuj')
        })
    
        
        it('one Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":497305,"cost":158774,"productName":"Product/productName/mqp5ra9g"})
                // createModelLine: end  
            const oneProductQuery = `query Product($id: ID!){
        Product(id: $id) {
            updatedAt,createdAt,id,amountAvailable,cost,productName,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
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
expect(oneProductResponse).toHaveProperty('data.Product.productName', createProductResponse.productName)
expect(oneProductResponse).toHaveProperty('data.Product.user')

    
        })
    
        
        it('update Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":73023,"cost":589848,"productName":"Product/productName/2cez78q"})
                // createModelLine: end  
            const updateProductMutation = `mutation UpdateProduct($id: ID!,$amountAvailable: Int,$cost: Int!,$productName: String!){
        updateProduct(id: $id,amountAvailable: $amountAvailable,cost: $cost,productName: $productName) {
           id,amountAvailable,cost,productName
        }
    }`
    
    const updateProductResponse = await server.mutate({
        mutation: updateProductMutation,
        variables: {
	"id": createProductResponse.id,
	"amountAvailable": 341486,
	"cost": 658548,
	"productName": "Product/productName/scaeubp"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 341486)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 658548)
expect(updateProductResponse).toHaveProperty('data.updateProduct.productName', 'Product/productName/scaeubp')
    
        })
    
        
        it('remove Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":584633,"cost":361771,"productName":"Product/productName/d3vqbn2d"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":190504,"cost":239151,"productName":"Product/productName/y4rqjh1"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":348050,"cost":626473,"productName":"Product/productName/82rufpbl"})
                // createModelLine: end  
            const allProductQuery = `query allProduct {
        allProduct {
            updatedAt,createdAt,id,amountAvailable,cost,productName,user{updatedAt,createdAt,id,username,deposit,email,password,verified,roles{id},files{id},_product{id}}
        }
    }`
    
    const allProductResponse = await server.query({
        query: allProductQuery,
        variables: { id: createProductResponse.id}
      }, token)

    
expect(allProductResponse.data.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,productName: createProductResponse.productName}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,productName: createProductResponse2.productName})
    ]))
        })
    
    })

    describe('pub:api', ()=>{
        
        it('create:api Product', async()=>{
            const token = pub.token
              
            const data = {
	"updatedAt": "2021-09-05T22:06:33.557Z",
	"createdAt": "2020-09-04T22:54:31.785Z",
	"amountAvailable": 764941,
	"cost": 341756,
	"productName": "Product/productName/ef30pz97"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 764941)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 341756)
expect(createProductResponse).toHaveProperty('body.createProduct.productName', 'Product/productName/ef30pz97')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":666517,"cost":43874,"productName":"Product/productName/gzeb2v7p"})
                // createModelLine: end  
            
      const oneProductResponse = await server.get('/api/product/' + createProductResponse.id, token);

      expect(oneProductResponse).not.toHaveProperty('errors')
expect(oneProductResponse).toHaveProperty('body.product.updatedAt')
expect(oneProductResponse).toHaveProperty('body.product.createdAt')
expect(oneProductResponse).toHaveProperty('body.product.id', createProductResponse.id)
expect(oneProductResponse).toHaveProperty('body.product.amountAvailable', createProductResponse.amountAvailable)
expect(oneProductResponse).toHaveProperty('body.product.cost', createProductResponse.cost)
expect(oneProductResponse).toHaveProperty('body.product.productName', createProductResponse.productName)
expect(oneProductResponse).toHaveProperty('body.product.user')

    
        })
    
        
        it('update:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":319143,"cost":562644,"productName":"Product/productName/nj6mu89"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 330214,
	"cost": 707270,
	"productName": "Product/productName/o977txxm"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 330214)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 707270)
expect(updateProductResponse).toHaveProperty('body.updateProduct.productName', 'Product/productName/o977txxm')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":862702,"cost":508322,"productName":"Product/productName/hmwoul3a"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":143233,"cost":206287,"productName":"Product/productName/ena444vq"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":89119,"cost":210946,"productName":"Product/productName/b4v4twim"})
                // createModelLine: end  
             const allProductResponse = await server.get('/api/product/all', token);
expect(allProductResponse.body.allProduct).toEqual(expect.arrayContaining([
        expect.objectContaining({id: createProductResponse.id,amountAvailable: createProductResponse.amountAvailable,cost: createProductResponse.cost,productName: createProductResponse.productName}),
        expect.objectContaining({id: createProductResponse2.id,amountAvailable: createProductResponse2.amountAvailable,cost: createProductResponse2.cost,productName: createProductResponse2.productName})
    ]))
        })
    
    })

        })
    
       
    })