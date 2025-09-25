import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'antartika',
  port: parseInt(process.env.DB_PORT || '3306'),
};

let connection: mysql.Connection | null = null;

export async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  return connection;
}

export async function query(sql: string, params: any[] = []) {
  const conn = await getConnection();
  try {
    const [results] = await conn.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Types
export interface Sekolah {
  id: number;
  nama: string;
  alamat: string;
  telp: string;
  deskripsi: string;
  gambar: string;
  jenjang: 'SMP' | 'SMA' | 'SMK';
  kode_lemdik: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nama: string;
  tanggal_lahir: string;
  wa: string;
  nik: string;
  created_at: string;
}