import os
import json
from PIL import Image

def resize_image(image_path, max_size=1920):
    """调整图片大小，使最长边不超过 max_size，并保持比例。"""
    with Image.open(image_path) as img:
        width, height = img.size
        
        # 计算缩放比例
        if max(width, height) > max_size:
            scale = max_size / max(width, height)
            new_width = int(width * scale)
            new_height = int(height * scale)
            img = img.resize((new_width, new_height), Image.LANCZOS)
            img.save(image_path)  # 直接覆盖原文件
            print(f"调整大小: {image_path} -> {new_width}x{new_height}")

def list_images_to_json():
    # 获取当前脚本所在目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 获取当前目录中的所有 PNG 和 JPG 文件
    image_files = [f for f in os.listdir(current_dir) if f.lower().endswith(('.png', '.jpg'))]
    
    # 遍历图片进行调整
    for image in image_files:
        image_path = os.path.join(current_dir, image)
        resize_image(image_path)
    
    # 构造 JSON 数据
    data = {"images": image_files}
    
    # 指定 JSON 文件的路径
    json_path = os.path.join(current_dir, "images.json")
    
    # 写入 JSON 文件，每次运行都会刷新内容
    with open(json_path, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)
    
    print(f"已更新 {json_path}，共 {len(image_files)} 张图片。")

if __name__ == "__main__":
    list_images_to_json()
