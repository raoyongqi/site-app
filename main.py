from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List
import os
import json
from fastapi.responses import JSONResponse
app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    df = pd.read_excel(file_location)
    points = df[['lon', 'lat']].dropna().to_dict(orient='records')
    return {"points": points}
geojson_file_path = 'china.geojson'

@app.get("/geojson")
async def get_geojson():
    if not os.path.exists(geojson_file_path):
        return JSONResponse(content={"error": "GeoJSON file not found"}, status_code=404)

    with open(geojson_file_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    return JSONResponse(content=geojson_data)