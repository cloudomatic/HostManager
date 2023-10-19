
  A React/Java single-page-app demonstration project, consisting of a browser-based remote access single-host server manager, allowing shell and file view/edit access to the host where the server API executes.

  See the UI [demo](https://raw.githack.com/cloudomatic/HostManager/ui_demo/demo/index.html){:target="_uidemo"} and the [API Spec](https://raw.githack.com/cloudomatic/HostManager/main/etc/spec.html){:target="_spec"}

  # System Requirements

    Docker
    Bash

  # System Components

  [UI](https://github.com/cloudomatic/HostManager/blob/develop/ui/src/HostManagerUI.js) - React (create-react-app, Material UI v5)

  [API](https://github.com/cloudomatic/HostManager/blob/develop/server/src/main/java/io/hostmanager/ServerController.java) - Java/Grizzly

  [Integration Tests](https://github.com/cloudomatic/HostManager/blob/develop/server/src/test/python/IntegrationTests.py) - Python 3.x

  # Getting Started
  
    ./build help - See what build options are available

    ./build run_development_container - Run the React dev server and Java API in a container suitable 
                                        for development, with the current working directory (source worktree)
                                        mounted at /src

    ./build run_server_integration_tests - Run integration tests inside the development container above

  # Deploying To a Docker/Kubernetes Cluster

    ./build build_artifacts && ./build build_image && ./build test_image && <push/deploy this image to your cluster, with a network mapping for port 80>

  # Known Issues

  - Need to update for React 18 changes https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
  - Bug: The server shell CLI does not drop the scrollbar to the bottom of the page on server response (only affects demo mode)
  - Bug: The file manager component does not re-stack the layout on resize
    
