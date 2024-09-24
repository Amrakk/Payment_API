import { z } from "zod";
import axios from "axios";
import { v4 } from "uuid";

import type { User, Momo, PayOS } from "../interfaces/database/user.js";

/** Refer to: {@link PayOS PayOS} */
const PayOSSchema = z.object({
    apiKey: z.string(),
    clientId: z.string(),
    checksumKey: z.string(),
});

/** Refer to: {@link Momo Momo} */
const MomoSchema = z.object({
    partnerCode: z.string(),
    accessKey: z.string(),
    secretKey: z.string(),
    publicKey: z.string().nullable(),
});

/** Refer to: {@link User User} */
export const UserSchema = (users: User[], update?: { updateUser: User }) => {
    if (update)
        return z
            .object({
                id: z.string().refine((val) => users.some((user) => user.id === val), {
                    message: "Invalid user id",
                }),
                email: z
                    .string()
                    .email()
                    .refine((val) => !users.some((user) => user.email === val && user.id !== update.updateUser.id), {
                        message: "Email already exists",
                    }),
                ipnUrl: z
                    .string()
                    .url()
                    .refine(
                        async (url) =>
                            await axios
                                .post(url)
                                .then((res) => res.status === 204)
                                .catch((_) => false),
                        {
                            message: "Invalid IPN URL or unreachable",
                        }
                    ),
                services: z.object({
                    momo: MomoSchema.optional(),
                    payos: PayOSSchema.optional(),
                }),
            })
            .strict();

    const newId = (): string => {
        const id = v4();
        return !users.some((user) => user.id === id) ? id : newId();
    };

    return z
        .object({
            id: z.string().default(newId()),
            email: z
                .string()
                .email()
                .refine((val) => !users.some((user) => user.email === val), {
                    message: "Email already exists",
                }),
            ipnUrl: z
                .string()
                .url()
                .refine(
                    async (url) =>
                        await axios
                            .post(url)
                            .then((res) => {
                                console.log(res.status);
                                return res.status === 204;
                            })
                            .catch((_) => {
                                // console.log(_);
                                console.log(4152525, url);
                                return false;
                            }),
                    {
                        message: "Invalid IPN URL or unreachable",
                    }
                ),
            services: z.object({
                momo: MomoSchema.optional(),
                payos: PayOSSchema.optional(),
            }),
        })
        .strict();
};
