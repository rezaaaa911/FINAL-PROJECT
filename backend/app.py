import os
import math
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json

app = FastAPI()

# Izinkan Frontend mengakses Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Buat folder khusus untuk menyimpan foto tabungan yang diunggah user
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount folder upload agar bisa diakses gambarnya oleh frontend lewat URL
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

DB_FILE = "portfolio_tabungan.json"

def load_db():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

# =====================================================================
# ENDPOINT 1: AMBIL DATA PORTOFOLIO + HITUNG STATISTIK GLOBAL (UPDATE!)
# =====================================================================
@app.get("/api/portofolio")
def get_portofolio():
    db = load_db()
    
    # Variabel akumulasi statistik global (Fitur Ringkasan Portofolio)
    total_likuiditas = 0  
    total_target_global = 0  
    
    for key, tabungan in db.items():
        # Hitung saldo masuk dikurangi saldo keluar
        terkumpul = sum(
            t["nominal"] if t.get("jenis", "masuk") == "masuk" else -t["nominal"]
            for t in tabungan.get("riwayat", [])
        )
        terkumpul = max(0, terkumpul)
        
        target = tabungan.get("target_sasaran", 0)
        sisa_target = max(0, target - terkumpul)
        rincian_nominal = tabungan.get("rincian_nominal", 1000)
        
        persentase = (terkumpul / target * 100) if target > 0 else 0
        if persentase > 100: persentase = 100
        
        sisa_hari = math.ceil(sisa_target / rincian_nominal) if rincian_nominal > 0 else 0
        
        # Update nilai dinamis per kartu
        db[key]["terkumpul"] = terkumpul
        db[key]["sisa_target"] = sisa_target
        db[key]["persentase"] = round(persentase, 1)
        db[key]["estimasi_hari_lagi"] = sisa_hari
        
        # Tambahkan ke total global
        total_likuiditas += terkumpul
        total_target_global += target

    # Kalkulasi data statistik global
    sisa_target_global = max(0, total_target_global - total_likuiditas)
    persentase_global = (total_likuiditas / total_target_global * 100) if total_target_global > 0 else 0
    sisa_persentase_global = max(0, 100 - persentase_global)

    return {
        "stat_global": {
            "total_likuiditas": total_likuiditas,
            "total_target_global": total_target_global,
            "sisa_target_global": sisa_target_global,
            "persentase_global": round(persentase_global, 1),
            "sisa_persentase_global": round(sisa_persentase_global, 1)
        },
        "daftar_tabungan": db
    }

# =====================================================================
# ENDPOINT 2: BUAT TABUNGAN BARU
# =====================================================================
@app.post("/api/portofolio/tambah")
async def tambah_tabungan(
    nama: str = Form(...),
    target_sasaran: int = Form(...),
    rincian_nominal: int = Form(...),
    file_foto: UploadFile = File(None)
):
    db = load_db()
    key_id = nama.lower().replace(" ", "_")
    
    if key_id in db:
        raise HTTPException(status_code=400, detail="Nama tabungan sudah ada!")
        
    foto_url = "/uploads/default.jpg"
    if file_foto:
        filename = f"{key_id}_{file_foto.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(await file_foto.read())
        foto_url = f"/uploads/{filename}"

    db[key_id] = {
        "nama": nama,
        "dibuat_pada": datetime.now().strftime("%Y-%m-%d"),
        "terakhir_diisi": "Belum ada transaksi",
        "target_sasaran": target_sasaran,
        "rincian_nominal": rincian_nominal,
        "foto": foto_url,
        "terkumpul": 0,
        "sisa_target": target_sasaran,
        "persentase": 0.0,
        "estimasi_hari_lagi": math.ceil(target_sasaran / rincian_nominal) if rincian_nominal > 0 else 0,
        "riwayat": []
    }
    
    save_db(db)
    return {"message": "Tabungan berhasil dibuat!", "id": key_id}

# =====================================================================
# ENDPOINT 3: MUTASI SALDO + MENDUKUNG CATATAN / KATEGORI (UPDATE!)
# =====================================================================
class TransaksiMutasi(BaseModel):
    nominal: int
    jenis: str # "masuk" atau "keluar"
    catatan: str = "Umum" # Menyimpan kategori/alasan pengisian atau penarikan

@app.post("/api/portofolio/{key_id}/mutasi")
def mutasi_tabungan(key_id: str, data: TransaksiMutasi):
    db = load_db()
    if key_id not in db:
        raise HTTPException(status_code=404, detail="Tabungan tidak ditemukan")
        
    if data.jenis == "keluar":
        total_sekarang = sum(
            t["nominal"] if t.get("jenis", "masuk") == "masuk" else -t["nominal"]
            for t in db[key_id].get("riwayat", [])
        )
        if total_sekarang < data.nominal:
            raise HTTPException(status_code=400, detail="Saldo tabungan tidak cukup untuk ditarik, Za!")

    transaksi_baru = {
        "id_trx": datetime.now().strftime("%Y%m%d%H%M%S"),
        "tanggal": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "nominal": data.nominal,
        "jenis": data.jenis,
        "catatan": data.catatan if data.catatan.strip() != "" else "Umum"
    }
    
    db[key_id]["riwayat"].append(transaksi_baru)
    db[key_id]["terakhir_diisi"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    save_db(db)
    return {"message": "Mutasi transaksi berhasil dicatat!"}

# =====================================================================
# ENDPOINT 4: EDIT DETAIL PORTFOLIO TABUNGAN (FITUR BARU!)
# =====================================================================
@app.post("/api/portofolio/{key_id}/edit")
async def edit_tabungan(
    key_id: str,
    nama: str = Form(...),
    target_sasaran: int = Form(...),
    rincian_nominal: int = Form(...),
    file_foto: UploadFile = File(None)
):
    db = load_db()
    if key_id not in db:
        raise HTTPException(status_code=404, detail="Tabungan tidak ditemukan")

    # Ambil data lama
    tabungan = db[key_id]
    
    # Update data teks dasar
    tabungan["nama"] = nama
    tabungan["target_sasaran"] = target_sasaran
    tabungan["rincian_nominal"] = rincian_nominal

    # Jika user mengunggah foto baru, ganti path fotonya
    if file_foto:
        filename = f"{key_id}_edited_{file_foto.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(await file_foto.read())
        tabungan["foto"] = f"/uploads/{filename}"

    # Jika nama diubah, kita sesuaikan key_id barunya agar tidak duplikat
    new_key_id = nama.lower().replace(" ", "_")
    if new_key_id != key_id:
        db[new_key_id] = tabungan
        del db[key_id]

    save_db(db)
    return {"message": "Data tabungan berhasil diperbarui!"}

# =====================================================================
# ENDPOINT 5: HAPUS TABUNGAN
# =====================================================================
@app.delete("/api/portofolio/{key_id}")
def hapus_tabungan(key_id: str):
    db = load_db()
    if key_id in db:
        del db[key_id]
        save_db(db)
        return {"message": "Tabungan berhasil dihapus"}
    raise HTTPException(status_code=404, detail="Data tidak ditemukan")