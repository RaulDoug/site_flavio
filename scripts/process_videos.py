import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
print(f"Using FFmpeg: {ffmpeg_exe}")

base_dir = r"c:\Users\User\Desktop\Projetos\site_flavio"
videos_dir = os.path.join(base_dir, "assets", "videos")
images_dir = os.path.join(base_dir, "assets", "images")
os.makedirs(videos_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

# 1. Ana Luiza
input_ana = os.path.join(videos_dir, "video_promo_flavio_insta.mp4")
output_ana = os.path.join(videos_dir, "video-ana-luiza-web.mp4")
poster_ana = os.path.join(images_dir, "poster-ana-luiza.webp")

print("Processing Ana Luiza video...")
cmd_ana = [
    ffmpeg_exe, "-y", "-i", input_ana,
    "-c:v", "libx264", "-profile:v", "high", "-crf", "24", "-preset", "slow",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    "-vf", "scale='min(720,iw)':-2",
    output_ana
]
subprocess.run(cmd_ana, check=True)

print("Extracting Ana Luiza poster...")
cmd_poster_ana = [
    ffmpeg_exe, "-y", "-ss", "00:00:14.5", "-i", input_ana,
    "-vframes", "1", "-vf", "scale='min(720,iw)':-2",
    poster_ana
]
subprocess.run(cmd_poster_ana, check=True)

# 2. Diego (cut final 2.5s grey screen)
input_diego = os.path.join(videos_dir, "depoimento_paciente_2_flavio_insta.mp4")
output_diego = os.path.join(videos_dir, "video-diego-web.mp4")
poster_diego = os.path.join(images_dir, "poster-diego.webp")

print("Processing Diego video (trimming to 49.2s)...")
cmd_diego = [
    ffmpeg_exe, "-y", "-i", input_diego,
    "-t", "49.2",
    "-c:v", "libx264", "-profile:v", "high", "-crf", "24", "-preset", "slow",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    "-vf", "scale='min(720,iw)':-2",
    output_diego
]
subprocess.run(cmd_diego, check=True)

print("Extracting Diego poster...")
cmd_poster_diego = [
    ffmpeg_exe, "-y", "-ss", "00:00:17.5", "-i", input_diego,
    "-vframes", "1", "-vf", "scale='min(720,iw)':-2",
    poster_diego
]
subprocess.run(cmd_poster_diego, check=True)

# 3. Fael (compression from 17MB to ~3.5MB, faststart)
input_fael = os.path.join(videos_dir, "depoimento_cliente_flavio_insta.mp4")
output_fael = os.path.join(videos_dir, "video-fael-web.mp4")
poster_fael = os.path.join(images_dir, "poster-fael.webp")

print("Processing Fael video (optimizing 17MB -> ~3.5MB)...")
cmd_fael = [
    ffmpeg_exe, "-y", "-i", input_fael,
    "-c:v", "libx264", "-profile:v", "high", "-crf", "26", "-preset", "slow",
    "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart",
    "-vf", "scale='min(540,iw)':-2",
    output_fael
]
subprocess.run(cmd_fael, check=True)

print("Extracting Fael poster...")
cmd_poster_fael = [
    ffmpeg_exe, "-y", "-ss", "00:01:31.0", "-i", input_fael,
    "-vframes", "1", "-vf", "scale='min(540,iw)':-2",
    poster_fael
]
subprocess.run(cmd_poster_fael, check=True)

print("\n--- Summary of Generated Files ---")
for f in [output_ana, poster_ana, output_diego, poster_diego, output_fael, poster_fael]:
    sz = os.path.getsize(f) / (1024 * 1024) if f.endswith(".mp4") else os.path.getsize(f) / 1024
    unit = "MB" if f.endswith(".mp4") else "KB"
    print(f"{os.path.basename(f)}: {sz:.2f} {unit}")

