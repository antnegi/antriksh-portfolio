"""
extract_frames.py
Extracts 64 high-quality WebP frames along the 360-degree head rotation trajectory,
plus center.webp for direct eye contact.
"""
import os
import cv2
import numpy as np

def main():
    video_path = "character.mp4"
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps if fps > 0 else 0

    print("=" * 60)
    print("VIDEO TIMELINE & FRAME ANALYSIS")
    print("=" * 60)
    print(f"File: {video_path}")
    print(f"Dimensions: {w}x{h}")
    print(f"Total Frames: {total_frames}")
    print(f"FPS: {fps:.2f}")
    print(f"Duration: {duration:.2f} seconds")

    # Read all frames into memory
    print("\nLoading frames...")
    all_frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        all_frames.append(frame)
    cap.release()
    print(f"Loaded {len(all_frames)} frames.")

    # Background color detection from edge pixels
    top_left = all_frames[10][10:40, 10:40]
    top_right = all_frames[10][10:40, w-40:w-10]
    bottom_left = all_frames[10][h-40:h-10, 10:40]
    bottom_right = all_frames[10][h-40:h-10, w-40:w-10]
    bg_bgr = np.mean([top_left, top_right, bottom_left, bottom_right], axis=(0,1,2))
    bg_rgb = [int(round(x)) for x in bg_bgr[::-1]]
    bg_hex = "#{:02x}{:02x}{:02x}".format(*bg_rgb)
    print(f"\nBackground RGB: {bg_rgb}")
    print(f"Background Hex: {bg_hex}")

    # Identified exact frame numbers for the 8 compass directions + center:
    compass_frames = {
        "RIGHT": 93,
        "DOWN-RIGHT": 118,
        "DOWN": 137,
        "DOWN-LEFT": 160,
        "LEFT": 182,
        "UP-LEFT": 206,
        "UP": 37,
        "UP-RIGHT": 68,
        "CENTER": 236
    }

    print("\n" + "=" * 60)
    print("8 COMPASS DIRECTIONS & CENTER NEUTRAL FRAME")
    print("=" * 60)
    for direction, f_num in compass_frames.items():
        print(f"  {direction:<12}: Frame #{f_num}")

    # 64 frames along 360-degree circular rotation
    # Divided into 8 octaves of 8 frames each (64 total, ~5.625 deg apart)
    # Skipping blink frames (47-51) during UP -> UP-RIGHT
    octaves = [
        # Octave 0: 0° to 45° (RIGHT -> DOWN-RIGHT)
        [93, 96, 99, 102, 106, 109, 112, 115],
        # Octave 1: 45° to 90° (DOWN-RIGHT -> DOWN)
        [118, 120, 123, 125, 128, 130, 133, 135],
        # Octave 2: 90° to 135° (DOWN -> DOWN-LEFT)
        [137, 140, 143, 146, 149, 152, 155, 158],
        # Octave 3: 135° to 180° (DOWN-LEFT -> LEFT)
        [160, 163, 166, 169, 172, 175, 178, 180],
        # Octave 4: 180° to 225° (LEFT -> UP-LEFT)
        [182, 185, 188, 191, 194, 197, 200, 203],
        # Octave 5: 225° to 270° (UP-LEFT -> UP)
        [206, 209, 212, 215, 26, 29, 33, 35],
        # Octave 6: 270° to 315° (UP -> UP-RIGHT, skip blink 47-51)
        [37, 41, 44, 46, 52, 56, 61, 65],
        # Octave 7: 315° to 360° (UP-RIGHT -> RIGHT)
        [68, 71, 74, 78, 81, 84, 87, 90]
    ]

    trajectory_indices = []
    for oct_idx, frames_in_oct in enumerate(octaves):
        trajectory_indices.extend(frames_in_oct)

    print(f"\nTotal trajectory frames selected: {len(trajectory_indices)}")

    # Target directories to save to (ensuring both root frames/ and public/frames/ are populated)
    target_dirs = [
        "frames",
        "public/frames",
        "../antriksh-protfolio/public/frames"
    ]

    for d in target_dirs:
        os.makedirs(d, exist_ok=True)

    # Encode with high-quality WebP (quality=95)
    encode_params = [cv2.IMWRITE_WEBP_QUALITY, 95]

    print("\nExporting 64 WebP frames...")
    for i, frame_num in enumerate(trajectory_indices):
        frame = all_frames[frame_num]
        filename = f"frame_{i}.webp"
        
        for d in target_dirs:
            out_path = os.path.join(d, filename)
            cv2.imwrite(out_path, frame, encode_params)

        if i % 8 == 0 or i == 63:
            deg = i * (360.0 / 64)
            print(f"  Frame {i:02d}/63 (~{deg:5.1f} deg) from video frame #{frame_num}")

    # Export Center neutral frame
    center_frame = all_frames[compass_frames["CENTER"]]
    center_targets = [
        "center.webp",
        "frames/center.webp",
        "public/center.webp",
        "public/frames/center.webp",
        "../antriksh-protfolio/public/center.webp",
        "../antriksh-protfolio/public/frames/center.webp"
    ]

    for c_path in center_targets:
        os.makedirs(os.path.dirname(c_path) if os.path.dirname(c_path) else ".", exist_ok=True)
        cv2.imwrite(c_path, center_frame, encode_params)

    print(f"\nCenter neutral frame exported from video frame #{compass_frames['CENTER']} to center.webp")
    print("=" * 60)
    print("EXTRACTION COMPLETE! All 64 frames + center.webp ready.")
    print("=" * 60)

if __name__ == "__main__":
    main()
