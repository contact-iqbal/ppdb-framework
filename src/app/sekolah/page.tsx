'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Sekolah {
  id: number;
  nama: string;
  alamat: string;
  telp: string;
  deskripsi: string;
  gambar: string;
  jenjang: string;
  kode_lemdik: number;
}

declare global {
  interface Window {
    Swal: any;
  }
}

export default function SekolahPage() {
  const searchParams = useSearchParams()
  const jenjang = searchParams.get('jenjang')
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([])
  const [filteredList, setFilteredList] = useState<Sekolah[]>([])
  const [selectedSekolah, setSelectedSekolah] = useState<Sekolah | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (jenjang) {
      fetchSekolah(jenjang)
    }
  }, [jenjang])

  useEffect(() => {
    const filtered = sekolahList.filter(sekolah =>
      sekolah.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredList(filtered)
  }, [searchTerm, sekolahList])

  const fetchSekolah = async (jenjang: string) => {
    try {
      const response = await fetch(`/api/sekolah?jenjang=${jenjang}`)
      const data = await response.json()
      setSekolahList(data)
      setFilteredList(data)
    } catch (error) {
      console.error('Error fetching sekolah:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSekolahSelect = (sekolah: Sekolah) => {
    setSelectedSekolah(sekolah)
  }

  const confirmSelection = (namaSekolah: string, kodeLemdik: number) => {
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin memilih " + namaSekolah + "?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, pilih",
        cancelButtonText: "Batal"
      }).then((result: any) => {
        if (result.isConfirmed) {
          window.location.href = "/signup?lemdik=" + kodeLemdik;
        }
      });
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-blue-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <section className="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">
      <div className="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-poppins p-6 md:p-12 lg:p-16">
        
        {/* Header */}
        <div className="h-fit w-full mb-6 flex flex-wrap items-center">
          <div className="flex justify-center items-center">
            <Link href="/jenjang" className="p-2 rounded-lg bg-neutral-100 transition-all hover:bg-neutral-200">
              <i className="fa-solid fa-caret-left"></i>
            </Link>
          </div>
          <div className="flex-1 text-start md:text-center ml-2 md:ml-0 mt-2 md:mt-0">
            <h1 className="font-semibold text-lg md:text-2xl font-[arial] leading-none">
              Silahkan pilih sekolah sesuai Keinginanmu
            </h1>
            <p className="text-xs mt-2 text-neutral-800 md:text-sm">
              Oke, sekarang pilih sekolah yang ingin kamu daftar ya!
            </p>
          </div>
        </div>

        <div className="w-full flex-1 flex-inline lg:flex flex-wrap gap-4 justify-center mt-5">
          
          <div className="flex-1 bg-white p-5 rounded-lg shadow">
            {/* Search + List (kiri) */}
            <div className="flex flex-col bg-white rounded-lg shadow p-4 h-full">
              <div className="flex items-center border rounded-lg px-3 py-2 mb-3">
                <input 
                  type="text" 
                  placeholder="Cari Nama Sekolah..." 
                  className="flex-1 outline-none border-0 focus:ring-0 text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
              
              <div className="max-h-72 overflow-y-auto">
                <h2 className="font-bold mb-2">{jenjang}</h2>
                <ul className="space-y-2">
                  {filteredList.map((sekolah) => (
                    <li
                      key={sekolah.id}
                      className="text-gray-600 hover:text-blue-900 hover:bg-blue-100 p-1 rounded-md cursor-pointer"
                      onClick={() => handleSekolahSelect(sekolah)}
                    >
                      {sekolah.nama}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white p-5 rounded-lg shadow">
            {/* Preview (kanan) */}
            <div className="text-center text-gray-400 flex justify-center h-full">
              {selectedSekolah ? (
                <div className="w-full rounded-lg overflow-hidden font-roboto">
                  <Image 
                    src={selectedSekolah.gambar} 
                    alt={selectedSekolah.nama} 
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2 text-start text-neutral-800">{selectedSekolah.nama}</h2>
                    <hr className="my-2" />
                    <p className="flex items-center text-start gap-2 text-gray-600 text-semibold mb-1">
                      <i className="fa-solid fa-location-dot"></i> {selectedSekolah.alamat}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 text-semibold mb-4">
                      <i className="fa-solid fa-phone"></i> {selectedSekolah.telp}
                    </p>
                    <p className="text-neutral-400 mb-4 text-start">{selectedSekolah.deskripsi}</p>
                    <button 
                      onClick={() => confirmSelection(selectedSekolah.nama, selectedSekolah.kode_lemdik)}
                      className="w-full bg-indigo-900 cursor-pointer hover:bg-indigo-1000 text-white py-2 rounded-lg"
                    >
                      Pilih
                    </button>
                  </div>
                </div>
              ) : (
                <p>Pilih sekolah dari daftar untuk melihat detail</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}