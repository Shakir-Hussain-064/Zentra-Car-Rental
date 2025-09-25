import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
 

const CarDetails = () => {

  const {id} = useParams()
 
  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, fetchCars} = useAppContext()
  
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const currency = import.meta.env.VITE_CURRENCY

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!car) {
      toast.error('Car data not loaded')
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates')
      return;
    }
    try {
      const {data} = await axios.post('/api/booking/create', {car: id, pickupDate, returnDate})
      if(data.success){
        toast.success(data.message)
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      } 
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    const loadCarData = async () => {
      setLoading(true)
      setCar(null) // Reset car data
      
      if (cars.length > 0) {
        const foundCar = cars.find(car => car._id === id)
        console.log('Found car:', foundCar) // Debug log
        setCar(foundCar || null)
        setLoading(false)
      } else {
        // Fetch cars if not already loaded
        try {
          console.log('Fetching cars...') // Debug log
          await fetchCars()
        } catch (error) {
          console.error('Error fetching cars:', error)
          setLoading(false)
        }
      }
    }
    
    if (id) {
      loadCarData()
    }
  },[id, fetchCars])

  // Additional effect to handle car selection after cars are fetched
  useEffect(() => {
    if (cars.length > 0 && id) {
      const foundCar = cars.find(car => car._id === id)
      setCar(foundCar || null)
      setLoading(false)
    }
  }, [cars, id])

  if (loading) {
    return <Loader />
  }

  if (!car) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Car Not Found</h2>
        <p className='text-gray-600 mb-6'>The car you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/cars')} 
          className='bg-primary hover:bg-primary-dull transition-all py-3 px-6 font-medium text-white rounded-xl'
        >
          Browse All Cars
        </button>
      </div>
    )
  }

  // Additional safety check to ensure car has all required properties
  if (!car.pricePerDay || !car.brand || !car.model) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Invalid Car Data</h2>
        <p className='text-gray-600 mb-6'>The car data is incomplete or corrupted.</p>
        <button 
          onClick={() => navigate('/cars')} 
          className='bg-primary hover:bg-primary-dull transition-all py-3 px-6 font-medium text-white rounded-xl'
        >
          Browse All Cars
        </button>
      </div>
    )
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 '>

      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
        Back to all Cars.
      </button>  


      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'> 
          {/* Car Image and Details*/ }
          <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className='lg:col-span-2 '>
            <motion.img
            initial={{scale: 0.98, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{duration: 0.5}}
            src={car?.image || ''} alt='' className='w-full h-auto md:h-100 object-cover rounded-xl mb-6 shadow-md' />
            <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1,}}
            transition={{duration: 0.5, delay: 0.2}}
            className='space-y-6' >
                <div>
                  <h1 className='text-3xl font-bold' >{car?.brand || ''} {car?.model || ''}</h1>
                  <p className='text-gray-500 text-lg'> {car?.category || ''} {car?.year || ''} </p>
                </div>
                <hr className=' border borderColor my-6' />
 
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4' > 
                  {[
                    {icon: assets.users_icon, text: `${car?.seating_capacity || 0} Seats`},
                    {icon: assets.fuel_icon, text:  car?.fuel_type || ''},
                    {icon: assets.car_icon, text:  car?.transmission || ''},
                    {icon: assets.location_icon, text:  car?.location || ''},
                  ].map(({icon, text}) => (
                    <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4}}
                    key={text} className='flex flex-col items-center bg-light  p-4 rounded-lg' >
                      <img src={icon} alt='' className='h-5 mb-2 '/>
                      {text}  
                    </motion.div>
                  ))}
                </div>

              {/* Description  */}
              <div className='space-y-4' >
                  <h1 className='text-xl font-medium mb-3' > Description </h1>
                  <p className='text-gray-500'> {car?.description || 'No description available'} </p>
              </div>

              {/*Features */}
              <div className='' >
                  <h1 className='text-xl font-medium mb-3' > Features </h1>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2' >
                      {
                        ['360 Camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear View Mirror'].map((item)=>(
                          <li key={item} className='flex items-center text-gray-500' >
                            <img src={assets.check_icon} className='h-4 mr-2' alt="" />
                            {item}
                          </li>
                        ))
                      }
                  </ul>

              </div>

            </motion.div>
          </motion.div>


          {/* Right Booking Form  */}
            <motion.form
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.3}}
            onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500' >
              
              <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'> {currency} {car?.pricePerDay || 0} <span className='text-base text-gray-400 font-normal'> per day </span> </p>

              <hr className=' border borderColor my-6 ' />

              <div className='flex flex-col gap-2' >
                <label htmlFor="pickup-date"> Pick-up Date </label>
                <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} type="date"  className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split("T")[0]}/>
              </div>

              <div className='flex flex-col gap-2' >
                <label htmlFor="return-date"> Return Date </label>
                <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)} type="date"  className='border border-borderColor px-3 py-2 rounded-lg' required id='return-date'/>
              </div>

              <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer' >Book Now</button>
                  
              <p className='text-center text-sm'>
                No credit card required to reserve.
              </p>

            </motion.form>
      </div>

      
    </div>
  )
}

export default CarDetails