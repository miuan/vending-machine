
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
	"updatedAt": "2021-07-13T22:09:29.413Z",
	"createdAt": "2020-01-24T23:58:36.947Z",
	"amountAvailable": 401447,
	"cost": 388113,
	"name": "Product/name/w26s06b"
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
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 401447)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 388113)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/w26s06b')
        })
    
        
        it('one Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":845082,"cost":41364,"name":"Product/name/cypuu0n4"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":47697,"cost":906969,"name":"Product/name/7pqoc11l"})
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
	"amountAvailable": 115894,
	"cost": 166930,
	"name": "Product/name/oaabog7"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 115894)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 166930)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/oaabog7')
    
        })
    
        
        it('remove Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":719627,"cost":926110,"name":"Product/name/8isw3tv9"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":905765,"cost":957581,"name":"Product/name/3x1rkcjd"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":480852,"cost":801723,"name":"Product/name/cwc5yh5x"})
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
	"updatedAt": "2021-03-30T22:46:15.538Z",
	"createdAt": "2021-07-22T22:34:52.351Z",
	"amountAvailable": 403000,
	"cost": 958011,
	"name": "Product/name/1os5h59g"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 403000)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 958011)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/1os5h59g')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":352686,"cost":386223,"name":"Product/name/q44hsb3h"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":60355,"cost":347353,"name":"Product/name/mceb153"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 565117,
	"cost": 471093,
	"name": "Product/name/72hhzh0c"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 565117)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 471093)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/72hhzh0c')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":519369,"cost":418426,"name":"Product/name/mlb7xzd"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":405936,"cost":445275,"name":"Product/name/7qp4ei0o"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":769033,"cost":635828,"name":"Product/name/he1e2a5j"})
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
	"updatedAt": "2021-05-20T22:27:58.617Z",
	"createdAt": "2021-12-24T23:31:37.738Z",
	"amountAvailable": 161753,
	"cost": 326147,
	"name": "Product/name/00gvh86r"
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
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 161753)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 326147)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/00gvh86r')
        })
    
        
        it('one Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":797663,"cost":842037,"name":"Product/name/dhcstljg"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":498297,"cost":627050,"name":"Product/name/tyojwbui"})
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
	"amountAvailable": 89286,
	"cost": 643866,
	"name": "Product/name/2e8hsire"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 89286)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 643866)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/2e8hsire')
    
        })
    
        
        it('remove Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":371414,"cost":444629,"name":"Product/name/1o1v6737"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":588437,"cost":307344,"name":"Product/name/6v4l0f0g"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":987387,"cost":499899,"name":"Product/name/o0igw9i"})
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
	"updatedAt": "2021-01-17T23:29:29.101Z",
	"createdAt": "2021-05-18T22:31:45.466Z",
	"amountAvailable": 696732,
	"cost": 188631,
	"name": "Product/name/quuz5zpj"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 696732)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 188631)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/quuz5zpj')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":209304,"cost":211262,"name":"Product/name/n9sb76bl"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":525289,"cost":512379,"name":"Product/name/cvi7hl1m"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 456825,
	"cost": 86898,
	"name": "Product/name/ago35cg6e"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 456825)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 86898)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/ago35cg6e')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":720273,"cost":7982,"name":"Product/name/xq4z1wcw"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":347176,"cost":530133,"name":"Product/name/tc98afkg"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":397144,"cost":364935,"name":"Product/name/l590r4ac"})
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
	"updatedAt": "2020-02-03T23:41:30.812Z",
	"createdAt": "2021-05-31T22:46:40.041Z",
	"amountAvailable": 165392,
	"cost": 863044,
	"name": "Product/name/jqxw6s6"
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
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 165392)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 863044)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/jqxw6s6')
        })
    
        
        it('one Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":785985,"cost":567710,"name":"Product/name/s6odlmi3"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":892238,"cost":414010,"name":"Product/name/x950x84x"})
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
	"amountAvailable": 239785,
	"cost": 575180,
	"name": "Product/name/m6b9vpu"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 239785)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 575180)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/m6b9vpu')
    
        })
    
        
        it('remove Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":890357,"cost":428531,"name":"Product/name/m1kmykkk"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":579618,"cost":130214,"name":"Product/name/bv03ed4p"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":852295,"cost":606136,"name":"Product/name/e4rgpebl"})
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
	"updatedAt": "2020-10-14T22:48:22.830Z",
	"createdAt": "2020-11-21T23:11:30.007Z",
	"amountAvailable": 491969,
	"cost": 302413,
	"name": "Product/name/erf18uyp"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 491969)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 302413)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/erf18uyp')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":941499,"cost":596333,"name":"Product/name/gfoi1dqm"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":740311,"cost":57754,"name":"Product/name/y1r5xp4u"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 819277,
	"cost": 716493,
	"name": "Product/name/5moyzsoj"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 819277)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 716493)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/5moyzsoj')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":200588,"cost":636149,"name":"Product/name/cjsnzlza"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":301731,"cost":638289,"name":"Product/name/kzstyry9"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":828648,"cost":903755,"name":"Product/name/02u5eqyp"})
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