import { useState } from "react";
import { type UserRole } from "../types/user";

const RegistrationForm = () => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("Student");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        //We will handle the api call here:
        console.log("Email:", email);
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);
        console.log("Role:", role);
    }


    return (
        <main>
            <div className="login-and-registration-container">
                <div className="login-and-registration-form">
                    <form onSubmit={handleSubmit}>
                        <h1>Sign in</h1>
                        <div className="input-box">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="first-name">First name</label>
                            <input
                                id="first-name"
                                type="text"
                                placeholder="First name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="last-name">Last name</label>
                            <input
                                id="last-name"
                                type="text"
                                placeholder="Last name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-box">
                            <label htmlFor="confirm-password">Confirm password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col w-full mt-6">
                            <label>Who are you?</label>
                            <label>
                                <input
                                    type="radio"
                                    value="Student"
                                    name="role"
                                    className="accent-[#8C47F6]"
                                    checked={role === "Student"}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                />
                                <span className="pl-2">Student</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Teacher"
                                    name="role"
                                    className="accent-[#8C47F6]"
                                    checked={role === "Teacher"}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                />
                                <span className="pl-2">Teacher</span>
                            </label>
                        </div>
                        <button type="submit">Register</button>
                        <div className="mt-8">
                            <a href="#" className="text-gray-400 hover:underline">
                                <p>Already have an account? Sign in</p>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default RegistrationForm