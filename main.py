from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List
import os
import json
from fastapi.responses import JSONResponse
import aiofiles
app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

file_location ='lon_lat.xlsx'


@app.get("/points")
async def upload_file():
    # Asynchronously save the uploaded file
    # Read the uploaded Excel file asynchronously
    try:
        df = pd.read_excel(file_location)
        df.columns = [col.lower() for col in df.columns]

        # Ensure the required columns are in the DataFrame
        if 'lat' not in df.columns or 'lon' not in df.columns:
            return JSONResponse(content={"error": "The uploaded file must contain 'lat' and 'lon' columns"}, status_code=400)

        # Extract the lat and lon columns
        points = df[['lat', 'lon']].dropna().to_dict(orient='records')
        
        return {"points": points}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


geojson_file_path = 'china.geojson'

@app.get("/geojson")
async def get_geojson():
    if not os.path.exists(geojson_file_path):
        return JSONResponse(content={"error": "GeoJSON file not found"}, status_code=404)

    with open(geojson_file_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    return JSONResponse(content=geojson_data)