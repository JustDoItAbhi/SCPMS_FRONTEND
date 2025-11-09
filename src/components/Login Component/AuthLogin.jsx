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
        console.log("LOGIN RESPONSE ", response);

        if (response && response.token) {
            console.log("Login successful, redirecting...", response);

            const userData = JSON.parse(localStorage.getItem('user'));
            console.log("USER DATA FROM LOCALSTORAGE:", userData);
            
            if (userData && userData.id) {
                const userId = userData.id;
                localStorage.setItem("userId", userId);

                console.log("🔍 Before GetUserById call, userId:", userId);
                
                try {
                    const getUser = await GetUserById(userId);
                    console.log("🔍 FULL API RESPONSE:", getUser);

                    // ✅ SAFE ACCESS - Check if data exists before accessing
                    if (!getUser || !getUser.data) {
                        console.warn("⚠️ GetUserById returned no data");
                        // Use role from login response as fallback
                        const fallbackRole = userData.roles?.[0] || "STUDENT";
                        handleNavigation(fallbackRole);
                        return;
                    }

                    console.log("🔍 rolesList exists:", !!getUser?.data?.rolesList);
                    console.log("🔍 rolesList value:", getUser?.data?.rolesList);
                    
                    // ✅ SAFE ROLE EXTRACTION
                    let userRole = "STUDENT"; // Default fallback
                    
                    if (getUser.data.rolesList && getUser.data.rolesList.length > 0) {
                        const firstRole = getUser.data.rolesList[0];
                        userRole = firstRole?.roles || firstRole?.role || firstRole;
                        console.log("✅ Extracted role from rolesList:", userRole);
                    } else if (getUser.data.role) {
                        userRole = getUser.data.role;
                        console.log("✅ Using role from data.role:", userRole);
                    } else if (getUser.data.roles && getUser.data.roles.length > 0) {
                        userRole = getUser.data.roles[0];
                        console.log("✅ Using role from data.roles:", userRole);
                    } else {
                        console.warn("⚠️ No role found in response, using default STUDENT");
                    }

                    console.log("USER ROLE:", userRole);
                    handleNavigation(userRole);
                    
                } catch (apiError) {
                    console.error("❌ GetUserById API call failed:", apiError);
                    // Use role from login response as fallback
                    const fallbackRole = userData.roles?.[0] || "STUDENT";
                    console.log("🔄 Using fallback role due to API error:", fallbackRole);
                    handleNavigation(fallbackRole);
                }
            } else {
                console.error("No user data or user ID found");
                navigate("/dashboard"); // Default fallback
            }
        }
    } catch (err) {
        console.error("Login error:", err);
        setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
        setLoading(false);
    }
};

// ✅ Extract navigation logic to separate function
const handleNavigation = (userRole) => {
    const studentId = localStorage.getItem("studentId");
    console.log("🎯 Navigation - Role:", userRole, "Student ID:", studentId);
                        if (!studentId && studentId === "undefined") {
                        navigate("/STUDENTSIGNUP")
                    } else if (studentId) {
                        navigate("/Student-dashboard")
                    }
                    else {
                        if (userRole === "STUDENT") {
                            navigate("/STUDENTSIGNUP");
                        } else if (userRole === "TEACHER") {
                            try {
                                const teacherId = localStorage.getItem("teacherId");
                                const userEmail = localStorage.getItem("userEmail");

                                // If we already have teacherId, navigate to profile
                                if (teacherId) {
                                    navigate("/TEACHER-PROFILE");
                                    return; // Important to prevent further execution
                                }

                                // If no teacherId but we have email, try to get teacher data
                                if (userEmail) {
                                    const getteacherbyemail = await GetTeacherByUserEmail(userEmail);

                                    if (getteacherbyemail) {
                                        // Store the teacher ID properly
                                        localStorage.setItem("teacherId", getteacherbyemail);
                                        navigate("/TEACHER-PROFILE");
                                    } else {
                                        // Teacher not found, need to sign up
                                        navigate("/TEACHERSIGNUP");
                                    }
                                } else {
                                    // No email found, need to sign up
                                    navigate("/TEACHERSIGNUP");
                                }
                            } catch (error) {
                                console.error("Error fetching teacher data:", error);
                                // On error, redirect to signup
                                navigate("/TEACHERSIGNUP");
                            }
                        }
                    }
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