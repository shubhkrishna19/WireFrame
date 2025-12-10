import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

interface Referral {
  id: string;
  referrerId: string;
  refereeEmail: string;
  status: 'pending' | 'signed_up' | 'completed_purchase';
  rewardAmount: number;
  createdAt: Date;
  completedAt?: Date;
}

interface ReferralProgramProps {
  onEarnReward?: (amount: number) => void;
}

export const ReferralProgram: React.FC<ReferralProgramProps> = ({ onEarnReward: _onEarnReward }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const toast = useToast();

  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  // Mock referral data (in real app, this would come from API)
  useEffect(() => {
    // Generate unique referral code for user
    const userId = user?._id || 'guest';
    const userCode = `MULARY${userId.slice(-6).toUpperCase()}`;
    setReferralCode(userCode);
    setReferralLink(`${window.location.origin}?ref=${userCode}`);

    // Mock referrals data
    const mockReferrals: Referral[] = [
      {
        id: 'ref1',
        referrerId: userId,
        refereeEmail: 'friend1@example.com',
        status: 'completed_purchase',
        rewardAmount: 500,
        createdAt: new Date('2025-11-01'),
        completedAt: new Date('2025-11-15'),
      },
      {
        id: 'ref2',
        referrerId: userId,
        refereeEmail: 'friend2@example.com',
        status: 'signed_up',
        rewardAmount: 200,
        createdAt: new Date('2025-11-10'),
      },
      {
        id: 'ref3',
        referrerId: userId,
        refereeEmail: 'friend3@example.com',
        status: 'pending',
        rewardAmount: 0,
        createdAt: new Date('2025-11-18'),
      },
    ];

    setReferrals(mockReferrals);
  }, [user?._id]);

  const getTotalEarnings = (): number => {
    return referrals
      .filter(ref => ref.status === 'completed_purchase')
      .reduce((total, ref) => total + ref.rewardAmount, 0);
  };

  const getPendingRewards = (): number => {
    return referrals
      .filter(ref => ref.status === 'signed_up')
      .reduce((total, ref) => total + ref.rewardAmount, 0);
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareOnWhatsApp = () => {
    const message = `Hey! Check out Bluewud - India's best fashion destination! Use my referral code ${referralCode} and get â‚¹500 off on your first purchase. I earn rewards too! ðŸ›ï¸âœ¨\n\n${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(`Get â‚¹500 off on your first purchase at Bluewud! Use code: ${referralCode}`)}`;
    window.open(url, '_blank');
  };

  const sendEmailInvite = async () => {
    if (!friendEmail.trim()) {
      toast.warning('Please enter an email address');
      return;
    }

    setIsSendingInvite(true);

    // Simulate API call
    setTimeout(() => {
      // In real app, this would send an email
      toast.success(`Invitation sent to ${friendEmail}!`);
      setFriendEmail('');
      setIsSendingInvite(false);
      setShowShareModal(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed_purchase':
        return theme.colors.stateSuccess;
      case 'signed_up':
        return theme.colors.stateWarning;
      case 'pending':
        return theme.colors.textTertiary;
      default:
        return theme.colors.textTertiary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed_purchase':
        return 'Completed Purchase';
      case 'signed_up':
        return 'Signed Up';
      case 'pending':
        return 'Invite Sent';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div
        className="text-center py-12 px-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.buttonPrimary}20 0%, ${theme.colors.buttonSecondary}20 100%)`,
          border: `2px solid ${theme.colors.borderPrimary}`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-4xl font-black mb-4"
            style={{ color: theme.colors.textPrimary }}
          >
            ðŸŽ Refer & Earn Program
          </h1>
          <p
            className="text-xl mb-6"
            style={{ color: theme.colors.textSecondary }}
          >
            Share the love for fashion and earn rewards! Get â‚¹500 for every friend who makes their first purchase.
          </p>
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div
                className="text-3xl font-black mb-1"
                style={{ color: theme.colors.stateSuccess }}
              >
                â‚¹{getTotalEarnings()}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: theme.colors.textSecondary }}
              >
                Total Earned
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-black mb-1"
                style={{ color: theme.colors.stateWarning }}
              >
                â‚¹{getPendingRewards()}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: theme.colors.textSecondary }}
              >
                Pending Rewards
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-black mb-1"
                style={{ color: theme.colors.textPrimary }}
              >
                {referrals.length}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: theme.colors.textSecondary }}
              >
                Friends Referred
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code & Link */}
      <div
        className="border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: theme.colors.textPrimary }}
        >
          Your Referral Code
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Referral Code */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              Referral Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-4 py-3 border-2 rounded-lg text-lg font-mono font-bold text-center uppercase"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
              />
              <button
                onClick={copyReferralLink}
                className="px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                  color: '#FFFFFF',
                }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Referral Link */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              Referral Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 border-2 rounded-lg text-sm"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                  color: theme.colors.textPrimary,
                }}
              />
              <button
                onClick={copyReferralLink}
                className="px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: theme.colors.buttonPrimary,
                  color: '#FFFFFF',
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mt-6">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: theme.colors.textPrimary }}
          >
            Share Your Referral Link
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              WhatsApp
            </button>

            <button
              onClick={shareOnFacebook}
              className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: '#1877F2',
                color: '#FFFFFF',
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all hover:scale-105"
              style={{
                backgroundColor: theme.colors.buttonPrimary,
                color: '#FFFFFF',
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Invite
            </button>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div
        className="border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: theme.colors.textPrimary }}
        >
          Your Referral History
        </h2>

        {referrals.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: theme.colors.textTertiary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              No referrals yet
            </p>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Start sharing your referral link to earn rewards!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.borderPrimary,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getStatusColor(referral.status) }}
                  >
                    {referral.status === 'completed_purchase' ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : referral.status === 'signed_up' ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {referral.refereeEmail}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {getStatusText(referral.status)} â€¢ {referral.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="font-bold text-lg"
                    style={{
                      color: referral.status === 'completed_purchase'
                        ? theme.colors.stateSuccess
                        : referral.status === 'signed_up'
                          ? theme.colors.stateWarning
                          : theme.colors.textTertiary
                    }}
                  >
                    â‚¹{referral.rewardAmount}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {referral.status === 'completed_purchase' ? 'Earned' :
                      referral.status === 'signed_up' ? 'Pending' : 'Not earned'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div
        className="border-2 rounded-creative p-6"
        style={{
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.borderPrimary,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: theme.colors.textPrimary }}
        >
          How Referral Program Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.colors.buttonPrimary }}
            >
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              Share Your Code
            </h3>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Share your unique referral code or link with friends via WhatsApp, Facebook, or email.
            </p>
          </div>

          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.colors.buttonPrimary }}
            >
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              Friend Signs Up
            </h3>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Your friend creates an account and uses your referral code during signup.
            </p>
          </div>

          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.colors.buttonPrimary }}
            >
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              Earn Rewards
            </h3>
            <p
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              You earn â‚¹200 when they sign up, and â‚¹500 more when they make their first purchase!
            </p>
          </div>
        </div>
      </div>

      {/* Email Invite Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl"
            style={{
              backgroundColor: theme.colors.cardBackground,
              border: `2px solid ${theme.colors.borderPrimary}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: theme.colors.textPrimary }}
            >
              Invite Friend via Email
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Friend's Email
                </label>
                <input
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-4 py-3 border-2 rounded-lg"
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderColor: theme.colors.borderPrimary,
                    color: theme.colors.textPrimary,
                  }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-3 font-semibold rounded-lg transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.textPrimary,
                    border: `1px solid ${theme.colors.borderPrimary}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmailInvite}
                  disabled={!friendEmail.trim() || isSendingInvite}
                  className="flex-1 px-4 py-3 font-semibold rounded-lg transition-all disabled:opacity-50 hover:scale-105"
                  style={{
                    backgroundColor: theme.colors.buttonPrimary,
                    color: '#FFFFFF',
                  }}
                >
                  {isSendingInvite ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


