import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { LOGIN } from "../queries";

const LoginForm = ({ show, setToken, setError, setPage }) => {
	
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const client = useApolloClient()

  const [ login ] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-app-user-token', token)
      await client.resetStore()
			setPage('authors')
    },
    onError: (error) => {
      setError(`login failed: ${error.message}`)
    }
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

	if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password <input
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
