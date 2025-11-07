import {jest} from "@jest/globals";
import { checkAuth } from "../../controller/auth.controller.js";
import  User  from "../../models/user.model.js";  


const mockRequest = (body = {}, params = {}, userId = "123") => ({ body, params, userId });


jest.mock("../../models/user.model.js")

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Auth Controller - Check Auth ", ()=>{
    it("shiould return 400 if User not found", async()=>{
        const req = mockRequest({}, {}, "123");

        const res = mockResponse();

        User.findById = jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
        await checkAuth(req,res);


        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success:false,
            message:"User not found"});
    });
});