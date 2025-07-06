import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from "react";
import { type UserRole } from "../types/user";
import { register } from '../services/api';

export const Route = createFileRoute('/registration')({
    component: RegistrationForm,
})

function RegistrationForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("Student");
    const [isLoading, setIsLoading] = useState(false);

    const isFormValid = (): boolean => {
        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

        if(!passwordRegex.test(password)) {
            return false;
        }

        if (password !== confirmPassword) {
            return false;
        }

        return true;
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await register({
                email,
                password,
                firstName,
                lastName,
                roleName: role,
            });

            if (result === "BadRequest") {
                alert("Registration failed: Email already in use.");
                return;
            }

            router.navigate({ to: '/pending-approval' });
        }
        catch (error) {
            alert(error instanceof Error ? error.message : new Error("An unexpected error occurred"));
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <main>
            <div className="login-and-registration-container">
                <div className="login-and-registration-form">
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>
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
                        <button type="submit" disabled={!isFormValid() || isLoading}>
                            Register
                        </button>
                        <div className="mt-8 flex justify-center">
                            <Link to="/login" className="text-gray-400 hover:underline">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
