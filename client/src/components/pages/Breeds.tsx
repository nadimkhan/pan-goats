// Breeds.tsx
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal'; // New import
Modal.setAppElement('#root'); // Important for accessibility

interface Breed {
  _id: string;
  breedId: string;
  breedName: string;
}

const Breeds: React.FC = () => {
  const [breedId, setBreedId] = useState('');
  const [breedName, setBreedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedBreed, setEditedBreed] = useState<Breed | null>(null);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/breeds`);
      setBreeds(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/breeds`, { breedId, breedName });
      console.log(response.data);
      setMessage({type: 'success',text: response.data.message});
      setBreedId('');
      setBreedName('');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const responseData = axiosError.response as { data: { message: string } };
         // alert(responseData.data.message);
          setMessage({type: 'error', text: responseData.data.message});
        } else {
          setMessage({type: 'error', text: 'An error occurred while trying to create breed'});
          
        }
      }
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    setMessage(null);
  
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/breeds/${id}`);
  
      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Breed deleted successfully.' });
        // Fetch medicines again to reflect the deletion in the UI
        await fetchBreeds();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage({ type: 'error', text: error.response.data.message });
        } else {
          setMessage({ type: 'error', text: 'An error occurred while trying to delete the breed.' });
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
  const handleEdit = (breed: Breed) => {
    setEditedBreed(breed);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      {message && <div className={`fixed top-0 right-0 m-4 p-4 rounded shadow-md transition-opacity duration-500 text-center mb-4 text-white p-2 rounded ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{message.text}</div>}
      <div className="flex justify-center mt-4">
        <div className="w-1/2 bg-gray-100 p-6 rounded shadow-md">
      <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={breedId}
          onChange={event => setBreedId(event.target.value)}
          placeholder="Breed ID"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        <input
          type="text"
          value={breedName}
          onChange={event => setBreedName(event.target.value)}
          placeholder="Breed Name"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        
        <button type="submit" className="w-full px-3 py-2 bg-blue-600 text-white rounded">
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Create Breed'}
        </button>
      </form>
      </div>
    </div>
      
      <hr className="mt-4 mb-4 w-full"/>
      <div className="w-11/12 mt-4">

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th scope="col" className="border p-2">Breed ID</th>
            <th scope="col" className="border p-2">Breed Name</th>
            <th scope="col" className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {breeds.map((breed) => (
            <tr key={breed._id}>
              <td className="border p-2">{breed.breedId}</td>
              <td className="border p-2">{breed.breedName}</td>
              <td className="border p-2">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="mr-3 cursor-pointer"
                  onClick={() => handleEdit(breed)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer"
                  onClick={() => handleDelete(breed._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      
    </div>
  );
};

export default Breeds;
