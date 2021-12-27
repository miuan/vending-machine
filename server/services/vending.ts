import { RequestError, UnauthorizedError } from "../gen/api-utils";

const ALLOWED_DEPOSIT_ADD = [5, 10, 20, 50, 100];
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
 * /api/deposit:
 *   post:
 *     summary: "Rest API reset deposti for user"
 *     consumes:
 *       - application/json
 *
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

  user.deposit = 0;
  await user.save();

  ctx.body = { deposit: user.deposit, user };
};

export const registerVendingApi = (apiRouter, entry) => {
  apiRouter.post("/deposit", deposit(entry));
  apiRouter.post("/reset", reset(entry));
};
