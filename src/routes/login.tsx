import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getBasicUserData, login } from "../services/api";

export const Route = createFileRoute('/login')({
    component: LoginForm,
})

function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loginResult = await login(email, password);

            if (loginResult === "Unauthorized") {
                alert("Login failed: Invalid email or password.");
                return;
            }

            if (loginResult === "Forbidden") {
                router.navigate({ to: '/pending-approval' });
                return;
            }

            const getBasicUserDataResult = await getBasicUserData();        
            
            if (getBasicUserDataResult === "Unauthorized") {
                alert("Login failed: Couldn't fetch your basic data.");
                return;
            }

            router.navigate({ to: '/home' });
        }
        catch (error) {
            alert(error instanceof Error ? error.message : new Error("An unexpected error occurred"));
        }
        finally {
            setIsLoading(false);
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
                        <button type="submit" disabled={!email || !password || isLoading}>Sign in</button>
                        <div className="mt-8 flex justify-center">
                            <Link to="/registration" className="text-gray-400 hover:underline">
                                Don't have an account? Create one
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}