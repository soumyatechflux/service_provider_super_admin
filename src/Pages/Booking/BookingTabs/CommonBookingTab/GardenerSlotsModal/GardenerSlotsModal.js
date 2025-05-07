import React from 'react';
import { format } from 'date-fns';

const GardenerSlotsModal = ({ show, onClose, slots, bookingCompleteDates }) => {
  // Function to format date and time together
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return format(new Date(isoString), 'dd MMM yyyy, hh:mm a');
  };

  // Function to find matching complete dates for a slot
  const getCompleteDatesForSlot = (slotDate) => {
    if (!bookingCompleteDates) return null;
    return bookingCompleteDates.find(date => 
      format(new Date(date.reached_location), 'yyyy-MM-dd') === 
      format(new Date(slotDate.date), 'yyyy-MM-dd')
    );
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Gardener Visit Details</h5>
            <button 
              type="button" 
              className="close text-white" 
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {slots && slots.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Sr No</th>
                      <th>Visit Date</th>
                      <th>Partner Reached Date & Time</th>
                      <th>Booking Start Date & Time</th>
                      <th>Booking End Date & Time</th>
                      <th>Payment Date & Time</th>
                      {/* <th>Status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot, index) => {
                      const completeDate = getCompleteDatesForSlot(slot);
                      const isCompleted = !!completeDate;
                      const isMissed = !isCompleted && new Date(slot.date) < new Date();
                      
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{format(new Date(slot.date), 'dd MMM yyyy')}</td>
                          <td>
                            {completeDate?.reached_location ? 
                              formatDateTime(completeDate.reached_location) : 
                              `${format(new Date(slot.date), 'dd MMM yyyy')}, N/A`}
                          </td>
                          <td>
                            {completeDate?.start_job ? 
                              formatDateTime(completeDate.start_job) : 'N/A'}
                          </td>
                          <td>
                            {completeDate?.end_job ? 
                              formatDateTime(completeDate.end_job) : 'N/A'}
                          </td>
                          <td>
                            {completeDate?.payment ? 
                              formatDateTime(completeDate.payment) : 'N/A'}
                          </td>
                          {/* <td>
                            <span className={`badge ${
                              isCompleted ? 'badge-success' : 
                              isMissed ? 'badge-danger' : 'badge-info'
                            }`}>
                              {isCompleted ? 'Completed' : 
                               isMissed ? 'Missed' : 'Pending'}
                            </span>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                No visit slots scheduled for this booking.
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenerSlotsModal;