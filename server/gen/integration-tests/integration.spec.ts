
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
	"updatedAt": "2021-09-05T22:48:59.007Z",
	"createdAt": "2020-12-05T23:39:25.907Z",
	"amountAvailable": 436967,
	"cost": 863931,
	"name": "Product/name/c7vt6v6e"
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
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 436967)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 863931)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/c7vt6v6e')
        })
    
        
        it('one Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":643892,"cost":357480,"name":"Product/name/s8tha34a"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":85884,"cost":175329,"name":"Product/name/fk6hzuui"})
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
	"amountAvailable": 641348,
	"cost": 269072,
	"name": "Product/name/bw135ipt"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 641348)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 269072)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/bw135ipt')
    
        })
    
        
        it('remove Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":235426,"cost":440140,"name":"Product/name/kfllvnyp"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":500291,"cost":409613,"name":"Product/name/kzaqvxtk"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":35736,"cost":36238,"name":"Product/name/i9ndoty1"})
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
	"updatedAt": "2021-08-31T22:55:16.408Z",
	"createdAt": "2021-05-31T22:00:29.896Z",
	"amountAvailable": 213965,
	"cost": 256249,
	"name": "Product/name/siuqql2c"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 213965)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 256249)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/siuqql2c')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":900524,"cost":187659,"name":"Product/name/rnrcdwzp"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":683633,"cost":872181,"name":"Product/name/0b9bc3if"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 25628,
	"cost": 190937,
	"name": "Product/name/2f7kvpp4"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 25628)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 190937)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/2f7kvpp4')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = admin.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":354989,"cost":409300,"name":"Product/name/usugpugp"})
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
                const createProductResponse = await createProduct(server, admin, {"amountAvailable":132850,"cost":503522,"name":"Product/name/0x0v9nk"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, admin, {"amountAvailable":184266,"cost":71849,"name":"Product/name/r5a7t5in"})
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
	"updatedAt": "2021-01-01T23:27:14.191Z",
	"createdAt": "2021-01-19T23:00:43.339Z",
	"amountAvailable": 468599,
	"cost": 499343,
	"name": "Product/name/ez81lbp"
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
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 468599)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 499343)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/ez81lbp')
        })
    
        
        it('one Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":155565,"cost":553791,"name":"Product/name/5ym3a0dm"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":20784,"cost":852455,"name":"Product/name/7vqmx4jm"})
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
	"amountAvailable": 94187,
	"cost": 335707,
	"name": "Product/name/c1p12aq6"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 94187)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 335707)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/c1p12aq6')
    
        })
    
        
        it('remove Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":826396,"cost":178856,"name":"Product/name/hfu8ztno"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":394771,"cost":699378,"name":"Product/name/sumaaa6s"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":235667,"cost":551940,"name":"Product/name/tpuwqxsh"})
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
	"updatedAt": "2021-01-26T23:53:45.227Z",
	"createdAt": "2020-02-01T23:54:19.620Z",
	"amountAvailable": 507927,
	"cost": 528088,
	"name": "Product/name/woo5zmxt"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 507927)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 528088)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/woo5zmxt')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":381598,"cost":937881,"name":"Product/name/l60lwre"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":689695,"cost":728000,"name":"Product/name/1w63x4h2v"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 163363,
	"cost": 426524,
	"name": "Product/name/2gpj27zj"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 163363)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 426524)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/2gpj27zj')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = user.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, user, {"amountAvailable":852367,"cost":547241,"name":"Product/name/bdebidbm"})
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
                const createProductResponse = await createProduct(server, user, {"amountAvailable":718709,"cost":536035,"name":"Product/name/t1drswji"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, user, {"amountAvailable":321906,"cost":168993,"name":"Product/name/5duu98bu"})
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
	"updatedAt": "2021-12-02T23:32:33.695Z",
	"createdAt": "2021-11-04T23:52:38.452Z",
	"amountAvailable": 853546,
	"cost": 804165,
	"name": "Product/name/01ny5giu"
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
expect(createProductResponse).toHaveProperty('data.createProduct.amountAvailable', 853546)
expect(createProductResponse).toHaveProperty('data.createProduct.cost', 804165)
expect(createProductResponse).toHaveProperty('data.createProduct.name', 'Product/name/01ny5giu')
        })
    
        
        it('one Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":342304,"cost":4399,"name":"Product/name/58ob8oxg"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":174332,"cost":561422,"name":"Product/name/t5t3dlac"})
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
	"amountAvailable": 89183,
	"cost": 175006,
	"name": "Product/name/9trxshv1"
}
      }, token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('data.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('data.updateProduct.amountAvailable', 89183)
expect(updateProductResponse).toHaveProperty('data.updateProduct.cost', 175006)
expect(updateProductResponse).toHaveProperty('data.updateProduct.name', 'Product/name/9trxshv1')
    
        })
    
        
        it('remove Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":862516,"cost":954659,"name":"Product/name/761du72h"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":322372,"cost":310355,"name":"Product/name/jmpws9o"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":85353,"cost":326991,"name":"Product/name/b16seiq9"})
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
	"updatedAt": "2021-08-29T22:08:39.381Z",
	"createdAt": "2020-05-20T22:16:57.313Z",
	"amountAvailable": 316330,
	"cost": 316035,
	"name": "Product/name/e28ujlr"
}
    const createProductResponse = await server.post('/api/product', data ,token);
      
      expect(createProductResponse).not.toHaveProperty('errors')
expect(createProductResponse).toHaveProperty('body.createProduct.amountAvailable', 316330)
expect(createProductResponse).toHaveProperty('body.createProduct.cost', 316035)
expect(createProductResponse).toHaveProperty('body.createProduct.name', 'Product/name/e28ujlr')
    
        })
    
        
        it('one:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":353840,"cost":71147,"name":"Product/name/28vpd3zd"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":694498,"cost":316348,"name":"Product/name/4udu9du"})
                // createModelLine: end  
            
    const updateProductResponse = await server.put('/api/product/' + createProductResponse.id,
        {
	"id": createProductResponse.id,
	"amountAvailable": 939693,
	"cost": 226184,
	"name": "Product/name/wgis72q4"
}
      , token);

    expect(updateProductResponse).not.toHaveProperty('errors')
expect(updateProductResponse).toHaveProperty('body.updateProduct.id', createProductResponse.id)
expect(updateProductResponse).toHaveProperty('body.updateProduct.amountAvailable', 939693)
expect(updateProductResponse).toHaveProperty('body.updateProduct.cost', 226184)
expect(updateProductResponse).toHaveProperty('body.updateProduct.name', 'Product/name/wgis72q4')
    
        })
    
        
        it('remove:api Product', async()=>{
            const token = pub.token
            
                // createModelLine: start
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":56642,"cost":768804,"name":"Product/name/5muekud"})
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
                const createProductResponse = await createProduct(server, pub, {"amountAvailable":924935,"cost":434089,"name":"Product/name/yn1fghvf"})
                // createModelLine: end

                // createModelLine: start
                const createProductResponse2 = await createProduct(server, pub, {"amountAvailable":565826,"cost":85310,"name":"Product/name/0vw0fg5"})
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