## Experiments in streaming video

# pip install cv2

import cv2
import sys
import time

def grab_still_from_m3u8(m3u8_url, output_filename="still.jpg"):
    """
    Grabs a single frame from an HLS stream and saves it as an image.

    Args:
        m3u8_url (str): The URL of the HLS stream (.m3u8 playlist file).
        output_filename (str): The name of the output image file.
    """
    print(f"Attempting to open HLS stream from URL: {m3u8_url}")

    # Create a VideoCapture object with the HLS URL
    cap = cv2.VideoCapture(m3u8_url)

    # Check if the stream was opened successfully
    if not cap.isOpened():
        print("Error: Unable to open the HLS stream.")
        sys.exit(1)

    # Try to read frames for a few seconds in case of initial stream issues
    start_time = time.time()
    frame = None
    ret = False
    max_wait_time = 10  # seconds

    while (time.time() - start_time) < max_wait_time:
        ret, frame = cap.read()
        if ret:
            print("Successfully read a frame from the stream.")
            break
        print("Waiting for a valid frame...")
        time.sleep(1)
    
    if not ret:
        print(f"Error: Could not retrieve a frame after {max_wait_time} seconds.")
        cap.release()
        return

    # Save the frame to a file
    cv2.imwrite(output_filename, frame)
    print(f"Still image saved as {output_filename}")

    # Release the VideoCapture object
    cap.release()

if __name__ == "__main__":
    hls_stream_url = "https://5f4ad95bcff44.streamlock.net:444/ashworthbeach1/ashworthbeach1.stream/main_playlist.m3u8"
    # https://live5.brownrice.com/cam-images/ashworthbeach1.jpg
    # http://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
    grab_still_from_m3u8(hls_stream_url)

