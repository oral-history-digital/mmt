export default function Login() {
    return (
        <section className="section">
            <h1 className="title">Login</h1>

            <form method="POST" action="/login">
                <div className="field">
                    <label className="label" for="exampleInputEmail1">Email address</label>
                    <div className="control">
                        <input name="email" type="email" className="input" id="exampleInputEmail1" placeholder="Enter email" />
                    </div>
                </div>
                <div className="field">
                    <label className="label" for="exampleInputPassword1">Password</label>
                    <div className="control">
                        <input name="password" type="password" className="input" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                </div>
                <div className="field">
                    <button type="submit" className="button is-primary">Login</button>
                </div>
            </form>
        </section>
    );
}
