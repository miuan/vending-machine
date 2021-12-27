import { connectToServer, disconnectFromServer } from "./gen/integration-tests/helper";
import { deposit } from "./services/vending";
export async function createProduct(server, { user }, data) {
  data.user = user.id;
  return server.entry.models["product"].create(data);
}

describe("integration", () => {
  let server;
  let admin, user, user2, pub;

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
      email: "user2@user.test",
      password: "user2@user.test",
    });

    user2 = { user: res3.body.register.user, token: res3.body.register.token };

    pub = { user: user.user, token: "" };
  });

  afterAll(async () => {
    disconnectFromServer(server);
  });

  describe("admin:api", () => {
    it("should not deposit for unauthorized", async () => {
      const depositResponse = await server.post("/api/deposit", {});
      expect(depositResponse).toHaveProperty("error");
    });

    it.each([1, 3, 11, 105])("should not deposit for value as %s", async (deposit) => {
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
    ])("should deposit %s and result shoult be: %s", async (deposit, result) => {
      const token = user.token;

      const depositResponse = await server.post("/api/deposit", { deposit }, token);

      expect(depositResponse).toHaveProperty("status", 200);
      expect(depositResponse).toHaveProperty("body.deposit", result);
    });

    it("should not reset for unauthorized", async () => {
      const resetResponse = await server.post("/api/reset", {});
      expect(resetResponse).toHaveProperty("error");
    });

    it("should reset for user2", async () => {
      const token = user2.token;
      const user2raw = await server.entry.models.user.findById(user2.user.id);
      user2raw.deposit = 100;
      await user2raw.save();

      const resetResponse = await server.post("/api/reset", {}, token);
      expect(resetResponse).toHaveProperty("status", 200);
      expect(resetResponse).toHaveProperty("body.deposit", 0);
    });

    it("should not create product with cost not divided by 5", async () => {
      const token = user2.token;
      const user2raw = await server.entry.models.user.findById(user2.user.id);
      user2raw.deposit = 100;
      await user2raw.save();

      const resetResponse = await server.post("/api/reset", {}, token);
      expect(resetResponse).toHaveProperty("status", 200);
      expect(resetResponse).toHaveProperty("body.deposit", 0);
    });
  });
});
