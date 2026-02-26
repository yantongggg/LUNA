import { useState } from 'react';
import { CamouflageHome } from './components/CamouflageHome';
import { SecureDashboard } from './components/SecureDashboard';
import { EvidenceVault } from './components/EvidenceVault';
import { PhotoDefense } from './components/PhotoDefense';
import { WalkWithMe } from './components/WalkWithMe';
import { ConversationTraining } from './components/ConversationTraining';
import { LifeCopilot } from './components/LifeCopilot';
import { MyLayakEligibility } from './components/MyLayakEligibility';
import { UserProfile } from './components/UserProfile';

type Screen = 'camouflage' | 'dashboard' | 'vault' | 'photo' | 'walk' | 'conversation' | 'copilot' | 'mylayak' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('camouflage');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setCurrentScreen('dashboard');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[430px] h-[932px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-gray-900">
        <div className="w-full h-full overflow-y-auto">
          {currentScreen === 'camouflage' && (
            <CamouflageHome onUnlock={handleUnlock} />
          )}
          {currentScreen === 'dashboard' && isUnlocked && (
            <SecureDashboard onNavigate={navigateTo} />
          )}
          {currentScreen === 'vault' && isUnlocked && (
            <EvidenceVault onNavigate={navigateTo} />
          )}
          {currentScreen === 'photo' && isUnlocked && (
            <PhotoDefense onNavigate={navigateTo} />
          )}
          {currentScreen === 'walk' && isUnlocked && (
            <WalkWithMe onNavigate={navigateTo} />
          )}
          {currentScreen === 'conversation' && isUnlocked && (
            <ConversationTraining onNavigate={navigateTo} />
          )}
          {currentScreen === 'copilot' && isUnlocked && (
            <LifeCopilot onNavigate={navigateTo} />
          )}
          {currentScreen === 'mylayak' && isUnlocked && (
            <MyLayakEligibility onNavigate={navigateTo} />
          )}
          {currentScreen === 'profile' && isUnlocked && (
            <UserProfile onNavigate={navigateTo} />
          )}
        </div>
      </div>
    </div>
  );
}