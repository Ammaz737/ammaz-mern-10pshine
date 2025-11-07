import {jest} from '@jest/globals';
import { login } from '../../controller/auth.controller';
import  User  from "../../models/user.model.js";  

const mockRequest = (body={})=>({body});

jest.mock("../../models/user.model.js")

const mockResponse = () =>{
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Auth Controller - Verify Email",()=>{
     it("Should return 400 if user not found", async()=>{
        const req = mockRequest({email:"",password:""});
        const res = mockResponse();;
        
        User.findOne = jest.fn().mockResolvedValue(null)
        await login (req,res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message:"Invalid email or password"
        }) 
     })
})