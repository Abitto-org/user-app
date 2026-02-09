import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/dashboard';
import { AuthLayout } from '@/layouts/auth';
import { Dashboard } from '@/pages/dashboard';
import { Login } from '@/pages/login';
import { Register } from '@/pages/register';
import { VerifyOtp } from '@/pages/verify-otp';
import { Onboarding } from '@/pages/onboarding';
import { OnboardingSuccess } from '@/pages/onboarding-success';
import { AuthGuard, ProtectedRoute } from '@/component/route-guards';

function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Route>

      {/* Requires token only (onboarding not yet completed) */}
      <Route element={<AuthGuard />}>
        <Route element={<AuthLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
        <Route path="/onboarding-success" element={<OnboardingSuccess />} />
      </Route>

      {/* Requires token + onboarding completed */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
