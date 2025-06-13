import { useState } from "react";
import { supabase } from "../services/auth-service";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({email, password});
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Login successful! Redirecting to your account.");
      navigate("/todo");
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in</p>
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className={"button block"} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Start</span>}
            </button>
          </div>
        </form>
        <div className="row">
          <div className="col-12">
            <p className="text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="link">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
