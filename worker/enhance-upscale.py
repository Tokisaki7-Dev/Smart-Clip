import sys
import os
from realesrgan import RealESRGAN

def upscale_frames(input_dir, output_dir):
    # Initialize Real-ESRGAN model
    model = RealESRGAN('cuda' if torch.cuda.is_available() else 'cpu', 'realesrgan-x4plus')
    model.load_weights()

    for filename in os.listdir(input_dir):
        if filename.endswith('.png'):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, filename)
            model.predict(input_path, output_path)
            print(f"Upscaled {filename}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python enhance-upscale.py <input_frames_dir> <output_frames_dir>")
        sys.exit(1)
    upscale_frames(sys.argv[1], sys.argv[2])