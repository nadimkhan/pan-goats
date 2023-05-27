import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal'; // New import
Modal.setAppElement('#root'); // Important for accessibility

interface Tag {
  _id: string;
  tagId: string;
  tagColor: string;
  dateOfAcquiring: string;
  status: string;
}

const Tags: React.FC = () => {
  const [tagId, setTagId] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [dateOfAcquiring, setDateOfAcquiring] = useState('');
  const [status, setStatus] = useState('Available');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTag, setEditedTag] = useState<Tag | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/tags`, { tagId, tagColor, dateOfAcquiring, status });
      console.log(response.data);
      setMessage({type: 'success', text: response.data.message});
      setTagId('');
      setTagColor('');
      setDateOfAcquiring('');
      setStatus('Available');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const responseData = axiosError.response as { data: { message: string } };
         // alert(responseData.data.message);
          setMessage({type: 'error',text: responseData.data.message});
        } else {
          setMessage({type: 'error',text:'An error occurred while trying to create breed'});
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
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/tags/${id}`);
  
      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Tag deleted successfully.' });
        // Fetch medicines again to reflect the deletion in the UI
        await fetchTags();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage({ type: 'error', text: error.response.data.message });
        } else {
          setMessage({ type: 'error', text: 'An error occurred while trying to delete the tag.' });
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
  const handleEdit = (tag: Tag) => {
    setEditedTag(tag);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editedTag) return;

    // Start spinner
    setIsProcessing(true);

    try {
        // Send update request to the server
        const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/tags/${editedTag._id}`, editedTag);

        if (response.status === 200) {
            // Update successful, set message
            setMessage({type: 'success', text: 'Tag updated successfully.'});
            
            // Refresh the medicines list
            fetchTags();
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // Update failed, set message
                setMessage({type: 'error', text: error.response.data.message});
            } else {
                setMessage({type: 'error', text: 'An error occurred while trying to update the tag.'});
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

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Error creating tag.', error);
      setMessage({type: 'error', text: 'Failed to create tag'});
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000); // clear the message after 3 seconds
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="p-4">
      {message && <div className={`fixed top-0 right-0 m-4 p-4 rounded shadow-md transition-opacity duration-500 text-center mb-4 text-white p-2 rounded ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{message.text}</div>}
      <div className="flex justify-center mt-4">
        <div className="w-1/2 bg-gray-100 p-6 rounded shadow-md">
          <form className="grid grid-cols-2 gap-4" onSubmit={handleFormSubmit}>
            <input type="text" value={tagId} onChange={event => setTagId(event.target.value)} placeholder="Tag ID" className="p-2 border border-gray-300 rounded" required />
            <input type="text" value={tagColor} onChange={event => setTagColor(event.target.value)} placeholder="Tag Color" className="p-2 border border-gray-300 rounded" required />
            <input type="date" value={dateOfAcquiring} onChange={event => setDateOfAcquiring(event.target.value)} className="p-2 border border-gray-300 rounded" required />
            <input type="text" value={status} onChange={event => setStatus(event.target.value)} placeholder="Status" className="p-2 border border-gray-300 rounded" disabled />
            <div className="col-span-2 text-right">
              <button type="submit" className="inline-block bg-blue-500 text-white px-4 py-2 rounded">
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Create Tag'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <hr className="mt-4 mb-4 w-full"/>
      <div className="w-11/12 mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border p-2">Tag ID</th>
              <th className="border p-2">Tag Color</th>
              <th className="border p-2">Acquiring Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag._id}>
                <td className="border p-2">{tag.tagId}</td>
                <td className="border p-2">{tag.tagColor}</td>
                <td className="border p-2">{tag.dateOfAcquiring}</td>
                <td className="border p-2">{tag.status}</td>
                <td className="border p-2">
              <FontAwesomeIcon
                icon={faEdit}
                className="mr-3 cursor-pointer"
                onClick={() => handleEdit(tag)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="cursor-pointer"
                onClick={() => handleDelete(tag._id)}
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
  {editedTag && (
    <form onSubmit={handleUpdateSubmit} className="space-y-4">
      <input
        defaultValue={editedTag.tagId}
        onChange={event => setEditedTag({...editedTag, tagId: event.target.value})}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Tag ID"
      />
      <input
        defaultValue={editedTag.tagColor}
        onChange={event => setEditedTag({...editedTag, tagColor: event.target.value})}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Tag Color"
      />
      <input type="date" defaultValue={editedTag.dateOfAcquiring} onChange={event => setEditedTag({...editedTag, dateOfAcquiring: event.target.value})} className="p-2 border border-gray-300 rounded" />
      <select
        defaultValue={editedTag.status}
        onChange={event => setEditedTag({...editedTag, status: event.target.value})}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="Available">Available</option>
        <option value="Used">Used</option>
      </select>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {isProcessing ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Update Tag'}
      </button>
    </form>
  )}
</Modal>
    </div>
  );
};

export default Tags;
