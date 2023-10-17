
  A React/Java single-page-app demonstration project
  
  The program demos a browser-based remote access single-Linux-host server manager, allowing shell and file view/edit access to the host where the server executes.

  There is a UI <a href="https://raw.githack.com/cloudomatic/HostManager/ui_demo/demo/index.html">demo here</a>.

  # System Requirements

    Docker
    Bash

  # System Components

    <a href="https://github.com/cloudomatic/HostManager/blob/develop/ui/src/HostManagerUI.js">UI</a> - React (create-react-app, Material UI v5)

    <a href="API">API</a> - Java/Grizzly

    <a href="https://github.com/cloudomatic/HostManager/blob/develop/server/src/test/python/IntegrationTests.py">Integration Tests</a> - Python 3.x

  # Getting Started:
  
        ./build help - See what build options are available

        ./build run_development_container - Run the React dev server and Java API in a container suitable 
                                            for development, with the current working directory (source worktree)
                                            mounted at /src

        ./build run_server_integration_tests - Run integration tests inside a development container

  # Known Issues

    - Update for React 18 changes https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
    - Bug: The server shell CLI does not drop the scrollbar to the bottom of the page on server response (only affects demo mode)
    - Bug: The file manager component does not re-stack the layout on resize
    
