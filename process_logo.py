from PIL import Image
import os

def remove_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check if pixel is near white (R,G,B > 200)
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0)) # Make Transparent
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed logo to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    # Install Pillow if not found (simple fallback)
    try:
        import PIL
    except IndexError:
        import subprocess
        subprocess.check_call(["pip", "install", "pillow"])
        
    remove_background("logo_original.jpg", "logo.png")
