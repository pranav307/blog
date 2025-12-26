import { useState } from "react"
import { useLoginapiMutation } from "../store/apirtk"

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [login, { isLoading, error }] =useLoginapiMutation()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form).unwrap()
      alert("Login successful")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Invalid credentials</p>}
    </div>
  )
}

export default Login
