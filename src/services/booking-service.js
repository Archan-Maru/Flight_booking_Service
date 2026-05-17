const axios = require('axios');
const { BookingRepository } = require('../repositories');
const { ServerConfig } = require('../config');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const bookingRepository=new BookingRepository();

async function createBooking(data) {

    const transaction = await db.sequelize.transaction();

       try {

        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        if (data.noofSeats > flight.data.data.totalSeats) {
            throw new AppError('Required no of seats not available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = data.noofSeats * flight.data.data.price;
        
       
const bookingPayload={...data, noOfSeats: data.noofSeats, totalCost:totalBillingAmount};

        
        const booking = await bookingRepository.createBooking(bookingPayload, transaction);


        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats:data.noofSeats
        })

        await transaction.commit();
        return booking;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }


}

module.exports = {
    createBooking
}