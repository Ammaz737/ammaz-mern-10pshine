import {jest} from "@jest/globals";
import { resetPassword } from "../../controller/auth.controller.js";
import  User  from "../../models/user.model.js";  


const mockRequest = (body = {}, params = {}) => ({ body, params });

jest.mock("../../models/user.model.js")

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Auth Controller - Reset Password ", ()=>{
    it("shiould return 400 if invalid or expired password reset token", async()=>{
        const req = mockRequest(
             { newPassword: "123456" },
             { token: "fakeToken" });

        const res = mockResponse();

        User.findOne = jest.fn().mockResolvedValue(null);
        await resetPassword(req,res);


        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success:false,
            message:"Invalid or expired password reset token"});
    });
});