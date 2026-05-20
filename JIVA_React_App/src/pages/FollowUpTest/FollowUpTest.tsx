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

const FollowUpTest: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'prepare' | 'biomarkers'>('prepare');

    return (
        <Box sx={{ width: '100%', maxWidth: '1400px', margin: '0 auto', p: 4, textAlign: 'left' }}>
            {/* Header */}
            <Typography sx={{ fontSize: '36px', fontWeight: 700, color: '#1B1B1F', fontFamily: 'DM Sans, sans-serif', mb: 1 }}>
                Follow-Up Test
            </Typography>
            <Typography sx={{ fontSize: '15px', color: '#667085', fontFamily: 'Inter, sans-serif', mb: 4, fontWeight: 500 }}>
                Tuesday August 26, 2025
            </Typography>

            {/* Map Area */}
            <Box sx={{
                width: '100%',
                height: '180px',
                borderRadius: '16px',
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
                    sx={{ position: 'absolute', top: '50%', left: '20%', width: '32px', height: '32px', transform: 'translate(-50%, -50%)' }}
                />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<img src={CalendarScheduleIcon} alt="reschedule" style={{ width: 18, height: 18 }} />}
                    sx={{
                        borderRadius: '12px',
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
                    Reschedule
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<img src={DeleteSquareIcon} alt="cancel" style={{ width: 18, height: 18 }} />}
                    sx={{
                        borderRadius: '12px',
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
                    Cancel
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<img src={DirectionIcon} alt="directions" style={{ width: 18, height: 18 }} />}
                    sx={{
                        borderRadius: '12px',
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
                    Directions
                </Button>
            </Box>

            <Box sx={{ mt: 5 }}>
                {/* Details List */}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Row 1 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #EAECF0' }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                            <img src={ArcadeLocationIcon} alt="location" style={{ width: 20, height: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', lineHeight: '26px' }}>Quest Diagnostics</Typography>
                            <Typography sx={{ color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '16px', lineHeight: '26px' }}>11914 Astoria Blvd Ste 110, Housten, TX 77089 (ANA) Pattern</Typography>
                        </Box>
                    </Box>

                    {/* Row 2 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #EAECF0' }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                            <img src={PhoneIcon} alt="phone" style={{ width: 20, height: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', lineHeight: '26px' }}>Lab Phone (Text Only)</Typography>
                            <Typography sx={{ color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '16px', lineHeight: '26px' }}>(914) 735-1876</Typography>
                        </Box>
                    </Box>

                    {/* Row 3 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #EAECF0' }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                            <img src={HeartRateIcon} alt="heart rate" style={{ width: 20, height: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', lineHeight: '26px' }}>Who Ordered My Tests?</Typography>
                            <Typography sx={{ color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '16px', lineHeight: '26px' }}>Shrinivasa Bopana</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ display: 'flex', mt: 6, borderBottom: '1px solid #EAECF0' }}>
                    <Box 
                        onClick={() => setActiveTab('prepare')}
                        sx={{ pb: 1.5, pr: 4, borderBottom: activeTab === 'prepare' ? '2.5px solid #1A212B' : '2.5px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Typography sx={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '16px', lineHeight: '24px', color: activeTab === 'prepare' ? '#1A212B' : '#475467' }}>How to Prepare</Typography>
                    </Box>
                    <Box 
                        onClick={() => setActiveTab('biomarkers')}
                        sx={{ pb: 1.5, px: 4, borderBottom: activeTab === 'biomarkers' ? '2.5px solid #1A212B' : '2.5px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        <Typography sx={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '16px', lineHeight: '24px', color: activeTab === 'biomarkers' ? '#1A212B' : '#475467' }}>Biomarkers</Typography>
                    </Box>
                </Box>

                {/* Content Area */}
                {activeTab === 'prepare' ? (
                    <Box sx={{ mt: 4 }}>
                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '24px', color: '#000000', mb: 3 }}>
                            Your first lab visit in 2 days
                        </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Prep Row 1 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #C8D0DB' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={TabletIcon} alt="tablet" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>Stop Supplements</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    Stop taking supplements staring from Monday August 25th, At least 24 hours before your visit, as it can screw results. Continue doctor prescribed medication.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Prep Row 2 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #C8D0DB' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={WaterGlassIcon} alt="glass" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>8- Hours Fast</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    Enjoy the light Healthy meal prior to fasting. Start Fasting 8 Hours before the visit, with no food or drinks (Including coffee and alcohol)
                                </Typography>
                            </Box>
                        </Box>

                        {/* Prep Row 3 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #C8D0DB' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={DumbellIcon} alt="dumbell" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>Continue Exercise</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    Stop taking supplements staring from Monday August 25th, At least 24 hours before your visit, as it can screw results. Continue doctor prescribed medication. However drink plenty of water during and after your fast
                                </Typography>
                            </Box>
                        </Box>

                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '24px', color: '#000000', mt: 5, mb: 1 }}>
                            Morning of the visit
                        </Typography>

                        {/* Morning Row */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #C8D0DB' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={WaterBottleIcon} alt="water bottle" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>Drink at least 1L(4 Cups of water)</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    Good Hydration helps for easier blood draw and Urine Samples
                                </Typography>
                            </Box>
                        </Box>

                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '24px', color: '#000000', mt: 5, mb: 1 }}>
                            At visit
                        </Typography>

                        {/* At Visit Row 1 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid #C8D0DB' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={CalendarScheduleIcon} alt="arrive early" style={{ width: 20, height: 20, filter: 'brightness(0)' }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>Arrive 10 min Early</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    If you arrive even 10 min late you will likely lose your slot.
                                </Typography>
                            </Box>
                        </Box>

                        {/* At Visit Row 2 */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 3, borderBottom: '1px solid transparent' }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#D8FDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, flexShrink: 0 }}>
                                <img src={IdentityCardIcon} alt="identity card" style={{ width: 20, height: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>Proper Identification</Typography>
                                <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '14px', color: '#728197', maxWidth: '1000px', lineHeight: 1.5 }}>
                                    Bring your ID to the appointment from Monday August 25th, At least 24 hours before your visit, as it can screw results. Continue doctor prescribed medication.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                ) : (
                    <Box sx={{ mt: 6, py: 6, textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px dashed #E5E7EB' }}>
                        <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600, fontSize: '18px', color: '#667085' }}>
                            Biomarkers List Coming Soon
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default FollowUpTest;
