import { CloudantV1 } from "@ibm-cloud/cloudant";
import dotenv from "dotenv";
dotenv.config();
const service = CloudantV1.newInstance({
    serviceUrl: process.env.CLOUDANT_URL,
});

export const registerUser = async (user) => {
    const response = await service.postDocument({
        db: "users",
        document: { user },
    });
    return response.result;
};

export const authUser = async (user, res) => {
    try {
        const response = await service.postFind({
            db: "users",
            useIndex: ["_design/json-index", "getUserByEmail"],
            selector: {
                email: user.email,
            },
        });
        if (response.result.docs.length === 0) {
            return res
                .status(401)
                .json({ message: "Invalid email or password." });
        }

        const data = response.result.docs[0];

        if (data.password === user.password) {
            return res.json({
                message: "Login successful!",
                user: {
                    email: data.email,
                },
            });
        } else {
            return res
                .status(401)
                .json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Error validating user login:", error);
        res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
};
