import {describe, jest , it} from '@jest/globals'
import { forgotPassword } from '../../controller/auth.controller'
import User from '../../models/user.model';

const mockRequest = (body={}) => ({body})

const mockResponse = () => {
    const res = {};
    res.status=jest.fn().mockReturnValue(res);
    res.json=jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn();
    return res;
}

describe("Auth Controller - ForgotPassword",()=>{
    it("should return 400 if User not found", async()=>{
    const req = mockRequest({email:""});
    const res =mockResponse();
    
    User.findOne = jest.fn().mockResolvedValue(null);
    await forgotPassword(req,res)

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
         
        message:"User with this email does not exist"
    })
})
})