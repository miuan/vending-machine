import { RequestError, UnauthorizedError } from "../gen/api-utils";

const ALLOWED_DEPOSIT_ADD = [5, 10, 20, 50, 100].sort((a, b) => b - a);
/**
 *
 * @swagger
 *
 * /api/deposit:
 *   post:
 *     summary: "Rest API deposit user"
 *     consumes:
 *       - application/json
 *     parameters:
 *        - in: body
 *          name: deposit
 *          description: The user to create.
 *          schema:
 *            type: object
 *            required:
 *              - deposit
 *            properties:
 *                     deposit:          # <!--- form field name
 *                       type: number
 *
 *     responses:
 *       '200':
 *         description: "Deposit succesfully allocated to user"
 *       '400':
 *         description: "Wrong deposit value"
 *       '401':
 *         description: "Unauthorized"
 *
 *
 *
 * responses:
 *  401:
 *    description: Authorization information is missing or invalid.
 *
 */
export const deposit = (entry) => async (ctx) => {
  const userId = ctx.state?.user?.id;

  if (!userId) throw new UnauthorizedError();

  const deposit = ctx.request.body.deposit;
  if (!ALLOWED_DEPOSIT_ADD.includes(deposit))
    throw new RequestError(`Allowed deposit adding is ${ALLOWED_DEPOSIT_ADD} current value is: '${deposit}'`);

  const user = await entry.models.user.findById(userId);

  user.deposit = user.deposit + deposit;

  await user.save();

  ctx.body = { deposit: user.deposit, user };
};

/**
 *
 * @swagger
 *
 * /api/reset:
 *   post:
 *     summary: "Rest API reset deposti for user"
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: "Deposit succesfully reset to user"
 *       '401':
 *         description: "Unauthorized"
 *
 *
 *
 * responses:
 *  401:
 *    description: Authorization information is missing or invalid.
 *
 */
export const reset = (entry) => async (ctx) => {
  const userId = ctx.state?.user?.id;

  if (!userId) throw new UnauthorizedError();

  const user = await entry.models.user.findById(userId);

  let change = null;
  if (user.deposit) {
    let currentDeposit = user.deposit;
    change = {};

    for (const coinValue of ALLOWED_DEPOSIT_ADD) {
      if (coinValue <= currentDeposit) {
        // take max coins in this coinValue
        const coinsCount = Math.floor(currentDeposit / coinValue);
        change[coinValue] = coinsCount;

        // update current deposit and chceck if is already empty
        currentDeposit -= coinValue * coinsCount;
        if (!currentDeposit) break;
      }
    }

    // clear deposit & save user
    user.deposit = 0;
    await user.save();
  }

  ctx.body = { deposit: user.deposit, user, change };
};

/**
 *
 * @swagger
 *
 * /api/buy:
 *   post:
 *     summary: "Rest API buy product for user"
 *     consumes:
 *       - application/json
 *     parameters:
 *        - in: body
 *          name: deposit
 *          description: The user to create.
 *          schema:
 *            type: object
 *            required:
 *              - deposit
 *            properties:
 *                     productId:          # <!--- form field name
 *                       type: number
 *     responses:
 *       '200':
 *         description: "Deposit succesfully reset to user"
 *       '401':
 *         description: "Unauthorized"
 *
 *
 *
 * responses:
 *  401:
 *    description: Authorization information is missing or invalid.
 *
 */
export const buy = (entry) => async (ctx) => {
  const userId = ctx.state?.user?.id;

  if (!userId) throw new UnauthorizedError();

  const productId = ctx.request.body.productId;
  if (!productId) throw new RequestError(`Missing required field \`productId\``);

  const product = await entry.models.product.findById(productId);
  if (!product) throw new RequestError(`Product with id \`productId\` not found`);
  if (product.amountAvailable < 1) throw new RequestError(`Product with id productId:\`${productId}\` is not available`);

  const user = await entry.models.user.findById(userId);
  if (user.deposit < product.cost)
    throw new RequestError(`Product with id \`productId\` have cost (${product.cost}) higher than user deposit (${user.deposit})`);

  const amountAvailableBackup = product.amountAvailable;
  const userDepositBackup = user.deposit;
  try {
    product.amountAvailable = amountAvailableBackup - 1;
    user.deposit = userDepositBackup - product.cost;
    await product.save();
    await user.save();
  } catch (ex) {
    // backup operation
    await entry.models.user.findByIdAndUpdate(userId, { $set: { deposit: userDepositBackup } });
    await entry.models.product.findByIdAndUpdate(productId, { $set: { amountAvailable: amountAvailableBackup } });
    throw ex;
  }

  ctx.body = { deposit: user.deposit, product };
};

export const registerVendingApi = (apiRouter, entry) => {
  apiRouter.post("/deposit", deposit(entry));
  apiRouter.post("/reset", reset(entry));
  apiRouter.post("/buy", buy(entry));
};
