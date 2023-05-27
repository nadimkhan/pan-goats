import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';



type FormData = {
  email: string;
  password: string;
  role: string;
};

const SignUpForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
 // inside SignUpForm
const [loading, setLoading] = useState(false);
const [serverMessage, setServerMessage] = useState('');

const onSubmit = (formData: FormData) => {
  console.log(formData);
  setLoading(true);
  axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
    email: formData.email,
    password: formData.password,
    role: formData.role
  })
  .then((res) => {
    console.log(res.data);
    setLoading(false);
    setServerMessage("Registration successful! Please sign in.");
  })
  .catch((err) => {
    console.log(err.response.data);
    setLoading(false);
    // set error message here
    setServerMessage(err.response.data.message || 'An error occurred');
  });
};

  
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className={`shadow appearance-none border ${errors.email && 'border-red-500'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="email"
          type="email"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-red-500 text-xs italic">Please enter an email.</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className={`shadow appearance-none border ${errors.password && 'border-red-500'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="password"
          type="password"
          {...register("password", { required: true, minLength: 8, pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/ })}
        />
        {errors.password && <p className="text-red-500 text-xs italic">Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
          Role
        </label>
        <select
          className={`shadow appearance-none border ${errors.role && 'border-red-500'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="role"
          {...register("role", { required: true })}
        >
          <option value="">Select...</option>
          <option value="Admin">Administrator</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs italic">Please select a role.</p>}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
      <p>{serverMessage}</p>
      {loading ? (
          <div className="flex justify-center">
            <div className="spinner" />
          </div>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign Up"}
          </button>


        )}
      </div>
    </form>
  );
};

export default SignUpForm;
