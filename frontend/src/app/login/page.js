import LoginForm from '../components/UI/LoginForm'
import { PublicRoute } from '../components/UI/PublicRoute'

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="login-page">
        <LoginForm />
      </div>
    </PublicRoute>
  )
}