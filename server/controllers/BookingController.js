import Booking from '../models/Booking.js';
import Car from '../models/Car.js';


//Function to check the Availability of car for a given Date 
const checkAvailability = async (car, pickUpDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickUpDate: { $lte: returnDate },
        returnDate: { $gte: pickUpDate }
    }); 
    return bookings.length === 0; // If no bookings found, car is available

}


//API to check the Availability of car for a given Date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickUpDate, returnDate } = req.body;

        //fetch all available cars for the given location
        const cars = await Car.find({ location, isAvailable: true });

        //check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickUpDate, returnDate);
            return {...car._doc, isAvailable: isAvailable};
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true);
        
        res.json({success: true, availableCars})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to create booking
export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const { car, pickupDate, returnDate } = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if(!isAvailable) {
            return res.json({success: false, message: 'Car is not available for the selected dates'});
        }

        const carData = await Car.findById(car);

        //calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)) + 1; // +1 to include both pickup and return date
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price});

        res.json({success: true, message: 'Booking created successfully'})
        

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to List User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user: _id}).populate('car').sort({createdAt: -1});
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to List Owner Bookings
export const getOwnerBookings = async (req, res) => {
   try {
        if(req.user.role !== 'owner') {
            return res.json({success: false, message: 'Only owners can access this resource'});
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car').populate('user').select('-user.password').sort({createdAt: -1});
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to change booking status
export const changeBookingStatus = async (req, res) => {
   try {
    const {_id} = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);

    if(booking.owner.toString() !== _id.toString()) {
        return res.json({success: false, message: 'You are not authorized to change the status of this booking'});
    }

    booking.status = status;
    await booking.save();

    res.json({success: true, message: 'Booking status updated successfully'})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}