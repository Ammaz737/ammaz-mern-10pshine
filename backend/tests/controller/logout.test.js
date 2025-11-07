import {describe, jest , it} from '@jest/globals'
import { logout } from '../../controller/auth.controller'

const mockRequest = (body={}) => ({body})

const mockResponse = () => {
    const res = {};
    res.status=jest.fn().mockReturnValue(res);
    res.json=jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn();
    return res;
}

describe("Auth Controller - Logout",()=>{
    it("should return 400 if session not break", async()=>{
    const req = mockRequest();
    const res =mockResponse();

    await logout(req,res)

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        success: true,
        message:"Logged out successfully"
    })
})
})