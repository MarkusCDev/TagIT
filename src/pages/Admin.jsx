import React, {useState} from 'react'
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import '../customStyles.css'

{/* 404 Admin Page */}

const GPSToggle = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#7D55C7',
    '&:hover': {
      backgroundColor: alpha('#7D55C7', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#7D55C7',
  },
}));


const Admin = () => {  

  const [bus1Toggled, setBus1Toggled] = useState(true);
  const [bus2Toggled, setBus2Toggled] = useState(false);


  const toggleBus1 = (event) => {
    setBus1Toggled(event.target.checked);
  };
  const toggleBus2 = (event) => {
    setBus2Toggled(event.target.checked);
  };

  return (
    <div className='page-container h-full'>
      <p className="mt-8 sm:mt-12 ml-6 sm:ml-0 text-black text-3xl md:text-4xl xl:text-5xl font-redHatDisplay font-bold">Admin Dashboard</p>
      <div className='page-container px-0 mb-20 w-full h-full flex sm:flex-row'>
        <div className="page-container-inner">
          <div className="mb-4 flex items-center">
            <p className="text-action text-2xl font-bold">
              Bus 1 Status
            </p>
            <div className='ml-4 bg-green-200 px-3 sm:px-5 py-1 rounded-full'>
              <p className='text-emerald-600'>Running</p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between font-medium">
            <p>Broadcast GPS:</p>
            <GPSToggle checked={bus1Toggled} onChange={toggleBus1} defaultChecked />
          </div>

          <div className="mb-4 flex items-center justify-between font-medium">
            <p>Direction:</p>
            <p className='text-action'>125th → CCNY</p>
          </div>

          <div className="flex items-center justify-between font-medium">
            <p>Battery:</p>
            <p className='text-green-600'>80%</p>
          </div>
        </div>

        <div className="page-container-inner mt-10 sm:mt-auto">
          <div className="mb-4 flex items-center">
            <p className="text-action text-2xl font-bold">
              Bus 2 Status
            </p>
            <div className='ml-4 bg-red-200 px-3 sm:px-5 py-1 rounded-full'>
              <p className='text-red-800'>Stopped</p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between font-medium">
            <p>Broadcast GPS:</p>
            <GPSToggle checked={bus2Toggled} onChange={toggleBus2} defaultChecked />
          </div>

          <div className="mb-4 flex items-center justify-between font-medium">
            <p>Direction:</p>
            <p className='text-action'>N/A</p>
          </div>

          <div className="flex items-center justify-between font-medium">
          <p>Battery:</p>
          <p className='text-red-500'>10%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin;