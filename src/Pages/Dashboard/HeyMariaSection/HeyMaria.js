import React from 'react';
import './HeyMaria.css';

const data = [
  { id: 1, imgSrc: './assets/images/Dashboard/9.png', value: '9', label: 'TOTAL RESTAURANT' },
  { id: 2, imgSrc: './assets/images/Dashboard/2k.png', value: '2K', label: 'TOTAL REVENUE' },
  { id: 3, imgSrc: './assets/images/Dashboard/3.png', value: '3', label: 'TOTAL GUEST ORDERS' },
  { id: 4, imgSrc: './assets/images/Dashboard/10.png', value: '10', label: 'OUR TOTAL CLIENT' }
];

const HeyMaria = () => {
  return (
    <div className='container p-3'>
      <p>
        <span className='Head_Text-HeyMaria'>  Hey Mariana-</span>
        <span className='Sub_Text-HeyMaria'>  here's what's happening with your Restaurant today</span>
      </p>
      <div className='row Main_TotalMenu_HeyMaria mt-4'>
        {data.map((item) => (
          <div key={item.id} className='col-12 col-md-3'>
            <div className='container TotalMenu_HeyMaria'>
              <div className='row'>
                <div className='col-6 col-md-3'>
                  <img src={item.imgSrc} alt={item.label} />
                </div>
                <div className='col-6 col-md-9'>
                  <div className='container mt-2 SubMenu_HeyMaria'>
                    <div className='col-12 col-md-2 value_HeyMaria'>{item.value}</div>
                    <div className='col-12 col-md-10 label_HeyMaria'>{item.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeyMaria;
