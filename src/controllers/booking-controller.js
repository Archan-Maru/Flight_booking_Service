const {BookingService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common');
const { StatusCodes } = require('http-status-codes');


async function createBooking(req,res) {
    try {
        const response=await BookingService.createBooking({
            flightId:req.body.flightId,
            userId:req.body.userId,
            noofSeats:req.body.noofSeats
        })
        SuccessResponse.data=response;
         return res.status(StatusCodes.OK).json(SuccessResponse);
         
    } catch (error) {
        ErrorResponse.error=error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json(ErrorResponse);
    }
}

module.exports={
    createBooking
}