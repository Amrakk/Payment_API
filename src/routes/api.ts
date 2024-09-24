import express from "express";
import * as api from "../api/index.js";
import { verify } from "../middlewares/verify.js";

const router = express.Router();

router.post("/ipn", (req, res) => {
    return res.sendStatus(204);
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
