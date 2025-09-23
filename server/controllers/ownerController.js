import imagekit from "../configs/imagekit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from 'fs';

export const changeRoleToOwner = async (req, res) => {
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: 'owner'})
        res.json({success: true, message: 'Role changed to owner'})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}



//API to list car
export const addCar = async (req, res) => {
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        //upload image to imagekit
        const filebuffer = fs.readFileSync(imageFile.path);
        const response =  await imagekit.upload({
            file: filebuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        //optimization URL generation using imagekit
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {width: '1280'},
                {quality: 'auto'},
                {format: 'webp'}
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({success: true, message: 'Car added successfully'})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to list Owner Car 
export const getOwnerCars = async (req, res) => {
    try {
        
        const {_id} = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success: true, cars});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to toggle the car availability
export const toggleCarAvailablity = async (req, res) => {
     try {
        const {_id} = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'You are not authorized to toggle this car availability'})
        }

        car.isAvailable = !car.isAvailable;
        await car.save();

        res.json({success: true, message: 'Car availability toggled successfully'});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// delete a car
export const deleteCar = async (req, res) => {
     try {
        const {_id} = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'You are not authorized to toggle this car availability'})
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();

        res.json({success:true,  message: 'Car deleted successfully'});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//API to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const {_id , role} = req.user;
        if(role !== 'owner'){
            return res.json({success: false, message: 'You are not authorized to access this data'})
        }

        const cars = await Car.find({owner: _id});
        res.json({success: true, cars});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}