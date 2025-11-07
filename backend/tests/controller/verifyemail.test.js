import {jest} from "@jest/globals";
import { verifyEmail } from "../../controller/auth.controller.js";
import  User  from "../../models/user.model.js";  


const mockRequest = (body ={}) => ({body});

jest.mock("../../models/user.model.js")

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Auth Controller - Verify Email ", ()=>{
    it("shiould return 400 if invalid or expired code is provided", async()=>{
        const req = mockRequest({code:"wrong code"});
        const res = mockResponse();

        User.findOne = jest.fn().mockResolvedValue(null);
        await verifyEmail(req,res);


        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message:"Invalid or expired verification code"});
    });
});