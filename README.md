
  A React/Java single-page-app demonstration project, consisting of a browser-based remote access single-host server manager, allowing shell and file view/edit access to the host where the server API executes.

  See the UI <a href="https://raw.githack.com/cloudomatic/HostManager/develop/demo/index.html" target="_uidemo">demo</a> and the <a href="https://raw.githack.com/cloudomatic/HostManager/main/etc/spec.html" target="_spec">OpenAPI spec</a>.

  # System Requirements

    Docker
    Bash

  # System Components

  [UI](https://github.com/cloudomatic/HostManager/blob/develop/ui/src/HostManagerUI.js) - React (create-react-app, Material UI v5)

  [API](https://github.com/cloudomatic/HostManager/blob/develop/server/src/main/java/io/hostmanager/ServerController.java) - Java/Grizzly Implementation

  [API](https://github.com/cloudomatic/HostManager/blob/develop/server/src/main/python/server.py) - Alternate Python implementation

  [Integration Tests](https://github.com/cloudomatic/HostManager/blob/develop/server/src/test/python/IntegrationTests.py) - Python 3.x

  # Getting Started
  
    ./build help - See what build options are available

    ./build run_development_container - Run the React dev server and Java API in a container suitable 
                                        for development, with the current working directory (source worktree)
                                        mounted at /src

    TRACE=true ./build test_api http://localhost:3000 - Run integration tests against the development container, from the local Docker host

  # Deploying to a Kubernetes Cluster

    ./build build_artifacts && \
    ./build build_image && \
    ./build test_image && \
    ./build push_image && \
    ./build deploy_to_kubernetes
    TRACE=true ./build test_api https://endpoint-to-your-running-deployment/

  # Known Issues

  - Need to update for React 18 changes https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
  - Bug: The server shell CLI does not drop the scrollbar to the bottom of the page on server response (only affects demo mode)
  - Bug: The file manager component does not re-stack the layout on resize
    
