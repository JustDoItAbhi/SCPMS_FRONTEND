import { useId, useState } from "react";
import { useAuth } from "./UseAuth";
import { useNavigate } from "react-router-dom";
import "./AuthLoginCss.css"
import { GetTeacherByUserEmail, GetUserById } from "../apis";

const AuthLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData.email, formData.password);
            // console.log("LOGIN RESPONSE ", response);

            if (response && response.token) {
                // console.log("Login successful, redirecting...", response);

                const userData = JSON.parse(localStorage.getItem('user'));
                console.log("USER ID", userData?.id)
                const userId = userData?.id
                localStorage.setItem("userId", userId);
                console.log("email", userData.email);
                localStorage.setItem("userEmail", userData.email);

                if (userData) {
                    const userId = localStorage.getItem("userId");

                    const getUser = await GetUserById(userId);
                    console.log("userId", userId)
                    // console.log("get user from local , ", getUser.data.rolesList[0]);
                    const role = getUser.data.rolesList[0];
                    const userRole = role?.roles || role?.[0];
                    console.log("USER ROLE ", userRole);

                    if (userRole === "TEACHER") {
                        console.log("INSIDE TEACHER BLOCK ")
                        try {
                            const userEmail = localStorage.getItem("userEmail");
                            console.log("USER EMAIL FOR TEACHER ", userEmail)

                            if (userEmail) {
                                const getteacherbyemail = await GetTeacherByUserEmail(userEmail);
                                console.log("TEACHER DETAILS", getteacherbyemail)
                                if (getteacherbyemail) {
                                    console.log("TEACHER DETAILS", getteacherbyemail)
                                    localStorage.setItem("teacherId", getteacherbyemail);
                                    navigate("/TEACHER-PROFILE");
                                }
                            } else {
                                navigate("/TEACHERSIGNUP");

                            }
                        } catch (error) {
                            console.error("Error fetching teacher data:", error);
                            navigate("/TEACHERSIGNUP");
                        }
                    }
                    if (userRole == STUDENT) {
                        try {
                            const studentId = localStorage.getItem("studentId");
                            console.log("STUDENT ID", studentId);

                            if (!studentId && studentId === "undefined" || studentId == null) {
                                navigate("/STUDENTSIGNUP")

                            } else if (studentId) {
                                navigate("/Student-dashboard")
                            }


                        } catch (err) {
                            console.log("ERROR", err.message);
                        }

                    }

                }
            }

        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-links">
                    <a href="/SENDOTP">Forgot Password?</a>
                    <a href="/SEND-OPT-FOR-SIGNUP">Create Account</a>
                    {/* <a href="/">Or login with OAuth2</a> */}
                </div>
            </div>
        </div>
    );
};

export default AuthLogin;