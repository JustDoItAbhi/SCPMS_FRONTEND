import axios from "axios";
import axiosInstance from "../../../auth/AuthMiddleWear";
const API_BASE_URL = import.meta.env.VITE_DIRECT_BACKEND_URL 
const BASE_URL = `${API_BASE_URL}`
console.log("BACKEND API", BASE_URL);

export const StudentSendingOtpForSignUP = async (values) => {
    try {
        const sendOtp = await axiosInstance.post(`/api/user/StudentSignUp`, values);
        console.log("STUDENT OTP DATA",sendOtp.data);
        return sendOtp.data;
    } catch (err) {
        console.log(err.message);
    }
}


export const ConfimeStudentOtp = async (values) => {  

    try {

        console.log("otp values",values);


        const response = await axiosInstance.post(`/api/user/ConfirmStudentSignUp/otp`,values );

        console.log("OTP Verification Response:", response.data);
        return response.data; 

    } catch (err) {
        console.error("OTP Verification Error:", err);

        if (err.response) {
            console.error("Response status:", err.response.status);
            console.error("Response data:", err.response.data);
        } else if (err.request) {
            console.error("No response received:", err.request);
        } else {
            console.error("Error setting up request:", err.message);
        }

        const errorMessage = err.response?.data ||
            err.message ||
            "OTP verification failed";

        throw new Error(errorMessage);
    }
}