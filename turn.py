import json

# 读取原始 JSON 数据
with open('中华人民共和国.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 判断数据类型并转换为 GeoJSON 格式

# 检查数据是否是有效的 FeatureCollection
if data.get("type") != "FeatureCollection":
    raise ValueError("Unexpected data format: Expected a 'FeatureCollection'.")

# GeoJSON 转换函数
def convert_to_geojson(features):
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    for feature in features:
        geometry_type = feature.get("geometry", {}).get("type", "Unknown")
        coordinates = feature.get("geometry", {}).get("coordinates", [])
        properties = feature.get("properties", {})

        geojson_feature = {
            "type": "Feature",
            "geometry": {
                "type": geometry_type,
                "coordinates": coordinates
            },
            "properties": properties
        }
        
        geojson["features"].append(geojson_feature)

    return geojson

# 如果数据是一个有效的 FeatureCollection
features = data.get("features", [])
if not isinstance(features, list):
    raise ValueError("Expected 'features' key to contain a list.")
geojson = convert_to_geojson(features)

# 保存为 GeoJSON 文件
with open('china.geojson', 'w', encoding='utf-8') as f:
    json.dump(geojson, f, indent=4, ensure_ascii=False)