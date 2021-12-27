import { connectToServer, disconnectFromServer } from "./gen/integration-tests/helper";
import { deposit } from "./services/vending";
export async function createProduct(server, { user }, data) {
  data.user = user.id;
  return server.entry.models["product"].create(data);
}

describe("i:vending", () => {
  let server;
  let admin, user, seller, pub;

  beforeAll(async () => {
    server = await connectToServer();

    const res = await server.post("/auth/login_v1?fields=token,refreshToken,user.id&alias=login", {
      email: "admin@admin.test",
      password: "admin@admin.test",
    });

    // expect(res).toHaveProperty('status', 200)
    expect(res).toHaveProperty("body.login.token");
    expect(res.body.login.token).toMatch(/^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/);
    expect(res).toHaveProperty("body.login.refreshToken");
    expect(res).toHaveProperty("body.login.user.id");
    expect(res).toHaveProperty("body.login.user.email", "admin@admin.test");
    // expect(res).toHaveProperty('body.login.user.roles', [{ name: 'admin' }])
    expect(res).not.toHaveProperty("errors");

    admin = res.body.login;

    const res2 = await server.post("/auth/register_v1?fields=token,refreshToken,user.id&alias=register", {
      email: "user@user.test",
      password: "user@user.test",
    });

    // expect(res).toHaveProperty('status', 200)
    expect(res2).toHaveProperty("body.register.token");
    expect(res2.body.register.token).toMatch(/^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/);
    expect(res2).toHaveProperty("body.register.refreshToken");
    expect(res2).toHaveProperty("body.register.user.id");
    expect(res2).toHaveProperty("body.register.user.email", "user@user.test");
    // expect(res).toHaveProperty('body.register.user.roles', [{ name: 'admin' }])
    expect(res2).not.toHaveProperty("errors");

    user = { user: res2.body.register.user, token: res2.body.register.token };

    const res3 = await server.post("/auth/register_v1?fields=token,refreshToken,user.id&alias=register", {
      email: "seller@user.test",
      password: "seller@user.test",
    });

    // setup seller user
    seller = { user: res3.body.register.user, token: res3.body.register.token };
    const sellerGroup = await server.entry.models.userRole.create({ name: "seller", users: [seller.user.id] });
    await server.entry.models.user.findByIdAndUpdate(seller.user.id, { $set: { roles: [sellerGroup.id] } });

    pub = { user: user.user, token: "" };
  });

  afterAll(async () => {
    disconnectFromServer(server);
  });

  it("should not deposit for unauthorized", async () => {
    const depositResponse = await server.post("/api/deposit", {});
    expect(depositResponse).toHaveProperty("error");
  });

  it.each([1, 3, 105])("should not deposit for value as %s", async (deposit) => {
    const token = user.token;

    const depositResponse = await server.post("/api/deposit", { deposit }, token);

    expect(depositResponse).toHaveProperty("error");
    //   expect(depositResponse).toHaveProperty(
    //     "body.errors",
    //     expect.arrayContaining([expect.objectContaining({ name: `Allowed deposit adding is 5,10,20,50,100 current value is:'${deposit}'` })])
    //   );
  });

  it.each([
    [5, 5],
    [10, 15],
    [20, 35],
    [50, 85],
    [100, 185],
  ])("should deposit %s and result shoult be: %s", async (deposit, depositAfter) => {
    const token = user.token;

    const depositResponse = await server.post("/api/deposit", { deposit }, token);

    expect(depositResponse).toHaveProperty("status", 200);
    expect(depositResponse).toHaveProperty("body.deposit", depositAfter);

    const userAfter = await server.entry.models.user.findById(user.user.id);
    expect(userAfter.deposit).toEqual(depositAfter);
  });

  it("should not reset for unauthorized", async () => {
    const resetResponse = await server.post("/api/reset", {});
    expect(resetResponse).toHaveProperty("error");
  });

  it("should reset for user2", async () => {
    const token = seller.token;
    const sellerraw = await server.entry.models.user.findById(seller.user.id);
    sellerraw.deposit = 100;
    await sellerraw.save();

    const userBefore = await server.entry.models.user.findById(seller.user.id);
    expect(userBefore.deposit).toEqual(100);

    const resetResponse = await server.post("/api/reset", {}, token);
    expect(resetResponse).toHaveProperty("status", 200);
    expect(resetResponse).toHaveProperty("body.deposit", 0);

    const userAfter = await server.entry.models.user.findById(seller.user.id);
    expect(userAfter.deposit).toEqual(0);
  });

  it("should not create product for not loged user", async () => {
    const resetResponse = await server.post("/api/product", { name: "1", cost: 100 });
    expect(resetResponse).toHaveProperty("status", 401);
  });

  it("should not create product for user without seller group", async () => {
    const token = user.token;
    const resetResponse = await server.post("/api/product", { name: "1", cost: 100 }, token);
    expect(resetResponse).toHaveProperty("status", 401);
  });

  it.each([1, 3, 56])("should not create product with cost not divided by 5 (%s)", async (cost) => {
    const token = seller.token;
    const createResponse = await server.post("/api/product", { name: "test product 2", cost, amountAvailable: 1 }, token);
    expect(createResponse).toHaveProperty("status", 400);
  });

  it("should create product for user with seller group", async () => {
    const token = seller.token;
    const createResponse = await server.post("/api/product", { name: "test product 1", cost: 100, amountAvailable: 1 }, token);
    expect(createResponse).toHaveProperty("status", 200);
    expect(createResponse).toHaveProperty("body.createProduct.name", "test product 1");
    expect(createResponse).toHaveProperty("body.createProduct.cost", 100);
    expect(createResponse).toHaveProperty("body.createProduct.amountAvailable", 1);
  });

  it("should not buy for not loged user", async () => {
    const product = await server.entry.models.product.create({ name: "test product 3", cost: 100, amountAvailable: 1 });
    const buyResponsee = await server.post("/api/buy", { productId: product.id });
    expect(buyResponsee).toHaveProperty("status", 401);
  });

  it("should not buy for user with low deposit", async () => {
    const product = await server.entry.models.product.create({ name: "test product 4", cost: 100, amountAvailable: 1 });

    const buyer1 = (
      await server.post("/auth/register_v1?fields=token,refreshToken,user.id&alias=register", {
        email: "byer1@user.test",
        password: "buyer1@user.test",
      })
    ).body.register;

    await server.entry.models.user.findByIdAndUpdate(buyer1.user.id, { $set: { deposit: 10 } });

    const buyResponsee = await server.post("/api/buy", { productId: product.id }, buyer1.token);
    expect(buyResponsee).toHaveProperty("status", 400);
    expect(buyResponsee).toHaveProperty("body.errors");
    expect(buyResponsee.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Product with id `productId` have cost (100) higher than user deposit (10)" })])
    );
  });

  it.each([
    [100, 1, 0, 0],
    [100, 10000, 0, 9999],
    [5000000, 1, 4999900, 0],
    [5000000, 10000, 4999900, 9999],
  ])("should buy product with cost: 100 for user with deposit: %s and amountAvailable:%s ", async (deposit, amountAvailable, dAfter, aaAfter) => {
    const product = await server.entry.models.product.create({ name: `test product 4-${deposit}-${amountAvailable}`, cost: 100, amountAvailable });

    const buyer2X = (
      await server.post("/auth/register_v1?fields=token,refreshToken,user.id&alias=register", {
        email: `buyer2.${deposit}.${amountAvailable}@user.test`,
        password: "buyer2@user.test",
      })
    ).body.register;

    await server.entry.models.user.findByIdAndUpdate(buyer2X.user.id, { $set: { deposit } });

    const buyResponsee = await server.post("/api/buy", { productId: product.id }, buyer2X.token);
    expect(buyResponsee).toHaveProperty("status", 200);
    expect(buyResponsee).toHaveProperty("body.product.id", product.id);
    expect(buyResponsee).toHaveProperty("body.product.amountAvailable", aaAfter);
    expect(buyResponsee).toHaveProperty("body.deposit", dAfter);

    const userAfter = await server.entry.models.user.findById(buyer2X.user.id);
    expect(userAfter.deposit).toEqual(dAfter);

    const productAfter = await server.entry.models.product.findById(product.id);
    expect(productAfter.amountAvailable).toEqual(aaAfter);
  });

  it.each([100, 500000])("should not buy for product with cost:100 amountAvailable:0 and enough user deposit: %s", async (deposit) => {
    const product = await server.entry.models.product.create({ name: `test product 5-${deposit}`, cost: 100, amountAvailable: 0 });

    const buyer3X = (
      await server.post("/auth/register_v1?fields=token,refreshToken,user.id&alias=register", {
        email: `buyer3.${deposit}@user.test`,
        password: "buyer3@user.test",
      })
    ).body.register;

    await server.entry.models.user.findByIdAndUpdate(buyer3X.user.id, { $set: { deposit } });

    const buyResponsee = await server.post("/api/buy", { productId: product.id }, buyer3X.token);
    expect(buyResponsee).toHaveProperty("status", 400);
    expect(buyResponsee).toHaveProperty("body.errors");
    expect(buyResponsee.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: `Product with id productId:\`${product.id}\` is not available` })])
    );
  });
});
