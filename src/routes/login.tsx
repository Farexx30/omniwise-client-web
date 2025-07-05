import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute('/login')({
  component: LoginForm,
})

function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        //We will handle the api call here:
        console.log("Email:", email);
        console.log("Password:", password);

        const canLogin = true; // Just for test purposes, we will use a simple boolean to simulate authentication (it will be changed later with real authentication)
        if (canLogin) {
            router.navigate({ to: '/home' });
        } 
        else {
            alert("Login failed. Check your email and password.");
        }
    };

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
                        <button type="submit">Sign in</button>
                        <div className="mt-8 flex justify-center">
                            <Link to="/registration" className="text-gray-400 hover:underline">
                                <p>Don't have an account? Create one</p>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}