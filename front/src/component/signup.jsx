import { useState } from "react"
import { useSignapiMutation } from "../store/apirtk"

function Signup() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  })

  const [signup, { isLoading, error }] = useSignapiMutation()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(form).unwrap()
      alert("Signup successful")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Signup failed</p>}
    </div>
  )
}

export default Signup
