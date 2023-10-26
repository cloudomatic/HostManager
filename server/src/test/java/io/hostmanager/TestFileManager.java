package io.hostmanager;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.json.JSONObject;
import io.hostmanager.FileManager;


public class TestFileManager {

  @Test
  public void testGetDirectoryContents() throws Exception {
    if (!FileManager.getDirectoryContents("/").has("/etc")) throw new Exception("Expected /etc in path /");
    if (!FileManager.getDirectoryContents("/etc").getJSONObject("nsswitch.conf").getString("text").contains("hosts")) throw new Exception("Expected 'hosts' in /etc/nsswitch.conf");
    //System.out.println(FileManager.getDirectoryContents("/etc").toString(2));
  }

  @Test
  public void testGetPathInfo() throws Exception {
    if (!FileManager.getPathInfo("/").getJSONObject("/").getJSONObject(".dockerenv").getString("type").equals("unknown")) throw new Exception("Expected /.dockerenv to have type 'unknown'");
    if (!FileManager.getPathInfo("/src/ui/public").getJSONObject("/src/ui/public").getJSONObject("globe.png").has("thumbnail")) throw new Exception("Expected a thumbnail image for globe.png");
    //System.out.println(FileManager.getPathInfo("/src/ui/public/Lex.001.png"));
    //System.out.println(FileManager.getPathInfo("/"));
  }

  @Test
  public void testGetUuencodedFileThumbnail() throws Exception { 
    String encodedThumbnail = FileManager.getUuencodedFileThumbnail("/src/ui/public/2021-09-01.png");
    java.nio.file.Path path = java.nio.file.Paths.get("/src/thumbnail.blob");
	  java.nio.file.Files.write(path, ("blob://" + encodedThumbnail).getBytes(java.nio.charset.StandardCharsets.UTF_8));
  }

  @Test
  public void testGetFileExtension() throws Exception {
    String[][] testFilenames = {
      { "filename.ext", "ext" },
      { "filename.filename.ext", "ext" },
      { "filename", null },
      { "anotherfilename..ext", "ext" },
      { ".anotherfilename", null },
      { "anotherFilename.", null }
    };
    for (String[] testFilename : testFilenames) {
      if (testFilename[1] == null) {
        if (FileManager.getFileExtension(testFilename[0]) != null) throw new Exception("Expected extension " + testFilename[1] + " from getFileExtension(" + testFilename[0] + ")");
      } else if (!FileManager.getFileExtension(testFilename[0]).equals(testFilename[1])) throw new Exception("Expected extension " + testFilename[1] + " from getFileExtension(" + testFilename[0] + ")");
    }
  }

}
