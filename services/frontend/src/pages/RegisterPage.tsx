import { useState } from 'react'
import { register } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Link ,useNavigate } from 'react-router-dom'


export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate= useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await register({ email, password })
      console.log('token:', response.access_token)
      navigate('/login')

    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { detail: string } } }
        setError(axiosError.response.data.detail)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }finally {
        setLoading(false)
      }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-center px-16">
        <h1 className="text-5xl font-bold text-white mb-4">DARA</h1>
        <p className="text-xl text-slate-300 mb-6">
          Your documents. Your knowledge. Always cited.
        </p>
        <p className="text-slate-400 text-base leading-relaxed">
          Upload your research papers, contracts, or runbooks and get 
          AI-powered answers that cite their sources — built for teams 
          who need to trust their answers.
        </p>
      </div>

      {/* Right side - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8">
        <Card className="w-full max-w-md p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">Create an account</h2>
            <p className="text-slate-500 mt-1">Sign up for a new DARA account</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
} 