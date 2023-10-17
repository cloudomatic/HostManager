import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Text from './Text.js'

//
// A toggle switch
//
//    mode - 'leftRight' or 'enabledDisabled'
//    labels - A list containing the label JSX, e.g. [ <a>leftLabel</a>, <a>rightLabel</a> ]
//    options - The string labels that will be sent to the callback handler on click, e.g. [ 'leftOption', 'rightOption' ]
//    selectedOption - The currently selected option in the 'options' list, e.g. 'leftOption'
//
export default function SimpleToggleSwitch({mode, labels, options, selectedOption, switchToggledHandler}) {

  const switchColorNotSelected = window.getTheme().primaryColorComplement
  const switchColorSelected = window.getTheme().primaryColorComplement
  const switchBackgroundColorSelected = window.getTheme().primaryColor
  const switchBackgroundColorNotSelected = window.getTheme().primaryColor

	const AntSwitch = styled(Switch)(({ theme }) => ({
		width: 28,
		height: 16,
		padding: 0,
		display: 'flex',
		'&:active': {
			'& .MuiSwitch-thumb': {
				width: 15,
			},
			'& .MuiSwitch-switchBase.Mui-checked': {
				transform: 'translateX(9px)',
			},
		},
		'& .MuiSwitch-switchBase': {
			padding: 2,
			'&.Mui-checked': {
				transform: 'translateX(12px)',
				color_: '#fff',
        color: switchColorNotSelected,
				'& + .MuiSwitch-track': {
					opacity: 1,
					backgroundColor_: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
          backgroundColor: switchBackgroundColorSelected
				},
			},
		},
		'& .MuiSwitch-thumb': {
			boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
			width: 12,
			height: 12,
      backgroundColor: switchColorNotSelected,
			borderRadius: 6,
			transition: theme.transitions.create(['width'], {
				duration: 200,
			}),
		},
		'& .MuiSwitch-track': {
			borderRadius: 16 / 2,
			opacity: 1,
			backgroundColor_: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      backgroundColor: switchBackgroundColorNotSelected,
			boxSizing: 'border-box',
		},
	}));

  const handleThemeToggle = (event) => {
    if (event.target.checked) switchToggledHandler(options[1])
    else switchToggledHandler(options[0])
  }

  return (
    options != null && options.length == 2 && <FormGroup>
      <Stack direction="row" spacing={1} alignItems="center" onClick={handleThemeToggle}>
        {labels != null && labels.length > 0 ? labels[0] : null}
          <AntSwitch defaultChecked={selectedOption != null && selectedOption == options[1]} inputProps={{ 'aria-label': 'ant design' }} />
        {labels != null && labels.length > 1 ? labels[1] : null}
      </Stack>
    </FormGroup>
  );
}
