import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'; // New import
Modal.setAppElement('#root'); // Important for accessibility

interface Medicine {
  _id: string;
  medicineId: string;
  medicineName: string;
  availability: string;
}

const Medicines: React.FC = () => {
  const [medicineId, setMedicineId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [availability, setAvailability] = useState('Yes');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedMedicine, setEditedMedicine] = useState<Medicine | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/medicines`, {
        medicineId, medicineName, availability
      });

      if (response.status === 201) {
        setMessage({ type: 'success', text: response.data.message });
        setMedicineId('');
        setMedicineName('');
        setAvailability('');
      } 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage({type: 'error', text: error.response.data.message});
        } else {
          setMessage({type: 'error', text:'An error occurred while trying to add the medicine'});
        }
      } 
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    setMessage(null);
  
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/medicines/${id}`);
  
      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Medicine deleted successfully.' });
        // Fetch medicines again to reflect the deletion in the UI
        await fetchMedicines();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage({ type: 'error', text: error.response.data.message });
        } else {
          setMessage({ type: 'error', text: 'An error occurred while trying to delete the medicine.' });
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

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editedMedicine) return;

    // Start spinner
    setIsProcessing(true);

    try {
        // Send update request to the server
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/medicines/${editedMedicine._id}`, editedMedicine);

        if (response.status === 200) {
            // Update successful, set message
            setMessage({type: 'success', text: 'Medicine updated successfully.'});
            
            // Refresh the medicines list
            fetchMedicines();
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Update failed, set message
                setMessage({type: 'error', text: error.response.data.message});
            } else {
                setMessage({type: 'error', text: 'An error occurred while trying to update the medicine.'});
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

  
  const handleEdit = (medicine: Medicine) => {
    setEditedMedicine(medicine);
    setIsModalOpen(true);
  };
  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/medicines`);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines.', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-10 space-y-4">
      {message && <div className={`fixed top-0 right-0 m-4 p-4 rounded shadow-md transition-opacity duration-500 text-center mb-4 text-white p-2 rounded ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{message.text}</div>}
      
      <div className="w-1/2 bg-gray-100 p-6 rounded-lg">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={medicineId}
            onChange={event => setMedicineId(event.target.value)}
            placeholder="Medicine ID"
            required
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={medicineName}
            onChange={event => setMedicineName(event.target.value)}
            placeholder="Medicine Name"
            required
          />
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={availability}
            onChange={event => setAvailability(event.target.value)}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <div className="flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Create Medicine'}          
            </button>
          </div>
        </form>
      </div>
      <hr className="mb-4 w-full"/>
      <div className="w-11/12 mt-4">
      <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="border p-2">Medicine ID</th>
          <th className="border p-2">Medicine Name</th>
          <th className="border p-2">Availability</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {medicines.map(medicine => (
          <tr key={medicine._id}>
            <td className="border p-2">{medicine.medicineId}</td>
            <td className="border p-2">{medicine.medicineName}</td>
            <td className="border p-2">{medicine.availability}</td>
            <td className="border p-2">
              <FontAwesomeIcon
                icon={faEdit}
                className="mr-3 cursor-pointer"
                onClick={() => handleEdit(medicine)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="cursor-pointer"
                onClick={() => handleDelete(medicine._id)}
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
  {editedMedicine && (
    <form onSubmit={handleUpdateSubmit} className="space-y-4">
      <input
        defaultValue={editedMedicine.medicineId}
        onChange={event => setEditedMedicine({...editedMedicine, medicineId: event.target.value})}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Medicine ID"
      />
      <input
        defaultValue={editedMedicine.medicineName}
        onChange={event => setEditedMedicine({...editedMedicine, medicineName: event.target.value})}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Medicine Name"
      />
      <select
        defaultValue={editedMedicine.availability}
        onChange={event => setEditedMedicine({...editedMedicine, availability: event.target.value})}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {isProcessing ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Update Medicine'}
      </button>
    </form>
  )}
</Modal>

    </div>
  );
};

export default Medicines;
