import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import AuthLeftSide from './Component/AuthLeftSide/AuthLeftSide';
import Navbar from './Component/Navbar/Navbar';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import Success from './pages/Success/Success';
import Payment from './pages/Payment/Payment';
import Dashboard from './pages/Dashboard/Dashboard';
import PersonalInfo from './pages/PersonalInfo/PersonalInfo';
import VitalityMap from './pages/VitalityMap/VitalityMap';
import VitalityMap2 from './pages/VitalityMap2/VitalityMap2';
import ActionPlan from './pages/ActionPlan/ActionPlan';
import VideoPlayer from './pages/VideoPlayer/VideoPlayer';
import { ScheduleProvider } from './context/ScheduleContext';
import './App.css';
import AutoImmunity from './pages/AutoImmunity/AutoImmunity';
import RheumatoidFactor from './pages/RheumatoidFactor/RheumatoidFactor';
import YourHealth from './pages/YourHealth/YourHealth';
import FollowUpTest from './pages/FollowUpTest/FollowUpTest';
import Welcome from './pages/Welcome/Welcome';
import SelectPackages from './pages/SelectPackages/SelectPackages';
import BiomarkerDetail from './pages/BiomarkerDetail/BiomarkerDetail';
import Intake from './pages/Intake/Intake';
import HealthQuestionnaire from './pages/HealthQuestionnaire/HealthQuestionnaire';
import theme from './theme';

const App: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();
  const pagesWithoutNavbar = ['/', '/signin', '/signup', '/success', '/welcome', '/select-packages', '/intake'];
  const authPages = ['/', '/signin', '/signup', '/success', '/welcome', '/select-packages', '/intake'];
  const shouldShowNavbar = !pagesWithoutNavbar.includes(currentPath);
  const shouldShowAuthLeftSide = authPages.includes(currentPath);

  return (
    <ScheduleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {shouldShowNavbar && <Navbar />}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              backgroundColor: 'transparent',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Default centering for content
            }}
          >
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/Signin" element={<Navigate to="/signin" replace />} />
                <Route path="/Singup" element={<Navigate to="/signup" replace />} /> */}
              <Route path="/success" element={<Success />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/vitality-map" element={<VitalityMap />} />
              <Route path="/vitality-map-2" element={<VitalityMap2 />} />
              <Route path="/biomarker/:name" element={<BiomarkerDetail />} />
              <Route path="/action-plan" element={<ActionPlan />} />
              <Route path="/auto-immunity" element={<AutoImmunity />} />
              <Route path="/rheumatoid-factor" element={<RheumatoidFactor />} />
              <Route path="/your-health" element={<YourHealth />} />
              <Route path="/follow-up-test" element={<FollowUpTest />} />
              <Route path="/video-player" element={<VideoPlayer />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/select-packages" element={<SelectPackages />} />
              <Route path="/intake" element={<Intake />} />
              <Route path="/questionnaire" element={<HealthQuestionnaire />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ScheduleProvider>
  );
};

export default App;