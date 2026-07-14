import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from '@mui/material';

import { NAVBAR_LABELS } from './labels';
import { NAVBAR_CONSTANTS } from './constants';
import JivaLogo from '../../assets/jiva.svg';
import PlusIcon from '../../assets/plus.svg';
import LocationIcon from '../../assets/Location.svg';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: NAVBAR_LABELS.WELLNESS_PROFILE, path: '/dashboard' },
    { label: NAVBAR_LABELS.VITALITY_MAP, path: '/vitality-map' },
    { label: NAVBAR_LABELS.WELLNESS_PLAN, path: '/action-plan' },
    { label: NAVBAR_LABELS.SCHEDULE, path: '/personal-info' },
  ];


  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: NAVBAR_CONSTANTS.BACKGROUND_COLOR,
        boxShadow: NAVBAR_CONSTANTS.BOX_SHADOW,
        height: NAVBAR_CONSTANTS.HEIGHT,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: NAVBAR_CONSTANTS.PADDING,
          height: '100%',
        }}
      >
        {/* Logo and Navigation Links */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: NAVBAR_CONSTANTS.NAV_ITEM_GAP,
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexGrow: 0,
            }}
          >
            <img
              src={JivaLogo}
              alt="Jiva"
              style={{
                height: 'auto',
                maxHeight: '40px',
              }}
            />
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              gap: NAVBAR_CONSTANTS.NAV_ITEM_GAP,
              alignItems: 'center',
            }}
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  fontFamily: NAVBAR_CONSTANTS.NAV_FONT_FAMILY,
                  fontWeight: active ? 600 : 500,
                  fontSize: NAVBAR_CONSTANTS.NAV_FONT_SIZE,
                  lineHeight: NAVBAR_CONSTANTS.NAV_LINE_HEIGHT,
                  letterSpacing: NAVBAR_CONSTANTS.NAV_LETTER_SPACING,
                  color: active ? '#000000' : '#256111',
                  textTransform: 'none',
                  textDecoration: 'none',
                  padding: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: active ? '#000000' : '#256111',
                  },
                }}
              >
                {item.label}
              </Button>
              );
            })}
          </Box>
        </Box>

        {/* Right Side Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: NAVBAR_CONSTANTS.BUTTON_GAP,
            alignItems: 'center',
          }}
        >
          {/* Questioner Button */}
          <Button
            component={Link}
            to="/personal-info"
            sx={{
              fontFamily: NAVBAR_CONSTANTS.BUTTON_FONT_FAMILY,
              fontWeight: NAVBAR_CONSTANTS.BUTTON_FONT_WEIGHT,
              fontSize: NAVBAR_CONSTANTS.BUTTON_FONT_SIZE,
              lineHeight: NAVBAR_CONSTANTS.BUTTON_LINE_HEIGHT,
              letterSpacing: NAVBAR_CONSTANTS.BUTTON_LETTER_SPACING,
              color: NAVBAR_CONSTANTS.QUESTIONER_TEXT_COLOR,
              border: `${NAVBAR_CONSTANTS.BUTTON_BORDER_WIDTH} solid ${NAVBAR_CONSTANTS.QUESTIONER_BORDER_COLOR}`,
              borderRadius: NAVBAR_CONSTANTS.BUTTON_BORDER_RADIUS,
              padding: NAVBAR_CONSTANTS.BUTTON_PADDING,
              width: NAVBAR_CONSTANTS.BUTTON_WIDTH,
              height: NAVBAR_CONSTANTS.BUTTON_HEIGHT,
              backgroundColor: 'transparent',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                borderColor: NAVBAR_CONSTANTS.QUESTIONER_BORDER_COLOR,
              },
            }}
          >
            {NAVBAR_LABELS.QUESTIONER}
          </Button>

          {/* Schedule Button */}
          <Button
            component={Link}
            to="/personal-info"
            sx={{
              fontFamily: NAVBAR_CONSTANTS.BUTTON_FONT_FAMILY,
              fontWeight: NAVBAR_CONSTANTS.BUTTON_FONT_WEIGHT,
              fontSize: NAVBAR_CONSTANTS.BUTTON_FONT_SIZE,
              lineHeight: NAVBAR_CONSTANTS.BUTTON_LINE_HEIGHT,
              letterSpacing: NAVBAR_CONSTANTS.BUTTON_LETTER_SPACING,
              color: NAVBAR_CONSTANTS.SCHEDULE_TEXT_COLOR,
              backgroundColor: NAVBAR_CONSTANTS.SCHEDULE_BACKGROUND_COLOR,
              border: `${NAVBAR_CONSTANTS.BUTTON_BORDER_WIDTH} solid ${NAVBAR_CONSTANTS.SCHEDULE_BACKGROUND_COLOR}`,
              borderRadius: NAVBAR_CONSTANTS.BUTTON_BORDER_RADIUS,
              padding: NAVBAR_CONSTANTS.BUTTON_PADDING,
              width: NAVBAR_CONSTANTS.BUTTON_WIDTH,
              height: NAVBAR_CONSTANTS.BUTTON_HEIGHT,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: NAVBAR_CONSTANTS.SCHEDULE_BACKGROUND_COLOR,
                borderColor: NAVBAR_CONSTANTS.SCHEDULE_BACKGROUND_COLOR,
              },
            }}
          >
            {NAVBAR_LABELS.SCHEDULE}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

