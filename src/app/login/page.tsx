'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

declare global {
  interface Window {
    Swal: any;
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        if (typeof window !== 'undefined' && window.Swal) {
          window.Swal.fire({
            title: "Berhasil!",
            text: "Login berhasil!",
            icon: "success",
            confirmButtonText: "Ok"
          }).then(() => {
            router.push('/dashboard')
          })
        }
      } else {
        if (typeof window !== 'undefined' && window.Swal) {
          window.Swal.fire({
            title: "Error",
            text: result.message || "Login gagal!",
            icon: "error",
            confirmButtonText: "Ok"
          })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan sistem!",
          icon: "error",
          confirmButtonText: "Ok"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">
      <div className="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-poppins p-6 md:p-12 lg:p-16">
        
        {/* Header */}
        <div className="h-fit w-full mb-6 flex items-center">
          <Link href="/welcome" className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition">
            <i className="fa-solid fa-caret-left"></i>
          </Link>
        </div>

        <div className="w-full flex-1 flex flex-wrap gap-4 justify-center">
          
          <div className="flex-1 p-5 rounded-lg flex flex-col items-center gap-2 font-roboto max-w-md">
            
            <Image 
              src="/images/favicon.png" 
              alt="SMK Antartika 2" 
              width={80} 
              height={80} 
              className="w-20 shadow-md p-2 rounded-lg" 
            />
            <h1 className="text-3xl font-bold text-neutral-700">Masuk</h1>
            <p className="text-sm text-neutral-400 text-center">
              Masukkan email dan password untuk mengakses akun Anda
            </p>

            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                
                {/* Email */}
                <div>
                  <p className="text-neutral-400 text-sm">Email</p>
                  <div className="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                    <i className="fa-solid fa-envelope p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="flex-1 px-3 py-2 outline-none text-sm" 
                      required 
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <p className="text-neutral-400 text-sm">Password</p>
                  <div className="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                    <i className="fa-solid fa-key p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="flex-1 px-3 py-2 outline-none text-sm" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="px-3 text-neutral-500 hover:text-neutral-700"
                    >
                      <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4f5686] hover:bg-[#41466e] text-white py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-neutral-600">
                    Belum punya akun?{' '}
                    <Link href="/welcome" className="text-[#4f5686] hover:underline">
                      Daftar di sini
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-sky-800 to-sky-600 rounded-lg shadow hidden lg:flex flex-col gap-3 p-4">
            <h1 className="text-center mt-20 text-transparent stroke text-[7rem] xl:text-[12rem] font-bold">LOGIN</h1>
          </div>

        </div>
      </div>
    </section>
  )
}