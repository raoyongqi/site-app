import os
import geojson
from geojson import Feature, FeatureCollection, LineString

# 定义输入和输出文件夹路径
gmt_folder = 'gmt'  # 替换为实际的 GMT 文件夹路径
geojson_folder = 'geojson'  # 替换为实际的 GeoJSON 文件夹路径

# 确保输出文件夹存在
os.makedirs(geojson_folder, exist_ok=True)

# 将 GMT 文件转换为 GeoJSON
def convert_gmt_to_geojson(gmt_file_path, geojson_file_path):
    with open(gmt_file_path, 'r') as f:
        lines = f.readlines()

    features = []
    coordinates = []
    for line in lines:
        line = line.strip()
        if line.startswith('>'):
            if coordinates:
                features.append(Feature(geometry=LineString(coordinates)))
                coordinates = []
        elif line and not line.startswith('#'):
            try:
                lon, lat = map(float, line.split())
                coordinates.append((lon, lat))
            except ValueError as e:
                print(f"Skipping invalid line: {line}")

    if coordinates:
        features.append(Feature(geometry=LineString(coordinates)))

    if features:
        feature_collection = FeatureCollection(features)
        with open(geojson_file_path, 'w') as f:
            geojson.dump(feature_collection, f)
        print(f'Converted {gmt_file_path} to {geojson_file_path}')
    else:
        print(f'No valid features found in file {gmt_file_path}')

# 遍历输入文件夹中的所有 GMT 文件并转换它们
for filename in os.listdir(gmt_folder):
    if filename.endswith('.gmt'):
        gmt_file_path = os.path.join(gmt_folder, filename)
        geojson_file_path = os.path.join(geojson_folder, f'{os.path.splitext(filename)[0]}.geojson')
        convert_gmt_to_geojson(gmt_file_path, geojson_file_path)
