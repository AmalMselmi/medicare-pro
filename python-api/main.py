from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime

app = FastAPI(title="MediCare Python API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://mongodb:27017/")
db = client["medical_db"]

@app.get("/api/stats")
def get_stats():
    from datetime import datetime, timezone
    
    now = datetime.now()
    today_start = datetime(now.year, now.month, now.day, 0, 0, 0)
    today_end = datetime(now.year, now.month, now.day, 23, 59, 59)
    
    total_patients = db.patients.count_documents({"actif": True})
    total_medecins = db.medecins.count_documents({})
    total_rdv = db.rendezvous.count_documents({})
    rdv_aujourdhui = db.rendezvous.count_documents({
        "date": {
            "$gte": today_start,
            "$lte": today_end
        }
    })
    
    return {
        "success": True,
        "data": {
            "totalPatients": total_patients,
            "totalMedecins": total_medecins,
            "totalRDV": total_rdv,
            "rdvAujourdhui": rdv_aujourdhui
        }
    }

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "python-fastapi"}