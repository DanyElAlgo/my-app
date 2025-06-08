import { useState } from "react";
import { supabase } from "../services/auth-service";
import { useNavigate, Link } from "react-router";
import { AuthError } from "@supabase/supabase-js";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcopy, setPasscopy] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    if(passcopy != passcopy){
        let err = new AuthError("Passwords don't match");
        navigate("/register");
    }

    setLoading(true);
    const {error} = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Account created successfully! Redirecting to the login page.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Register</p>
        <form className="form-widget" onSubmit={handleRegister}>
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
            <input
              className="inputField"
              type="password"
              placeholder="Confirm your password"
              value={passcopy}
              required={true}
              onChange={(e) => setPasscopy(e.target.value)}
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
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
