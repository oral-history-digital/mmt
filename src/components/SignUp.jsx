export default function SignUp() {
    return (
        <section class="section">
            <h1 class="title">Sign up</h1>

            <form method="POST" action="/register">
                <div class="field">
                    <label class="label" for="username">Username</label>
                    <div class="control">
                        <input name="username" type="text" class="input"
                            id="username" required pattern="[A-Za-z0-9_-]{4,12}" />
                    </div>
                    <p class="help">
                        Your username must be 4–12 characters long, can contain letters, numbers, and the - and _ characters.
                    </p>
                </div>

                <div class="field">
                    <label class="label" for="firstNameInput">First Name</label>
                    <div class="control">
                        <input name="firstName" type="text" class="input" id="firstNameInput" />
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="lastNameInput">Last Name</label>
                    <div class="control">
                        <input name="lastName" type="text" class="input" id="lastNameInput" />
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="emailInput">Email address</label>
                    <div class="control">
                        <input name="email" type="email" class="input" id="emailInput" placeholder="Enter email" />
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="passwordInput">Password</label>
                    <div class="control">
                        <input name="password" type="password" class="input" id="passwordInput" placeholder="Password" />
                    </div>
                </div>

                <div class="field">
                    <label class="label" for="confirmPasswordInput">Confirm Password</label>
                    <div class="control">
                        <input name="confirmPassword" type="password" class="input" id="confirmPasswordInput"
                            placeholder="Re-enter your password here" />
                    </div>
                </div>

                <div class="field">
                    <button type="submit" class="button is-primary">Sign up</button>
                </div>
            </form>
        </section>
    );
}
