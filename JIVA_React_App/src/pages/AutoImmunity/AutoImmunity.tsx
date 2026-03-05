import React from 'react';
import { Box, Typography, Button, Grid, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/600.css';
import '@fontsource/raleway/700.css';
import '@fontsource/raleway/800.css';

const AutoImmunity: React.FC = () => {
    return (
        <Box sx={{ width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '40px 32px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Breadcrumbs */}
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        backgroundColor: '#F9FAFB',
                        borderRadius: '16px',
                        px: 3,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #F2F4F7'
                    }}
                >
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#98A2B3' }} />}
                        aria-label="breadcrumb"
                        sx={{
                            '& .MuiBreadcrumbs-li': { color: '#667085', fontSize: '14px', fontWeight: 500 },
                            '& .MuiBreadcrumbs-separator': { mx: 1 }
                        }}
                    >
                        <MuiLink underline="none" color="inherit" href="#">Home</MuiLink>
                        <MuiLink underline="none" color="inherit" href="#">Blog</MuiLink>
                        <MuiLink underline="none" color="inherit" href="#">Blog writing</MuiLink>
                        <Typography sx={{ color: '#006045', fontWeight: 700, fontSize: '14px' }}>You are here</Typography>
                    </Breadcrumbs>
                </Box>
            </Box>

            <Grid container spacing={5}>
                {/* Main Content */}
                <Grid size={{ xs: 12, md: 7.5 }}>
                    <Box
                        sx={{
                            backgroundColor: '#F1F5F9',
                            borderRadius: '40px',
                            height: { xs: 'auto', md: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            border: '1px solid #E4E7EC',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Top Content Area */}
                        <Box sx={{ p: 6, flexGrow: 1 }}>
                            <Typography
                                // variant="h1"
                                sx={{
                                    fontSize: '54px',
                                    fontWeight: 700,
                                    background: 'linear-gradient(180deg, #000000 0%, #001354 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 4,
                                    fontFamily: 'Inter',
                                    textAlign: 'left',

                                }}
                            >
                                Auto Immunity
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '22px',
                                    color: '#010D3E',
                                    mb: 8,
                                    fontWeight: 400,
                                    opacity: 0.9,
                                    fontFamily: 'Inter, sans-serif',
                                    textAlign: 'left',
                                }}
                            >
                                Autoimmunity is when your immune system attacks your body's own tissues rather than harmful pathogens.
                            </Typography>

                            {/* Biomarker List */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                {[1, 2, 3].map((item) => (
                                    <Box key={item} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                        <Box
                                            sx={{
                                                width: '10px',
                                                height: '50px',
                                                backgroundColor: '#BAEBD7',
                                                borderRadius: '5px',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    color: '#1A212B',
                                                    // mb: 0.5,
                                                    fontFamily: 'source sans pro'
                                                }}
                                            >
                                                Anti Nuclear Antibodies (ANA) Pattern
                                            </Typography>
                                            <Typography sx={{ fontSize: '16px', color: '#27313F', fontWeight: 400, fontFamily: 'source sans pro', textAlign: 'left' }}>
                                                <span style={{ color: '#1A212B', fontWeight: 600, }}>In Range</span> 410 nmol/ L
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* FAQ Footer Area - Pinned to bottom */}
                        <Box
                            sx={{
                                backgroundColor: '#A3B0C2',
                                p: 5,
                                mt: 'auto',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                textAlign: 'left'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#FFFFFF',
                                    // mb: 2,
                                    fontFamily: 'Raleway, sans-serif'
                                }}
                            >
                                Frequently asked questions about Auto Immunity
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, fontFamily: 'Raleway, sans-serif' }}>Oct 19</Typography>
                                <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, fontFamily: 'Raleway, sans-serif' }}>•</Typography>
                                <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, fontFamily: 'Raleway, sans-serif' }}>10 min read</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Sidebar */}
                <Grid size={{ xs: 12, md: 4.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: { xs: 'auto', md: '100%' } }}>
                        {/* What is the Range? Card */}
                        <Box
                            sx={{
                                // width: '385px',
                                height: '370px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '32px',
                                p: 3,
                                border: '0.5px solid #B1C2DC',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    color: '#1A212B',
                                    textAlign: 'left',
                                    mb: 1,
                                    fontFamily: 'Source Sans Pro, sans-serif'
                                }}
                            >
                                What is the Range ?
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '16px',
                                    px: 2,
                                    py: 0.5,
                                    display: 'inline-block',
                                    mb: 1,
                                    alignSelf: 'flex-start',
                                    border: '1px solid #E4E7EC'
                                }}
                            >
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#667085' }}>30.1 is the bio Jan 2025</Typography>
                            </Box>

                            {/* Legend */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#BAEBD7' }} />
                                    <Typography sx={{ fontSize: '10px', color: '#98A2B3', fontWeight: 700, letterSpacing: '0.05em' }}>IN RANGE</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#475467' }} />
                                    <Typography sx={{ fontSize: '10px', color: '#98A2B3', fontWeight: 700, letterSpacing: '0.05em' }}>OUT OF RANGE</Typography>
                                </Box>
                            </Box>

                            {/* SVG Chart */}
                            <Box sx={{ height: '260px', width: '100%', position: 'relative' }}>
                                <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
                                    <defs>
                                        {/* Figma Gradients from VitalityMap */}
                                        <linearGradient id="rangeGradTeal" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#81FDCA" />
                                            <stop offset="100%" stopColor="#54AD88" />
                                        </linearGradient>
                                        <linearGradient id="rangeGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#90DCCE" />
                                            <stop offset="100%" stopColor="#58968A" />
                                        </linearGradient>

                                        {/* Exact 4x4 Slanted Lines Pattern from VitalityMap */}
                                        <pattern id="preciseStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                                            <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                                        </pattern>
                                    </defs>

                                    {/* 12 GRID LINES for better depth */}
                                    {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220].map((y) => (
                                        <line key={y} x1="30" y1={250 - y} x2="380" y2={250 - y} stroke="#F2F4F7" strokeWidth="1.5" />
                                    ))}

                                    {/* Groups */}
                                    {/* Group 1 (IN RANGE) - Jan 15 & Sep 25 */}
                                    <text x="85" y="45" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>88</text>
                                    <rect x="70" y="55" width="30" height="195" rx="10" fill="url(#rangeGradTeal)" />
                                    <rect x="73" y="60" width="24" height="185" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="85" cy="65" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="85" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3', fontFamily: 'Inter' }}>Jan 15</text>

                                    <text x="125" y="25" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>88</text>
                                    <rect x="110" y="35" width="30" height="215" rx="10" fill="url(#rangeGradTeal)" />
                                    <rect x="113" y="40" width="24" height="205" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="125" cy="45" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="125" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3', fontFamily: 'Inter' }}>Sep 25</text>

                                    {/* Group 2 (OUT OF RANGE) - Jan 15 & Sep 25 */}
                                    <text x="275" y="125" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>16</text>
                                    <rect x="260" y="135" width="30" height="115" rx="10" fill="#475467" opacity="0.8" />
                                    <rect x="263" y="140" width="24" height="105" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="275" cy="145" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="275" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3', fontFamily: 'Inter' }}>Jan 15</text>

                                    <text x="315" y="135" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>16</text>
                                    <rect x="300" y="145" width="30" height="105" rx="10" fill="#475467" opacity="0.8" />
                                    <rect x="303" y="150" width="24" height="95" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="315" cy="155" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="315" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3', fontFamily: 'Inter' }}>Sep 25</text>

                                    {/* Baseline */}
                                    <line x1="30" y1="250" x2="380" y2="250" stroke="#F2F4F7" strokeWidth="2" />
                                </svg>
                            </Box>
                        </Box>

                        {/* Clinical Notes Card */}
                        <Box sx={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '40px',
                            border: '1px solid #B1C2DC',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ px: 3, py: 2, flexGrow: 1, textAlign: 'left' }}>
                                <Typography
                                    sx={{
                                        fontSize: '28px',
                                        fontWeight: 600,
                                        color: '#1A212B',
                                        mb: 2,
                                        fontFamily: 'Source Sans Pro, sans-serif'
                                    }}
                                >
                                    Clinical Notes
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        color: '#475467',
                                        lineHeight: '1.6',
                                        mb: 5,
                                        fontFamily: 'Source Sans Pro, sans-serif'
                                    }}
                                >
                                    Autoimmunity is when your immune system attacks your body's own tissues rather than harmful pathogens. You may be left with more questions than answers. And that's ok. Education is the first step.
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    p: 3,
                                    borderTop: '1px solid #B1C2DC',
                                    mt: 'auto'
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '16px',
                                        borderColor: '#256111',
                                        color: '#256111',
                                        fontWeight: 500,
                                        px: 4,
                                        height: '46px',
                                        fontSize: '16px',
                                        fontFamily: 'lexend',

                                    }}
                                >
                                    Read More
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Article Section */}
            <Box sx={{ pt: 8, }}>
                <Grid container spacing={8}>
                    {/* Main Article Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: '27px',
                                fontWeight: 700,
                                color: '#1B1B1F',
                                mb: 4,
                                fontFamily: 'Raleway, sans-serif',
                                textAlign: 'left',

                            }}
                        >
                            About Auto Immunity
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let me share from my firsthand experience.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                Google encourages high-quality blogs regardless of whether they're <span style={{ color: '#3D22CF' }}>written by humans or created using artificial intelligence</span> like ChatGPT. Here's what matters: producing original material with expertise and trustworthiness based on Google <span style={{ color: '#3D22CF' }}>E-E-A-T principles</span>.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                This means focusing more on people-first writing rather than primarily employing AI tools to manipulate search rankings. There comes a time when many experienced professionals want to communicate their insights but get stuck due to limited writing skills – that's where <b>Generative AI</b> can step in.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                So, together, we're going explore how this technology could help us deliver valuable content without sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common pitfalls!). Hang tight - it'll be a fun learning journey!
                            </Typography>

                            {/* Facts Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                Facts
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Jumping headfirst into using AI, like <span style={{ color: '#3D22CF' }}>ChatGPT</span>, without a content strategy can lead to some unfortunate results. One common pitfall I've seen is people opting for <b>quantity over quality</b> - they churn out blogs, but each one feels robotic and soulless, reading just like countless others on the internet.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Another fault line lies in <b>creating reproductions</b> rather than delivering unique perspectives that offer value to readers; it often happens if you let an AI tool write your full blog unrestrained! Trust me on this – Ask any experienced marketer or writer about their takeaways from using generative AI tools. They'll all agree that adding a human touch and following specific guidelines are key when implementing these tech pieces.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Remember, our goal here isn't merely satisfying search engines but, more importantly, <b>knowledge-hungry humans seeking reliable information online</b>. So keep your audience's needs at heart while leveraging technology's assistance!
                                </Typography>
                            </Box>

                            {/* Understanding & Recommendations Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                Understanding & Recommendations
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Welcome to the intriguing world of ChatGPT! Its ability and potential can truly be mind-boggling. I have learned from experience how capable it is in dealing with diverse content generation tasks, only that its text sounded slightly "unnatural" <span style={{ color: '#3D22CF' }}>in accordance with TechTarget</span>. However, fear not – there are ways around this!
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    One strategic move I’ve seen work wonders is <b>defining your unique writing style</b> first before handing over the reins to AI; you treat it like a canvas whereupon our vision opens up. If we clearly instruct who we're targeting or what tone resonates more effectively, generative AI tools such as ChatGPT will comply remarkably well.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    In framing guidelines, remember to keep audience interests at heart while adopting technology's benefits for efficient output – trust me on this because neglecting these aspects could backfire by generating unappealing robotic-like reads.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Ultimately, aiming towards reader-focused driven creativity illuminated under authentically humanized narratives holds priority above all else when crafting blogs using auto-generation toolkits!
                                </Typography>
                            </Box>

                            {/* Exploring the Condition Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                Exploring the Condition
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Understanding your readers is vital when producing blog posts. It's not about filling blanks with popular search terms, no matter how much keyword research you do. Real readability goes beyond that! Your content has to 'speak' directly to your target audience.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Building an <b>Ideal Customer Profile (ICP)</b> can help immensely in this respect (<span style={{ color: '#3D22CF' }}>Dan Martell</span>). This tool identifies specific firmographics or psychographic drivers behind customer success - a valuable guide for creating targeted outputs catering to arrayed reader types.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Simultaneously, SEO aspects also need attention: identifying suitable keywords & phrases people commonly use enhances reach (SEO.COM reference). Yet remember – human appeal doesn’t mean packing text up finely into presentable semblances bearing little value substance and stuffing it full with only 'keywords.'
                                </Typography>
                            </Box>

                            {/* Best Practise Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                Best Practise
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Creating brilliant AI-powered blogs is a fun blending of logic with just the right dose of creativity. From defining your target audience to tuning in ChatGPT's language style, every step counts towards creating content that's not only SEO-friendly but also enjoyable and valuable for readers.
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    One tactic I've found useful is maintaining originality in message essence, with <b>unique perspectives</b> infusing life beyond words onto pages!
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    Incorporating trusted references while optimizing blog posts intelligently (rather than keyword stuffing) can significantly aid quality enhancements. Remember, it isn't about writing for Google here, so avoid tunnel vision focusing solely on algorithm-driven success rate, aiming at heart-touching human connections, building loyal reader bases, and sharing knowledge benefiting others!
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Sidebar: In this article */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: 'sticky', top: 40 }}>
                            <Typography
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: '#1B1B1F',
                                    mb: 4,
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                In this article
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pl: 3, textAlign: 'left' }}>
                                {[
                                    { text: 'About Auto Immunity', active: true },
                                    { text: 'Steering Clear - Facts', active: false },
                                    { text: 'Understanding & Recommendations', active: false },
                                    { text: 'Steering Clear - Facts', active: false },
                                    { text: 'Creating Quality AI-powered Blogs that Stand Out', active: false },
                                    { text: 'Conclusion', active: false },
                                    { text: 'Afterword: Behind This Article', active: false }
                                ].map((item, index) => (
                                    <Typography
                                        key={index}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: item.active ? 700 : 400,
                                            color: item.active ? '#3D22CF' : '#1B1B1F',
                                            fontFamily: 'Raleway, sans-serif',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            position: 'relative',
                                            '&:hover': { color: '#3D22CF' },
                                            ...(item.active && {
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: '-24px',
                                                    top: '-10px',
                                                    bottom: '-10px',
                                                    width: '3.5px',
                                                    backgroundColor: '#3D22CF',
                                                    borderRadius: '4px'
                                                }
                                            })
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AutoImmunity;
