package io.hostmanager;

import io.hostmanager.ServerController;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.grizzly.http.server.StaticHttpHandler;
import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;


//
// A demonstration HTTP server capable of hosting a REST API
//
public class Server {

  private static final Logger LOGGER = Logger.getLogger(Server.class.getName());

  public static final String BASE_URI = "http://0.0.0.0:8080/";

  public static HttpServer startServer() {
    final ResourceConfig config = new ResourceConfig();
    config.register(ServerController.class);
    LOGGER.info("Starting Server........");
    final HttpServer httpServer = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), config);
    return httpServer;
  }

  //
  // It's important that we check for anything that might cause a fatal exception (such as a missing parameter) before
  // we allow the server to start.  On a (e.g.) Kubernetes deployment, preventing the container from passing a readiness
  // probe will alert a sysadmin/DevOps resource that there is a mis-configuration, rather than requiring a system monitor
  // or QA tester to locate the defect only after other systems check out
  //
  public static boolean serverReady() {
    if (System.getenv("ADMIN_PASSWORD") == null) {
      System.err.println("\nADMIN_PASSWORD must be set in the local shell\n");
      System.exit(1);
    }
    return true;
  }

  public static void main(String[] args) {
    if (serverReady()) try {
      final HttpServer httpServer = startServer();
      Runtime.getRuntime().addShutdownHook(new Thread(() -> {
        try {
          System.out.println("Shutting down the application...");
          httpServer.shutdownNow();
          System.out.println("Done, exit.");
        } catch (Exception e) {
          Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, e);
        }
      }));
      System.out.println(String.format("Application started.%nStop the application using CTRL+C"));
      Thread.currentThread().join();
    } catch (InterruptedException ex) {
      Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
    }
  }
  
}
