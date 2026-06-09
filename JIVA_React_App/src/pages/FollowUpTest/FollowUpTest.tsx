import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import MaskGroup from '../../assets/Mask group.svg';
import CalendarScheduleIcon from '../../assets/calendar-schedule.svg';
import DeleteSquareIcon from '../../assets/Delete-square.svg';
import DirectionIcon from '../../assets/Direction.svg';
import MapLocationIcon from '../../assets/Map-Location.svg';
import ArcadeLocationIcon from '../../assets/Arcade-location.svg';
import PhoneIcon from '../../assets/Phone.svg';
import HeartRateIcon from '../../assets/Heart-rate.svg';
import DumbellIcon from '../../assets/Dumbell.svg';
import TabletIcon from '../../assets/Tablet.svg';
import WaterGlassIcon from '../../assets/Water-Glass.svg';
import WaterBottleIcon from '../../assets/Water-Bottle.svg';
import IdentityCardIcon from '../../assets/Identity-Card.svg';
import { FOLLOW_UP_TEST_CONSTANTS } from './constants';
import { FOLLOW_UP_TEST_LABELS } from './labels';

const FollowUpTest: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'prepare' | 'biomarkers'>('prepare');

    return (
        <Box sx={{ width: '100%', maxWidth: FOLLOW_UP_TEST_CONSTANTS.MAX_WIDTH, margin: '0 auto', p: FOLLOW_UP_TEST_CONSTANTS.CONTAINER_PADDING, textAlign: 'left' }}>
            {/* Header */}
            <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#1B1B1F', fontFamily: 'DM Sans, sans-serif', mb: 1 }}>
                {FOLLOW_UP_TEST_LABELS.TITLE}
            </Typography>
            <Typography sx={{ fontSize: '15px', color: '#667085', fontFamily: 'Inter, sans-serif', mb: 4, fontWeight: 500 }}>
                {FOLLOW_UP_TEST_LABELS.SUBTITLE}
            </Typography>

            {/* Map Area */}
            <Box sx={{
                width: '100%',
                height: FOLLOW_UP_TEST_CONSTANTS.MAP_HEIGHT,
                borderRadius: FOLLOW_UP_TEST_CONSTANTS.MAP_RADIUS,
                overflow: 'hidden',
                mb: 3,
                position: 'relative'
            }}>
                <Box
                    component="img"
                    src={MaskGroup}
                    alt="Map"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                    component="img"
                    src={MapLocationIcon}
                    alt="Location Pin"
                    sx={FOLLOW_UP_TEST_CONSTANTS.MAP_PIN_STYLE}
                />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<img src={CalendarScheduleIcon} alt="reschedule" style={{ width: 18, height: 18 }} />}
                    sx={{
                        borderRadius: FOLLOW_UP_TEST_CONSTANTS.BUTTON_RADIUS,
                        borderColor: '#256111',
                        color: '#006045',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3.5,
                        py: 1,
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                            borderColor: '#006045',
                            backgroundColor: '#F3FAF7',
                        }
                    }}
                >
                    {FOLLOW_UP_TEST_LABELS.BUTTON_RESCHEDULE}
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<img src={DeleteSquareIcon} alt="cancel" style={{ width: 18, height: 18 }} />}
                    sx={{
                        borderRadius: FOLLOW_UP_TEST_CONSTANTS.BUTTON_RADIUS,
                        borderColor: '#256111',
                        color: '#006045',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3.5,
                        py: 1,
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                            borderColor: '#006045',
                            backgroundColor: '#F3FAF7',
                        }
                    }}
                >
                    {FOLLOW_UP_TEST_LABELS.BUTTON_CANCEL}
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<img src={DirectionIcon} alt="directions" style={{ width: 18, height: 18 }} />}
                    sx={{
                        borderRadius: FOLLOW_UP_TEST_CONSTANTS.BUTTON_RADIUS,
                        borderColor: '#256111',
                        color: '#006045',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3.5,
                        py: 1,
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                            borderColor: '#006045',
                            backgroundColor: '#F3FAF7',
                        }
                    }}
                >
                    {FOLLOW_UP_TEST_LABELS.BUTTON_DIRECTIONS}
                </Button>
            </Box>

            <Box sx={{ mt: 5 }}>
                {/* Details List */}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Row 1 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #EAECF0' }}>
                        <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                            <img src={ArcadeLocationIcon} alt="location" style={{ width: 20, height: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', lineHeight: '26px' }}>{FOLLOW_UP_TEST_LABELS.LAB_NAME}</Typography>
                            <Typography sx={{ color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '16px', lineHeight: '26px' }}>{FOLLOW_UP_TEST_LABELS.LAB_ADDRESS}</Typography>
                        </Box>
                    </Box>

                    {/* Row 2 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #EAECF0' }}>
                        <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                            <img src={PhoneIcon} alt="phone" style={{ width: 20, height: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', lineHeight: '26px' }}>{FOLLOW_UP_TEST_LABELS.PHONE_LABEL}</Typography>
                            <Typography sx={{ color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '16px', lineHeight: '26px' }}>{FOLLOW_UP_TEST_LABELS.PHONE_NUMBER}</Typography>
                        </Box>
                    </Box>

                    {/* Row 3 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #EAECF0' }}>
                        <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                            <img src={HeartRateIcon} alt="heart rate" style={{ width: 20, height: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', lineHeight: '26px' }}>{FOLLOW_UP_TEST_LABELS.ORDERED_BY_LABEL}</Typography>
                            <Typography sx={{ color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '16px', lineHeight: '26px' }}>{FOLLOW_UP_TEST_LABELS.ORDERED_BY_NAME}</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ display: 'flex', mt: 6, borderBottom: '1px solid #EAECF0' }}>
                    <Box 
                        onClick={() => setActiveTab('prepare')}
                        sx={{ pb: 1.5, pr: 4, borderBottom: activeTab === 'prepare' ? '2.5px solid #1A212B' : '2.5px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Typography sx={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '16px', lineHeight: '24px', color: activeTab === 'prepare' ? '#1A212B' : '#475467' }}>{FOLLOW_UP_TEST_LABELS.TAB_PREPARE}</Typography>
                    </Box>
                    <Box 
                        onClick={() => setActiveTab('biomarkers')}
                        sx={{ pb: 1.5, px: 4, borderBottom: activeTab === 'biomarkers' ? '2.5px solid #1A212B' : '2.5px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Typography sx={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '16px', lineHeight: '24px', color: activeTab === 'biomarkers' ? '#1A212B' : '#475467' }}>{FOLLOW_UP_TEST_LABELS.TAB_BIOMARKERS}</Typography>
                    </Box>
                </Box>

                {/* Content Area */}
                {activeTab === 'prepare' ? (
                    <Box sx={{ mt: 4 }}>
                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '24px', color: '#000000', mb: 3 }}>
                            {FOLLOW_UP_TEST_LABELS.PREP_HEADING_DAYS}
                        </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Prep Row 1 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: FOLLOW_UP_TEST_CONSTANTS.PREP_ROW_BORDER }}>
                            <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={TabletIcon} alt="tablet" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>{FOLLOW_UP_TEST_LABELS.PREP_SUPPLEMENTS_TITLE}</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    {FOLLOW_UP_TEST_LABELS.PREP_SUPPLEMENTS_DESC}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Prep Row 2 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: FOLLOW_UP_TEST_CONSTANTS.PREP_ROW_BORDER }}>
                            <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={WaterGlassIcon} alt="glass" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>{FOLLOW_UP_TEST_LABELS.PREP_FAST_TITLE}</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    {FOLLOW_UP_TEST_LABELS.PREP_FAST_DESC}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Prep Row 3 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: FOLLOW_UP_TEST_CONSTANTS.PREP_ROW_BORDER }}>
                            <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={DumbellIcon} alt="dumbell" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>{FOLLOW_UP_TEST_LABELS.PREP_EXERCISE_TITLE}</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    {FOLLOW_UP_TEST_LABELS.PREP_EXERCISE_DESC}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '24px', color: '#000000', mt: 5, mb: 1 }}>
                            {FOLLOW_UP_TEST_LABELS.PREP_HEADING_MORNING}
                        </Typography>

                        {/* Morning Row */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: FOLLOW_UP_TEST_CONSTANTS.PREP_ROW_BORDER }}>
                            <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={WaterBottleIcon} alt="water bottle" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>{FOLLOW_UP_TEST_LABELS.PREP_DRINK_TITLE}</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    {FOLLOW_UP_TEST_LABELS.PREP_DRINK_DESC}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '24px', color: '#000000', mt: 5, mb: 1 }}>
                            {FOLLOW_UP_TEST_LABELS.PREP_HEADING_VISIT}
                        </Typography>

                        {/* At Visit Row 1 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: FOLLOW_UP_TEST_CONSTANTS.PREP_ROW_BORDER }}>
                            <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={CalendarScheduleIcon} alt="arrive early" style={{ width: 20, height: 20, filter: 'brightness(0)' }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>{FOLLOW_UP_TEST_LABELS.PREP_ARRIVE_TITLE}</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    {FOLLOW_UP_TEST_LABELS.PREP_ARRIVE_DESC}
                                </Typography>
                            </Box>
                        </Box>

                        {/* At Visit Row 2 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid transparent' }}>
                            <Box sx={{ width: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, height: FOLLOW_UP_TEST_CONSTANTS.ICON_CONTAINER_SIZE, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={IdentityCardIcon} alt="identity card" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>{FOLLOW_UP_TEST_LABELS.PREP_ID_TITLE}</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    {FOLLOW_UP_TEST_LABELS.PREP_ID_DESC}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                ) : (
                    <Box sx={{ mt: 6, py: 6, textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px dashed #E5E7EB' }}>
                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '18px', color: '#667085' }}>
                            {FOLLOW_UP_TEST_LABELS.BIOMARKERS_COMING_SOON}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default FollowUpTest;
