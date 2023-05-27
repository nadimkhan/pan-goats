import React from 'react';
import { useForm } from 'react-hook-form';
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios, { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


type FormData = {
  email: string;
  password: string;
};

const SignInForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { state, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/signin`,
        {
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        dispatch({
          type: "LOGIN",
          payload: { user: response.data.user, token: response.data.token },
        });
        // Redirect to the dashboard page after successful login
        navigate("/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      setLoading(false);
      if (axiosError.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        setErrorMessage(axiosError.message);
      } else if (axiosError.request) {
        // The request was made but no response was received
        setErrorMessage("Server is not responding. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage(axiosError.message);
      }
    }
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
          {...register("password", { required: true })}
        />
        {errors.password && <p className="text-red-500 text-xs italic">Please enter a password.</p>}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Sign In'}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;