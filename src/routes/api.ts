import express from "express";
import * as api from "../api/index.js";
import { verify } from "../middlewares/verify.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/response.js";
import { errorLogger } from "../middlewares/logger/loggers.js";
import { VNPay } from "../services/index.js";
import type { IVNPay } from "../interfaces/bankingServices/index.js";

const router = express.Router();

router.post("/ipn", (req, res) => {
    console.log(JSON.stringify(req.body, undefined, 2));
    return res.sendStatus(204);
});

router.get("/ipn", async (req, res) => {
    const { service, token, ...rest } = req.query;

    try {
        if (service === "vnpay")
            return await VNPay.paymentLinkCallback(
                token as string,
                rest as unknown as IVNPay.PaymentLinkCallbackRequest,
                res
            );

        return res
            .status(409)
            .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });
    } catch (err) {
        if (err instanceof Error) errorLogger(err, req);
    }
});

router.get("/cancel", (req, res) => {
    return res.status(200).send({
        code: RESPONSE_CODE.SUCCESS,
        message: RESPONSE_MESSAGE.SUCCESS,
        data: { ...req.query },
    });
});

router.get("/return", (req, res) => {
    return res.status(200).send({
        code: RESPONSE_CODE.SUCCESS,
        message: RESPONSE_MESSAGE.SUCCESS,
        data: { ...req.query },
    });
});

router.get("/get_users", api.user.getUsers);
router.post("/create_user", api.user.createUser);

router.get("/get_user", verify, api.user.getUserById);
router.put("/update_user", verify, api.user.updateUser);
router.delete("/delete_user", verify, api.user.deleteUser);

router.get("/banks", api.getBanks);
router.post("/qr_code", api.generateQRCode);

router.post("/payment_link", verify, api.paymentLink);
router.post("/payment_link_callback", api.paymentLinkCallback);

router.post("/transaction_status", verify, api.transactionStatus);

export default router;
