package io.hostmanager;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.json.*;
import io.hostmanager.Api;
import io.hostmanager.ApiResponse;
import io.hostmanager.Auth;


//
// An HTTP service implementation-specific controller which handles unmarshalling, authentication, and versioning.  To ease unit testing and
// integration, all request body and HTTP status code functions are handled in io.hostmanager.Api
//
//
@Path("/api/v1")
public class ServerController {

    //
    // Set a standardized error response for our organization
    //
    public JSONObject getStandardizedErrorResponse(Exception exception) {
      return (new JSONObject()).put("error", exception  + "");
    }

    @Path("/files")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response files(
      @HeaderParam("User-agent") String userAgent,
      @HeaderParam("Authorization") String authorization,
    ) {
      try {
        return Response.status(501).entity((new JSONObject()).put("error", "Not implemented").toString(2) +  "\n").build();
      } catch (Exception exception) {
        return Response.status(500).entity(getStandardizedErrorResponse(exception).toString(2) + "\n").build();
      }
    }

    @Path("/commands")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response commands(
      @HeaderParam("User-agent") String userAgent,
      @HeaderParam("Authorization") String authorization,
      String body
    ) {
      ApiResponse response = null;
      ApiResponse authErrorResponse = null;
      try {
        // TODO: Move this to a servlet filter
        authErrorResponse = Auth.authorize("/commands", authorization);
        if (authErrorResponse != null) return Response.status(authErrorResponse.statusCode).entity(authErrorResponse.body.toString(2) + "\n").build();
      } catch (Exception exception) {
        return Response.status(401).entity(getStandardizedErrorResponse(exception).toString(2) + "\n").build();
      }
      try {
        response = Api.commands(new JSONObject(body));
        return Response.status(response.statusCode).entity(response.body.toString(2) + "\n").build();
      } catch (Exception exception) {
        return Response.status(500).entity(getStandardizedErrorResponse(exception).toString(2) + "\n").build();
      }
    }

    @Path("/status")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response status(
      @QueryParam("of") String of, 
      @HeaderParam("user-agent") String userAgent
    ) {
      ApiResponse response = null;
      try {
        response = Api.status(of);
        return Response.status(response.statusCode).entity(response.body.toString(2) + "\n").build();
      } catch (Exception exception) {
        return Response.status(500).entity(getStandardizedErrorResponse(exception).toString(2) + "\n").build();
      }
    }

/*
    @Path("/")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response static(
      @HeaderParam("user-agent") String userAgent
    ) {
      ApiResponse response = null;
      try {
        response = Api.status(of);
        return Response.status(response.statusCode).entity(response.body.toString(2) + "\n").build();
      } catch (Exception exception) {
        return Response.status(500).entity(getStandardizedErrorResponse(exception).toString(2) + "\n").build();
      }
    }
*/
}
