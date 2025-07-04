const RegistrationForm = () => {
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
                            <label htmlFor="first-name">First name</label>
                            <input id="first-name" type="text" placeholder="First name" required />
                        </div>
                        <div className="input-box">
                            <label htmlFor="last-name">Last name</label>
                            <input id="last-name" type="text" placeholder="Last name" required />
                        </div>
                        <div className="input-box">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="Password" required />
                        </div>
                        <div className="input-box">
                            <label htmlFor="confirm-password">Confirm password</label>
                            <input id="confirm-password" type="password" placeholder="Confirm password" required />
                        </div>
                        <div className="flex flex-col w-full mt-6">
                            <label>Who are you?</label>
                            <label>
                                <input type="radio" name="role" className="accent-[#8C47F6]" defaultChecked/>
                                <span className="pl-2">Student</span>
                            </label>
                            <label>
                                <input type="radio" name="role" className="accent-[#8C47F6]" />
                                <span className="pl-2">Teacher</span>
                            </label>
                        </div>
                        <button type="submit">Register</button>
                        <div className="mt-8">
                            <a href="/login" className="text-gray-400 hover:underline"><p>Already have an account? Sign in</p></a>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default RegistrationForm