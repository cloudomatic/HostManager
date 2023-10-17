import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DownloadIcon from '@mui/icons-material/Download';
import GridViewIcon from '@mui/icons-material/GridView';
import TerminalIcon from '@mui/icons-material/Terminal';
import StorageIcon from '@mui/icons-material/Storage';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExtensionIcon from '@mui/icons-material/Extension';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Icon({name = "Terminal", transform = "scale(1.0)", color = window.getDrawerIconColor()}) {

  const menuIconStyle = {
                        transform: transform,
                        color: color,
                        minWidth: 0,
                        justifyContent: 'center'
  }

	  if (name.includes("Terminal")) return <TerminalIcon sx={menuIconStyle} />
    else if (name.includes("FolderOpen")) return <FolderOpenIcon sx={menuIconStyle} />
    else if (name.includes("Extension")) return <ExtensionIcon sx={menuIconStyle} />
    else if (name.includes("Tile")) return <GridViewIcon sx={menuIconStyle} />
    else if (name.includes("Folder")) return <FolderIcon sx={menuIconStyle} />
    else if (name.includes("GenericFile")) return <InsertDriveFileIcon sx={menuIconStyle} />
    else if (name.includes("TextFile")) return <DescriptionIcon sx={menuIconStyle} />
    else if (name.includes("DownloadFile")) return <DownloadIcon sx={menuIconStyle} />
    else if (name.includes("List")) return <FormatListBulletedIcon sx={menuIconStyle} />
    else if (name.includes("Settings")) return <SettingsIcon sx={menuIconStyle} />
    else if (name.includes("Profile")) return <AccountCircleIcon sx={menuIconStyle} />
	  else return <StorageIcon sx={menuIconStyle} />
}
