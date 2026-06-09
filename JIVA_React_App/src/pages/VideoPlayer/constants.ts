// VideoPlayer Page Constants
export const VIDEO_PLAYER_CONSTANTS = {
  MAX_WIDTH: '1300px',
  CONTAINER_PADDING: '40px 24px',
  CONTAINER_GAP: '24px',
  CONTROL_BAR_STYLE: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  GRID_GAP: '24px',
  PLAYLIST_PADDING: '40px',
  THUMBNAIL_WIDTH: '160px',
  THUMBNAIL_HEIGHT: '100px',
} as const;
