
  import * as DataLoader from 'dataloader';
 
  interface IServiceDataloader {
    find(filter);
    count(param);
  }

  interface IMyDataloader extends DataLoader<{}, {}>{
    dataloader: any;
    service: IServiceDataloader;
  }
  
  const createDataloder = (service: IServiceDataloader) => {
    const params = { cacheKeyFn: key => key.toString() };
    const dataloader: IMyDataloader = new DataLoader(keys => batchFind(service, keys), params) as IMyDataloader;
  
    dataloader.dataloader = dataloader;
    dataloader.service = service;
  
    return dataloader;
  };
  
  // tslint:disable-next-line:max-line-length
  const load = async (dataloader: IMyDataloader, name: string, ctx, keys: any, loadMany: boolean) => {
    const emptyResults = loadMany ? [] : null;
  
    // nothing to load
    if (!keys || (Array.isArray(keys) && !keys.length)) {
      return emptyResults;
    }
  
    const count = await dataloader.service.count({_id:{$in:keys}});
  
    // we have to do this check if in keys only 1 item, as dataloader cannot handle it
    if (loadMany && keys.length && count === keys.length) {
      return await dataloader.dataloader.loadMany(keys);
    } else if (!loadMany && count === 1){
      return await dataloader.dataloader.load(keys);
    }
  
    // we just log the error, but we don't provide to frontend
    console.error('Not existing id: ' + keys + ' in name: ' + name);
    console.error(ctx.request.body.query);
    console.error(ctx.request.body.variables);
  
    return emptyResults;
  };
  
  const dataloaderByName = async (name: string, service: IServiceDataloader, ctx, listOfIds, loadMany) => {
    const dataloaderName = name + 'Dataloader';
  
    let dataloader;
    if (ctx.req && ctx.req[dataloaderName]){
      dataloader = ctx.req[dataloaderName];
    } else {
      dataloader = createDataloder(service);
      
      // in test with apollo-test-server is mising req
      if(!ctx.req) ctx.req = {}
      ctx.req[dataloaderName] = dataloader;
    }
  
    return await load(
      dataloader,
      name,
      ctx,
      listOfIds,
      loadMany,
    );
  };
  
  const processBatches = (keys, callback) => {
    if (Array.isArray(keys) && keys.length) {
      if (Array.isArray(keys[0]) && keys[0].length) {
        return keys.map((subKeys) => {
          return callback(subKeys);
        });
      }
  
      return callback(keys);
    }
  
    if (keys !== undefined && callback) {
      return callback(keys);
    }
  };
  
  const batchFind = async (service: IServiceDataloader, keys) => {
    // tslint:disable-next-line:ter-arrow-parens
    return processBatches(keys, async (batchKeys) => {
      const data = await service.find({_id: {$in: keys}})
      return data.map(d=>{
        d.id = d._id
        return d
      })
    });
  };
  
  
  export const generateDataloaders = (entry) => {



    entry.dataloaders['file'] = async (ctx, fileIds, loadMany) => {
      return await dataloaderByName('file', entry.models['file'], ctx, fileIds, loadMany);
    };
    

    entry.dataloaders['product'] = async (ctx, productIds, loadMany) => {
      return await dataloaderByName('product', entry.models['product'], ctx, productIds, loadMany);
    };
    

    entry.dataloaders['user'] = async (ctx, userIds, loadMany) => {
      return await dataloaderByName('user', entry.models['user'], ctx, userIds, loadMany);
    };
    

    entry.dataloaders['userRole'] = async (ctx, userRoleIds, loadMany) => {
      return await dataloaderByName('userRole', entry.models['userRole'], ctx, userRoleIds, loadMany);
    };
    }
