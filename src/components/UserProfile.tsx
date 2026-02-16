import { ArrowLeft, User, Lock, Bell, Moon, Globe, Shield, HelpCircle, LogOut, ChevronRight, Mail, Calendar } from 'lucide-react';
import { Switch } from './ui/switch';

interface UserProfileProps {
  onNavigate: (screen: 'camouflage' | 'dashboard' | 'vault' | 'photo' | 'walk' | 'conversation' | 'copilot' | 'mylayak' | 'profile') => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  return (
    <div className="min-h-screen h-full bg-gradient-to-b from-[#E8D8E4] via-[#FAF8F6] to-[#DFE5DC]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#E8D8E4] to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 pt-14 pb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#3A3A44]" />
          </button>
          <h1 className="text-xl font-semibold text-[#3A3A44]">Profile</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 pb-32">
        {/* Profile Header Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-[28px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] mb-6">
          <div className="flex flex-col items-center">
            {/* Profile Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#D6B4B8] to-[#C2A7B8] rounded-full flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(194,167,184,0.3)]">
              <User className="w-12 h-12 text-white stroke-[2]" />
            </div>
            
            {/* User Info */}
            <h2 className="text-2xl font-semibold text-[#3A3A44] mb-1">Luna User</h2>
            <div className="flex items-center gap-2 text-sm text-[#6F6F7A] mb-1">
              <Mail className="w-4 h-4" />
              <span>user@luna.app</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6F6F7A]">
              <Calendar className="w-4 h-4" />
              <span>Joined January 2026</span>
            </div>
            
            {/* Edit Profile Button */}
            <button className="mt-5 px-8 py-2.5 bg-gradient-to-r from-[#C2A7B8] to-[#D6B4B8] text-white rounded-full text-sm font-medium shadow-[0_4px_16px_rgba(194,167,184,0.3)] hover:shadow-[0_6px_24px_rgba(194,167,184,0.4)] transition-all">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#6F6F7A] px-2 mb-3 uppercase tracking-wide">Security</h3>
          <div className="bg-white/95 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F6] transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D6B4B8] to-[#C2A7B8] rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Change PIN</p>
                  <p className="text-xs text-[#6F6F7A]">Update your security PIN</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6F6F7A]" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F6] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9FB7A4] to-[#8AA594] rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Privacy Settings</p>
                  <p className="text-xs text-[#6F6F7A]">Control your data and privacy</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6F6F7A]" />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#6F6F7A] px-2 mb-3 uppercase tracking-wide">Preferences</h3>
          <div className="bg-white/95 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D6B4B8] to-[#C2A7B8] rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Notifications</p>
                  <p className="text-xs text-[#6F6F7A]">Period reminders & wellness tips</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9FB7A4] to-[#8AA594] rounded-full flex items-center justify-center">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Dark Mode</p>
                  <p className="text-xs text-[#6F6F7A]">Better for nighttime use</p>
                </div>
              </div>
              <Switch />
            </div>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F6] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D6B4B8] to-[#C2A7B8] rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Language</p>
                  <p className="text-xs text-[#6F6F7A]">English (US)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6F6F7A]" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#6F6F7A] px-2 mb-3 uppercase tracking-wide">Support</h3>
          <div className="bg-white/95 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F6] transition-colors border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9FB7A4] to-[#8AA594] rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Help & FAQs</p>
                  <p className="text-xs text-[#6F6F7A]">Get answers to common questions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6F6F7A]" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F6] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D6B4B8] to-[#C2A7B8] rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-[#3A3A44]">Contact Support</p>
                  <p className="text-xs text-[#6F6F7A]">Reach out to our team</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6F6F7A]" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-white/95 backdrop-blur-sm rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 hover:bg-red-50 transition-colors">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <p className="font-medium text-red-600">Log Out</p>
          </div>
        </button>

        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#6F6F7A]">Luna v1.0.0</p>
          <p className="text-xs text-[#6F6F7A] mt-1">© 2026 Luna. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
