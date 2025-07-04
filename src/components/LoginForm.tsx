const LoginForm = () => {
    return (
        <main>
            <div className="login-and-registration-container">
                <div className="login-and-registration-form">
                    <form action="" method="">
                        <h1>Sign in</h1>
                        <div className="input-box">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="text" placeholder="Email" required />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="Password" required />
                        </div>
                        <button type="submit">Sign in</button>
                        <div className="mt-8">
                            <a href="/register" className="text-gray-400 hover:underline"><p>Don't have an account? Create one</p></a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default LoginForm