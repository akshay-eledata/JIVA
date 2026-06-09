import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import Yoga4 from '../../assets/yoga 4.svg';
import PlayIcon from '../../assets/play.svg';
import MaximizeIcon from '../../assets/maximize.svg';
import VolumeIcon from '../../assets/volume.svg';
import SlidersIcon from '../../assets/sliders.svg';
import DownloadIcon from '../../assets/Download.svg';
import FrameIcon from '../../assets/Frame.svg';
import WatchlistIcon from '../../assets/watchlist.svg';
import RectangleIcon from '../../assets/Rectangle.svg';
import ButtonIcon from '../../assets/Button.svg';
import TimeIcon from '../../assets/Time.svg';
import AngleDownIcon from '../../assets/angle-down.svg';
import UpArrowIcon from '../../assets/Up-arrow.svg';
import { VIDEO_PLAYER_CONSTANTS } from './constants';
import { VIDEO_PLAYER_LABELS } from './labels';

const VideoPlayer: React.FC = () => {
    const [showPlaylist, setShowPlaylist] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const relatedVideos = [
        { id: 1, title: 'Padma Asana' },
        { id: 2, title: 'Padma Asana' },
        { id: 3, title: 'Padma Asana' },
    ];

    const playlistItems = [
        {
            id: '01',
            title: 'Chapter One : Yoga for Flexibility & Strength',
            duration: '49 min',
            description: "On his way from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab."
        },
        {
            id: '02',
            title: 'Chapter Two : Yoga for Flexibility & Strength',
            duration: '56 min',
            description: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call."
        },
        {
            id: '03',
            title: 'Chapter Three : Yoga for Flexibility & Strength',
            duration: '52 min',
            description: "An increasingly concerned Nancy looks for Barb and finds out what Jonathan's been up to. Joyce is convinced Will is trying to talk to her."
        },
        {
            id: '04',
            title: 'Chapter Four : Yoga for Flexibility & Strength',
            duration: '51 min',
            description: "Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Elven a makeover."
        }
    ];

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: VIDEO_PLAYER_CONSTANTS.MAX_WIDTH,
                margin: '0 auto',
                padding: VIDEO_PLAYER_CONSTANTS.CONTAINER_PADDING,
                display: 'flex',
                flexDirection: 'column',
                gap: VIDEO_PLAYER_CONSTANTS.CONTAINER_GAP,
            }}
        >
            {/* Video Preview Section */}
            <Box
                sx={{
                    width: '100%',
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    backgroundColor: '#F9FAFB',
                }}
            >
                <Box
                    component="img"
                    src={Yoga4}
                    alt="Yoga Video"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                    }}
                />

                {/* Video Controls Overlay */}
                <Box sx={VIDEO_PLAYER_CONSTANTS.CONTROL_BAR_STYLE}>
                    {/* Play Button */}
                    <IconButton sx={{ p: 0 }}>
                        <Box component="img" src={PlayIcon} sx={{ width: '16px', height: '16px' }} />
                    </IconButton>

                    {/* Progress Bar */}
                    <Box
                        sx={{
                            flex: 1,
                            height: '4px',
                            backgroundColor: 'rgba(26, 33, 43, 0.2)',
                            borderRadius: '2px',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '40%',
                                backgroundColor: '#1A212B',
                                borderRadius: '2px',
                            }}
                        />
                    </Box>

                    {/* Time */}
                    <Typography sx={{ fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>
                        {VIDEO_PLAYER_LABELS.VIDEO_PROGRESS_MOCK}
                    </Typography>

                    {/* Right Controls */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton sx={{ p: 0 }}>
                            <Box component="img" src={VolumeIcon} sx={{ width: '20px', height: '20px' }} />
                        </IconButton>
                        <IconButton sx={{ p: 0 }}>
                            <Box component="img" src={SlidersIcon} sx={{ width: '20px', height: '20px' }} />
                        </IconButton>
                        <IconButton sx={{ p: 0 }}>
                            <Box component="img" src={MaximizeIcon} sx={{ width: '20px', height: '20px' }} />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>

            {/* Info and Actions Section */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mt: 3,
                }}
            >
                {/* Text Info */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        alignItems: 'flex-start',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: '32px',
                            fontFamily: 'lexend',
                            fontWeight: 600,
                            color: '#1A212B',
                            mb: 1.5,
                        }}
                    >
                        {VIDEO_PLAYER_LABELS.VIDEO_TITLE}
                    </Typography>
                    <Box sx={{ mr: 6, }}>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#27313F',
                                mb: 0.5,
                            }}
                        >
                            {VIDEO_PLAYER_LABELS.VIDEO_SUBTITLE}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#807E81',
                                fontFamily: 'Lexend',
                                pr: 6,
                            }}
                        >
                            {VIDEO_PLAYER_LABELS.VIDEO_INSTRUCTOR}
                        </Typography>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Stack direction="row" spacing={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Box
                            sx={{
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box component="img" src={WatchlistIcon} sx={{ width: '20px', height: '20px' }} />
                        </Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#807E81', fontFamily: 'Gilroy Medium' }}>{VIDEO_PLAYER_LABELS.LABEL_WATCHLIST}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Box
                            sx={{
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box component="img" src={FrameIcon} sx={{ width: '20px', height: '20px' }} />
                        </Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#807E81', fontFamily: 'Gilroy Medium' }}>{VIDEO_PLAYER_LABELS.LABEL_SHARE}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Box
                            sx={{
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box component="img" src={DownloadIcon} sx={{ width: '20px', height: '20px' }} />
                        </Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 400, color: '#1884F7', fontFamily: 'Gilroy Medium' }}>{VIDEO_PLAYER_LABELS.LABEL_DOWNLOAD}</Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Description Section */}
            <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 500,
                        color: '#27313F',
                        mb: 2
                    }}
                >
                    {VIDEO_PLAYER_LABELS.DESCRIPTION_TITLE}
                </Typography>
                <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#807E81',
                        lineHeight: 1.6,
                        maxWidth: '100%'
                    }}
                >
                    {VIDEO_PLAYER_LABELS.DESCRIPTION_TEXT}
                </Typography>
            </Box>

            {!showPlaylist ? (
                /* Related Videos Section */
                <Box sx={{ mt: 2, textAlign: 'left' }}>
                    <Typography
                        sx={{
                            fontSize: '32px',
                            fontFamily: 'Lexend',
                            fontWeight: 600,
                            color: '#27313F',
                            mb: 2
                        }}
                    >
                        {VIDEO_PLAYER_LABELS.RELATED_VIDEOS_TITLE}
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: VIDEO_PLAYER_CONSTANTS.GRID_GAP
                        }}
                    >
                        {relatedVideos.map((video) => (
                            <Box
                                key={video.id}
                                onClick={() => setShowPlaylist(true)}
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '1.4/1',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            >
                                {/* Background Rectangle */}
                                <Box
                                    component="img"
                                    src={RectangleIcon}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                                {/* Play Button Overlay */}
                                <Box
                                    component="img"
                                    src={ButtonIcon}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '48px',
                                        height: '48px'
                                    }}
                                />
                                {/* Title Overlay */}
                                <Typography
                                    sx={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: '20px',
                                        fontSize: '20px',
                                        fontFamily: 'Lexend',
                                        fontWeight: 600,
                                        color: '#FFFFFF',
                                        pb: '8px',
                                    }}
                                >
                                    {video.title}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ) : (
                /* Playlists Section */
                <Box
                    sx={{
                        mt: 4,
                        textAlign: 'left',
                        backgroundColor: '#1A1A1A',
                        borderRadius: '12px',
                        padding: VIDEO_PLAYER_CONSTANTS.PLAYLIST_PADDING,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '24px',
                            fontFamily: 'manrope',
                            fontWeight: 600,
                            color: '#FFFFFF',
                            mb: 4
                        }}
                    >
                        {VIDEO_PLAYER_LABELS.PLAYLISTS_TITLE}
                    </Typography>

                    <Box
                        sx={{
                            backgroundColor: '#0F0F0F',
                            borderRadius: '12px',
                            padding: VIDEO_PLAYER_CONSTANTS.PLAYLIST_PADDING,
                            border: '1px solid #262626',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '40px',
                            maxWidth: '1300px',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, fontFamily: 'lexend' }}>
                                    {VIDEO_PLAYER_LABELS.RECOMMENDED}
                                </Typography>
                                <Typography sx={{ color: '#999999', fontSize: '18px', fontWeight: 400, fontFamily: 'Manrope' }}>
                                    {VIDEO_PLAYER_LABELS.VIDEO_COUNT}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={() => setShowPlaylist(false)}
                            >
                                <Box
                                    component="img"
                                    src={UpArrowIcon}
                                    sx={{
                                        width: '40px',
                                        height: '40px',
                                        cursor: 'pointer'
                                    }}
                                />
                            </IconButton>
                        </Box>

                        <Stack spacing={0}>
                            {playlistItems.map((item, index) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        gap: '32px',
                                        alignItems: 'flex-start',
                                        borderTop: index === 0 ? '1px solid #262626' : 'none',
                                        borderBottom: '1px solid #262626',
                                        py: 4,
                                    }}
                                >
                                    {/* Chapter Number */}
                                    <Typography sx={{ color: '#999999', fontSize: '24px', fontWeight: 700, mt: 4, fontFamily: 'Manrope', minWidth: '40px' }}>
                                        {item.id}
                                    </Typography>

                                    {/* Thumbnail Placeholder */}
                                    <Box
                                        sx={{
                                            width: VIDEO_PLAYER_CONSTANTS.THUMBNAIL_WIDTH,
                                            height: VIDEO_PLAYER_CONSTANTS.THUMBNAIL_HEIGHT,
                                            backgroundColor: '#1A1A1A',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            position: 'relative',
                                            border: '1px solid #262626'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={ButtonIcon}
                                            sx={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '67px'
                                            }}
                                        />
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, fontFamily: 'Manrope' }}>
                                                {item.title}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    backgroundColor: '#141414',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #262626'
                                                }}
                                            >
                                                <Box component="img" src={TimeIcon} sx={{ width: '16px', height: '16px' }} />
                                                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 400, opacity: 0.8, fontFamily: 'Manrope' }}>
                                                    {item.duration}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography sx={{ color: '#999999', fontSize: '14px', fontWeight: 400, fontFamily: 'Manrope', lineHeight: 1.6 }}>
                                            {item.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default VideoPlayer;
