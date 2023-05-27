import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'; // New import
Modal.setAppElement('#root'); // Important for accessibility

interface Vendor {
  _id: string;
  vendorId: string;
  vendorName: string;
  vendorAddress: string;
  contactName: string;
  contactNumber: string;
  rating: string;
}

const Vendors: React.FC = () => {
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorAddress, setVendorAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [rating, setRating] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [editedVendor, setEditedVendor] = useState<Vendor | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);


  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/vendors`, {
        vendorId, vendorName, vendorAddress, contactName, contactNumber, rating
      });
      setMessage({ type: 'success', text: response.data.message });
      setLoading(false);

      setVendorId('');
      setVendorName('');
      setVendorAddress('');
      setContactName('');
      setContactNumber('');
      setRating('');
      setTimeout(() => {
        setMessage(null); // use null instead of ''
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const responseData = axiosError.response as { data: { message: string } };
         // alert(responseData.data.message);
          setMessage({type: 'error', text: responseData.data.message});
          setTimeout(() => {
            setMessage(null); // use null instead of ''
          }, 3000);
        } else {
          setMessage({type: 'error', text:'An error occurred while trying to create breed'});
          setTimeout(() => {
            setMessage(null); // use null instead of ''
          }, 3000);
        }
      } 
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null); // use null instead of ''
      }, 3000);
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    setMessage(null);
  
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/vendors/${id}`);
  
      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Vendor deleted successfully.' });
        // Fetch medicines again to reflect the deletion in the UI
        await fetchVendors();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage({ type: 'error', text: error.response.data.message });
        } else {
          setMessage({ type: 'error', text: 'An error occurred while trying to delete the vendor.' });
        }
      } else {
        setMessage({ type: 'error', text: 'An unknown error occurred.' });
      }
    } finally {
      setIsProcessing(false);
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editedVendor) return;

    // Start spinner
    setIsProcessing(true);

    try {
        // Send update request to the server
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/vendors/${editedVendor._id}`, editedVendor);

        if (response.status === 200) {
            // Update successful, set message
            setMessage({type: 'success', text: 'Vendor updated successfully.'});
            
            // Refresh the medicines list
            fetchVendors();
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Update failed, set message
                setMessage({type: 'error', text: error.response.data.message});
            } else {
                setMessage({type: 'error', text: 'An error occurred while trying to update the vendor.'});
            }
        }
    } finally {
        // Stop spinner and close modal
        setIsProcessing(false);
        setIsModalOpen(false);

        // Clear message after 3 seconds
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    }
  };


  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/vendors`);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors.', error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10 space-y-4">
      {message && <div className={`fixed top-0 right-0 m-4 p-4 rounded shadow-md transition-opacity duration-500 text-center mb-4 text-white p-2 rounded ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{message.text}</div>}
      
      <div className="w-1/2 bg-gray-100 p-6 rounded-lg">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={vendorId}
              onChange={event => setVendorId(event.target.value)}
              placeholder="Vendor ID"
              required
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={vendorName}
              onChange={event => setVendorName(event.target.value)}
              placeholder="Vendor Name"
              required
            />
          </div>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={vendorAddress}
            onChange={event => setVendorAddress(event.target.value)}
            placeholder="Vendor Address"
            required
          />
          <div className="flex space-x-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={contactName}
              onChange={event => setContactName(event.target.value)}
              placeholder="Contact Name"
              required
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="tel"
              value={contactNumber}
              onChange={event => setContactNumber(event.target.value)}
              placeholder="Contact Number"
              required
            />
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={rating}
              onChange={event => setRating(event.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Create Vendor'}          
            </button>
          </div>
        </form>
      </div>
      <hr className="mb-4 w-full"/>
      <div className="w-11/12 mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2">Vendor ID</th>
              <th className="border p-2">Vendor Name</th>
              <th className="border p-2">Vendor Address</th>
              <th className="border p-2">Contact Name</th>
              <th className="border p-2">Contact Number</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor._id}>
                <td className="border p-2">{vendor.vendorId}</td>
                <td className="border p-2">{vendor.vendorName}</td>
                <td className="border p-2">{vendor.vendorAddress}</td>
                <td className="border p-2">{vendor.contactName}</td>
                <td className="border p-2">{vendor.contactNumber}</td>
                <td className="border p-2">{vendor.rating}</td>
                <td className="border p-2">
              <FontAwesomeIcon
                icon={faEdit}
                className="mr-3 cursor-pointer"
                onClick={() => handleEdit(vendor)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="cursor-pointer"
                onClick={() => handleDelete(vendor._id)}
              />
            </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)' // This will create a semi-transparent dark overlay
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      borderRadius: '4px',
      padding: '20px'
    }
  }}
>
  {editedVendor && (
    <form onSubmit={handleUpdateSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <input
          defaultValue={editedVendor.vendorId}
          onChange={event => setEditedVendor({...editedVendor, vendorId: event.target.value})}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Vendor ID"
        />
        <input
          defaultValue={editedVendor.vendorName}
          onChange={event => setEditedVendor({...editedVendor, vendorName: event.target.value})}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Vendor Name"
        />
      </div>
      <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={editedVendor.vendorAddress}
            onChange={event => setEditedVendor({...editedVendor, vendorAddress: event.target.value})}
            placeholder="Vendor Address"
          />
        <div className="flex space-x-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              defaultValue={editedVendor.contactName}
              onChange={event => setEditedVendor({...editedVendor, contactName: event.target.value})}
              placeholder="Contact Name"
            />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="tel"
              defaultValue={editedVendor.contactNumber}
              onChange={event => setEditedVendor({...editedVendor, contactNumber: event.target.value})}
              placeholder="Contact Number"
            />
          
          <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              defaultValue={editedVendor.rating}
              onChange={event => setEditedVendor({...editedVendor, rating: event.target.value})}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {isProcessing ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Update Medicine'}
      </button>
    </form>
  )}
</Modal>
    </div>
  );
};

export default Vendors;
