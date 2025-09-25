'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

declare global {
  interface Window {
    Swal: any;
  }
}

interface FormData {
  email: string;
  password: string;
  nama: string;
  tanggal_lahir: string;
  wa: string;
  nik: string;
}

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lemdik = searchParams.get('lemdik')

  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [waNumber, setWaNumber] = useState('')
  const [waCode, setWaCode] = useState('+62')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    nama: '',
    tanggal_lahir: '',
    wa: '',
    nik: ''
  })

  const lengthValid = password.length >= 8 && password.length <= 16
  const caseValid = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const numberValid = /\d/.test(password)
  const matchValid = password && password === confirmPassword
  const isValid = lengthValid && caseValid && numberValid && matchValid

  const updateWA = () => {
    setFormData(prev => ({ ...prev, wa: waCode + waNumber }))
  }

  useEffect(() => {
    updateWA()
  }, [waCode, waNumber])

  const goNext = () => {
    if (isValid) {
      setFormData(prev => ({ ...prev, password }))
      setStep(2)
    } else {
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Password tidak valid!",
          icon: "error",
          confirmButtonText: "Ok"
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.nama || !formData.tanggal_lahir || !formData.wa || !formData.nik) {
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Lengkapi semua data!",
          icon: "error",
          confirmButtonText: "Ok"
        })
      }
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, lemdik }),
      })

      const result = await response.json()

      if (response.ok) {
        if (typeof window !== 'undefined' && window.Swal) {
          window.Swal.fire({
            title: "Berhasil!",
            text: "Pendaftaran berhasil!",
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
            text: result.message || "Terjadi kesalahan!",
            icon: "error",
            confirmButtonText: "Ok"
          })
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan sistem!",
          icon: "error",
          confirmButtonText: "Ok"
        })
      }
    }
  }

  return (
    <section className="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">
      <div className="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-poppins p-6 md:p-12 lg:p-16">

        {/* Header */}
        <div className="h-fit w-full mb-6 flex items-center">
          <Link href="/jenjang" className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition">
            <i className="fa-solid fa-caret-left"></i>
          </Link>
        </div>

        <div className="w-full flex-1 flex flex-wrap gap-4 justify-center">

          <div className="flex-1 bg-white p-5 rounded-lg flex flex-col items-center gap-2 font-roboto">

            <Image
              src="/images/favicon.png"
              alt="SMK Antartika 2"
              width={80}
              height={80}
              className="w-20 shadow-md p-2 rounded-lg"
            />
            <h1 className="text-3xl font-bold text-neutral-700">Satu Langkah Lagi..</h1>
            <p className="text-sm text-neutral-400 text-center">
              Isilah data-data di bawah ini untuk melakukan pendaftaran akun terlebih dahulu ya! ✏️
            </p>

            <div className="w-full max-w-2xl">
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

                {/* STEP 1 */}
                {step === 1 && (
                  <div className="flex flex-col gap-2">

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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
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

                      {/* Rules */}
                      {password.length > 0 && (
                        <div className="p-3 border border-neutral-400 rounded-lg bg-[#f9f9f9] text-sm mb-2">
                          <p className="text-neutral-400 mb-2 font-semibold">Ketentuan Kata Sandi:</p>
                          <ul className="space-y-2 text-neutral-400 list-disc">
                            <li className="flex items-center justify-between">
                              <span>Minimal 8 karakter dan maksimal 16 karakter</span>
                              <i className={lengthValid ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-times text-red-500'}></i>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Gabungan huruf besar dan kecil</span>
                              <i className={caseValid ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-times text-red-500'}></i>
                            </li>
                            <li className="flex items-center justify-between">
                              <span>Minimal satu angka</span>
                              <i className={numberValid ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-times text-red-500'}></i>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                      <p className="text-neutral-400 text-sm">Konfirmasi Password</p>
                      <div className={`flex items-center border rounded-lg overflow-hidden relative ${confirmPassword && confirmPassword !== password ? 'border-red-500' : 'border-neutral-400'
                        }`}>
                        <i className="fa-solid fa-key p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="flex-1 px-3 py-2 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="px-3 text-neutral-500 hover:text-neutral-700"
                        >
                          <i className={showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}></i>
                        </button>
                        {confirmPassword && confirmPassword !== password && (
                          <i className="fa-solid fa-triangle-exclamation text-red-500 absolute right-10"></i>
                        )}
                      </div>
                    </div>

                    {/* Tombol Lanjut */}
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!isValid}
                      className="w-full bg-[#4f5686] mt-4 hover:bg-[#41466e] text-white py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Lanjut
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-4">

                    {/* Nama Lengkap */}
                    <div>
                      <p className="text-neutral-400 text-sm">Nama Lengkap Calon Siswa</p>
                      <div className="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                        <i className="fa-solid fa-user p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                        <input
                          type="text"
                          value={formData.nama}
                          onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                          className="flex-1 px-3 py-2 outline-none text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                      <p className="text-neutral-400 text-sm">Tanggal Lahir Calon Siswa</p>
                      <div className="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                        <i className="fa-solid fa-calendar-days p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                        <input
                          type="date"
                          value={formData.tanggal_lahir}
                          onChange={(e) => setFormData(prev => ({ ...prev, tanggal_lahir: e.target.value }))}
                          className="flex-1 px-3 py-2 outline-none text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Nomor WhatsApp */}
                    <div>
                      <p className="text-neutral-400 text-sm">Nomor WhatsApp Ortu/Wali</p>
                      <div className="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                        <select
                          value={waCode}
                          onChange={(e) => setWaCode(e.target.value)}
                          className="px-2 py-2 border-r bg-gray-50 text-lg outline-none cursor-pointer"
                        >
                          <option value="+62">🇮🇩</option>
                          <option value="+60">🇲🇾</option>
                          <option value="+65">🇸🇬</option>
                        </select>
                        <span className="px-3 py-2 border-r text-sm text-neutral-600 bg-gray-50">{waCode}</span>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm outline-none"
                          value={waNumber}
                          onChange={(e) => setWaNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          required
                        />
                      </div>
                    </div>

                    {/* NIK */}
                    <div>
                      <p className="text-neutral-400 text-sm">NIK Calon Siswa</p>
                      <div className="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                        <i className="fa-solid fa-id-card p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                        <input
                          type="text"
                          value={formData.nik}
                          onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value.replace(/[^0-9]/g, '') }))}
                          className="flex-1 px-3 py-2 outline-none text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* Tombol Daftar */}
                    <button
                      type="submit"
                      className="w-full bg-[#4f5686] hover:bg-[#41466e] text-white py-2 rounded-lg font-medium transition mt-4"
                    >
                      Daftar
                    </button>
                  </div>
                )}

              </form>
            </div>
          </div>

          <div className="flex-1 bg-gradient-to-br from-sky-800 to-sky-600 relative rounded-lg shadow hidden lg:flex flex-col gap-3 overflow-hidden">
            <h1 className="text-center mt-20 text-transparent z-[1] w-full stroke text-[7rem] xl:text-[12rem] font-bold absolute">PPDB</h1>
            <div className='text-center justify-center mt-[9rem] flex flex-col items-center xl:mt-[12rem] z-[2] w-full h-fit text-white text-[1rem] xl:text-[2rem]'>
              <img src="https://ppdb.telkomschools.sch.id/image/signUp/background_title.png" className='absolute w-[15rem] xl:w-[24rem]' alt="" />
              <p className='font-semibold text-xl max-w-lg'>Nama Sekolah</p>
            </div>
            <div className='w-full bg-black mt-4 relative z-[3]'>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}