from PIL import Image

def recolor_logo(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (R, G, B, A)
            if item[3] > 0: # If pixel is not transparent
                # Change to Emerald (16, 185, 129) but keep original Alpha
                newData.append((16, 185, 129, item[3]))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully recolored logo to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    recolor_logo("logo.png", "logo.png") # Overwrite or save as new
