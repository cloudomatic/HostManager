package io.hostmanager;

import org.json.JSONObject;
import java.io.File;
import java.nio.file.Files;
import java.io.BufferedReader;
import java.io.FileReader;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

//
// Stateless class library to manage access to the local host's filesystem
//

public class FileManager {

  // These are files that we'll return a thumbnail on
  public static final String imageFileExtensions = "png gif jpg jpeg bmp";
  
  // These are files we'll return a brief amount of preview text on in the "text" JSON attribute
  public static final String textFileExtensions = "sh txt conf js css html";
    
  private static BufferedImage resizeImage(BufferedImage originalImage, int newWidth, int newHeight) {
    /*
    BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, originalImage.getType());
    Graphics2D graphics = resizedImage.createGraphics();
    graphics.setColor(Color.WHITE);
    // fill the entire picture with white
    graphics.fillRect(0, 0, newWidth, newHeight);
    int maxWidth = 0;
    int maxHeight = 0;
    // go along the width and height in increments of 1 until one value is equal to the specified resize value
    while (maxWidth <= newWidth && maxHeight <= newHeight)
    {
        ++maxWidth;
        ++maxHeight;
    }
    // calculate the x value with which the original image is centred
    int centerX = (resizedImage.getWidth() - maxWidth) / 2;
    // calculate the y value with which the original image is centred
    int centerY = (resizedImage.getHeight() - maxHeight) / 2;
    // draw the original image
    graphics.drawImage(originalImage, centerX, centerY, maxWidth, maxHeight, null);
    graphics.dispose();
    return resizedImage; 
    */
    return null;
  }

  public static String getUuencodedFileThumbnail(String filePath) throws Exception {
    /*
    BufferedImage img = ImageIO.read(new File(filePath));
    BufferedImage thumb = new BufferedImage(100, 200, BufferedImage.TYPE_INT_RGB);
    Graphics2D g2d = (Graphics2D) thumb.getGraphics();
    g2d.drawImage(img, 0, 0, thumb.getWidth() - 1, thumb.getHeight() - 1, 0, 0, img.getWidth() - 1, img.getHeight() - 1, null);
    g2d.dispose();
    java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
    ImageIO.write(thumb, "PNG", new File("/src/test.png"));
    ImageIO.write(thumb, "PNG", baos);
    return new String(java.util.Base64.getEncoder().encode(baos.toByteArray()));
    */
    return "iVBORw0KGgoAAAANSUhEUgAAAM0AAADNCAMAAAAsYgRbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJQTFRF3NSmzMewPxIG//ncJEJsldTou1jHgAAAARBJREFUeNrs2EEKgCAQBVDLuv+V20dENbMY831wKz4Y/VHb/5RGQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0PzMWtyaGhoaGhoaGhoaGhoaGhoxtb0QGhoaGhoaGhoaGhoaGhoaMbRLEvv50VTQ9OTQ5OpyZ01GpM2g0bfmDQaL7S+ofFC6xv3ZpxJiywakzbvd9r3RWPS9I2+MWk0+kbf0Hih9Y17U0nTHibrDDQ0NDQ0NDQ0NDQ0NDQ0NTXbRSL/AK72o6GhoaGhoRlL8951vwsNDQ0NDQ1NDc0WyHtDTEhDQ0NDQ0NTS5MdGhoaGhoaGhoaGhoaGhoaGhoaGhoaGposzSHAAErMwwQ2HwRQAAAAAElFTkSuQmCC";
  }

  public static String getFilePreviewText(String filePath, int previewStringMaxLength) throws Exception {
    char[] contents = new char[previewStringMaxLength];
    try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
      int bytesRead = reader.read(contents, 0, previewStringMaxLength);
      return new String(contents, 0, Math.min(previewStringMaxLength, bytesRead));
    }
  }

  public static String getFileSize(String filename) throws Exception {
    long size = Files.size(new File(filename).toPath());
    if (size < 1000) return size + "B";
    else if (size < 1000000) return (size / 1024) + "K";
    else return (size / (1024*1024)) + "M";
  }

  public static String getFileExtension(String filename) {
    if (filename == null) return null;
    else if (filename.startsWith(".")) return null;
    else if (filename.endsWith(".")) return null;
    else if (!filename.contains(".")) return null;
    else {
      String[] tokens = filename.split("\\.");
      return tokens[tokens.length - 1];
    }
  }

  //
  // If it's a path, we return information about the files in the folder, including short preview details and a small thumbnail for images
  // For files, we return a larger preview image suitable for displaying in a CSS 30vw box
  //
  public static JSONObject getPathInfo(String filePath) throws Exception {
    if ((new java.io.File(filePath)).isDirectory()) return (new JSONObject()).put(filePath, getDirectoryContents(filePath));
    else return (new JSONObject()).put(filePath, getFileInfo(filePath, false));
  }


  //
  // When thumbnailOnly == false we show a larger preview image
  // 
  public static JSONObject getFileInfo(String filePath, boolean thumbnailOnly) throws Exception {
            java.io.File fileEntry = new File(filePath);
            JSONObject fileInfo = new JSONObject();
            final String filename = fileEntry.getName();
            fileInfo.put("size", getFileSize(filePath));
            if (getFileExtension(filename) != null && imageFileExtensions.contains(getFileExtension(filename))) {
              fileInfo.put("type", "image");
              fileInfo.put("thumbnail", getUuencodedFileThumbnail(filePath));
            } else if (getFileExtension(filename) != null && textFileExtensions.contains(getFileExtension(filename))) {
              fileInfo.put("type", "text");
              fileInfo.put("text", getFilePreviewText(filePath, 2000));
            } else fileInfo.put("type", "unknown");
            return fileInfo;
  }

  public static JSONObject getDirectoryContents(String filePath) throws Exception {
    JSONObject directoryContents = new JSONObject();
    for (final File fileEntry : new File(filePath).listFiles()) {
        if (fileEntry.isDirectory()) {
            directoryContents.put("/" + fileEntry.getName(), new JSONObject());
        } else {
            directoryContents.put(fileEntry.getName(), getFileInfo((filePath + "/" + fileEntry.getName()).replace("//", "/"), true));
        }
    }
    return directoryContents;
  }
    
  public static String getFileAsBase64String(String filePath) {
    //return new File(filePath);
    return null;
  }
}
