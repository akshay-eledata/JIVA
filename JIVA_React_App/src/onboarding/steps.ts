// Single source of truth for the onboarding order.
//
// The flow is: create an account, optionally confirm a phone for two factor,
// answer the intake questionnaire, choose a panel, pay, then book the lab
// visit. Every screen reads the next route from here so the order only ever
// changes in one place.

export interface OnboardingStep {
  /** Route this step lives at. */
  path: string;
  /** Short name for the progress rail. */
  label: string;
  /** Where "Continue" and the demo skip control go next. */
  next: string;
  /**
   * Optional steps are not counted in the progress rail (phone confirmation
   * only appears when the user asked for two factor).
   */
  optional?: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { path: '/signup', label: 'Account', next: '/intake' },
  { path: '/verify-phone', label: 'Verify', next: '/intake', optional: true },
  { path: '/intake', label: 'Questionnaire', next: '/select-packages' },
  { path: '/select-packages', label: 'Your panel', next: '/payment' },
  { path: '/payment', label: 'Payment', next: '/schedule-labs' },
  { path: '/schedule-labs', label: 'Lab visit', next: '/success' },
];

export function nextStepAfter(path: string): string {
  const step = ONBOARDING_STEPS.find((s) => s.path === path);
  return step ? step.next : '/dashboard';
}
