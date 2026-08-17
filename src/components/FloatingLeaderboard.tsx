import React, { useState, useEffect } from 'react';
import { EcoExplorer, EcoQuest } from '../types';
import { INITIAL_LEADERBOARD, INITIAL_QUESTS } from '../data/seedData';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  ChevronUp,
  ChevronDown,
  X,
  Flame,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Trees,
  User,
  Star,
  Zap,
  Gift,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FloatingLeaderboardProps {
  language: string;
  onNavigateToTab?: (tab: string) => void;
  onOpenVerifyModal?: () => void;
  onOpenVR?: (siteId: string) => void;
}

export const FloatingLeaderboard: React.FC<FloatingLeaderboardProps> = ({
  language,
  onNavigateToTab,
  onOpenVerifyModal,
  onOpenVR
}) => {
  // Floating Window Open State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'quests' | 'rewards'>('leaderboard');

  // Leaderboard data & user points
  const [leaderboard, setLeaderboard] = useState<EcoExplorer[]>(INITIAL_LEADERBOARD);
  const [quests, setQuests] = useState<EcoQuest[]>(INITIAL_QUESTS);
  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('johar_eco_points');
    return saved ? parseInt(saved, 10) : 1650;
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('johar_eco_username') || 'You (Eco-Explorer)';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [hasPledged, setHasPledged] = useState<boolean>(() => {
    return localStorage.getItem('johar_eco_pledged') === 'true';
  });
  const [pointNotification, setPointNotification] = useState<number | null>(null);

  // Sync with API if available
  useEffect(() => {
    let isMounted = true;
    fetch('/api/leaderboard')
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (isMounted) {
            if (Array.isArray(data.topExplorers) && data.topExplorers.length > 0) {
              setLeaderboard(data.topExplorers);
            }
            if (Array.isArray(data.quests) && data.quests.length > 0) {
              setQuests(data.quests);
            }
          }
        }
      })
      .catch(err => {
        console.warn('Leaderboard API sync notice:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save points to localStorage
  useEffect(() => {
    localStorage.setItem('johar_eco_points', userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('johar_eco_username', userName);
  }, [userName]);

  // Compute User Tier
  const getUserTier = (pts: number): EcoExplorer['tier'] => {
    if (pts >= 3500) return 'Diamond Sentinel';
    if (pts >= 3000) return 'Gold Guardian';
    if (pts >= 2000) return 'Silver Trailblazer';
    if (pts >= 1000) return 'Bronze Wayfarer';
    return 'Sprout Explorer';
  };

  const getUserBadgeTitle = (pts: number): string => {
    if (pts >= 3500) return language === 'hi' ? 'वन संरक्षक (Diamond)' : 'Forest Sentinel';
    if (pts >= 3000) return language === 'hi' ? 'जनजातीय ज्ञान संरक्षक' : 'Tribal Lorekeeper';
    if (pts >= 2000) return language === 'hi' ? 'कैनोपी पायनियर' : 'Canopy Pioneer';
    if (pts >= 1000) return language === 'hi' ? 'पठार पथिक' : 'Plateau Wayfarer';
    return language === 'hi' ? 'नवागंतुक अन्वेषक' : 'Sprout Explorer';
  };

  // Construct combined list to calculate dynamic user rank
  const currentUserObj: EcoExplorer = {
    id: 'user-current',
    name: userName,
    location: 'Active Tourist Session',
    points: userPoints,
    badgeTitle: getUserBadgeTitle(userPoints),
    tier: getUserTier(userPoints),
    destinationsVisitedCount: 6,
    ecoActionsCount: hasPledged ? 8 : 7,
    verifiedBadges: hasPledged ? ['Sarna Nature Pledge', 'Active Traveler'] : ['Active Traveler'],
    isCurrentUser: true
  };

  const combinedList = [...leaderboard.filter(e => e.id !== 'user-current'), currentUserObj].sort(
    (a, b) => b.points - a.points
  );

  const userRank = combinedList.findIndex(e => e.id === 'user-current') + 1;
  const top5 = combinedList.slice(0, 5);

  // Calculate points needed for next rank
  const getPointsToNextRank = (): { targetName: string; diff: number } | null => {
    if (userRank === 1) return null;
    const targetExplorer = combinedList[userRank - 2];
    if (!targetExplorer) return null;
    const diff = targetExplorer.points - userPoints + 10;
    return {
      targetName: targetExplorer.name,
      diff: Math.max(10, diff)
    };
  };

  const pointsToNext = getPointsToNextRank();

  // Handle earning points
  const handleAwardPoints = (pts: number, actionName: string, questId?: string) => {
    setUserPoints(prev => {
      const next = prev + pts;
      return next;
    });

    if (questId) {
      setQuests(prev =>
        prev.map(q => (q.id === questId ? { ...q, completed: true } : q))
      );
    }

    setPointNotification(pts);
    setTimeout(() => setPointNotification(null), 3000);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8, x: 0.2 }
      });
    } catch (e) {}

    // Send to backend if online
    fetch('/api/leaderboard/earn-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName,
        pointsEarned: pts,
        actionTitle: actionName,
        questId
      })
    }).catch(() => {});
  };

  const handleTakePledge = () => {
    if (hasPledged) return;
    setHasPledged(true);
    localStorage.setItem('johar_eco_pledged', 'true');
    handleAwardPoints(200, 'Sarna Nature & Culture Pledge', 'quest-pledge');
  };

  return (
    <>
      {/* 1. FLOATING TOGGLE PILL (Bottom Left of Explorer Screen) */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            id="eco-leaderboard-toggle-btn"
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 font-semibold text-xs shadow-2xl border border-amber-500/40 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl"
          >
            {/* Animated Gold Ring & Icon */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md">
              <Trophy className="w-4 h-4 text-stone-950" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900 animate-pulse" />
            </div>

            <div className="text-left pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-amber-300 text-xs tracking-wide">
                  {language === 'hi' ? 'इको-लीडरबोर्ड' : 'Eco-Leaderboard'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                  #{userRank}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-medium">
                {language === 'hi' ? 'आपकी रैंक' : 'Your Score'}:{' '}
                <strong className="text-emerald-400 font-bold">{userPoints.toLocaleString()} pts</strong>
              </p>
            </div>

            <ChevronUp className="w-4 h-4 text-stone-400 group-hover:text-amber-300 group-hover:-translate-y-0.5 transition-transform" />

            {/* Live Point Earning Toast */}
            {pointNotification && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-full shadow-lg border border-emerald-300 animate-bounce whitespace-nowrap">
                +{pointNotification} Eco-Points! 🎉
              </div>
            )}
          </button>
        ) : null}
      </div>

      {/* 2. EXPANDED FLOATING LEADERBOARD PANEL */}
      {isOpen && (
        <div
          id="floating-leaderboard-modal"
          className="fixed bottom-6 left-6 z-50 w-[92vw] sm:w-[420px] max-h-[85vh] flex flex-col rounded-3xl bg-stone-900/95 border border-amber-500/40 shadow-2xl shadow-stone-950 backdrop-blur-2xl text-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-white text-base tracking-tight">
                    {language === 'hi' ? 'झारखंड इको-लीडरबोर्ड' : 'Eco-Explorers Leaderboard'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  {language === 'hi'
                    ? 'सतत पर्यटन और पर्यावरण संरक्षण रैंकिंग'
                    : 'Top Sustainable Travelers in Jharkhand'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              title="Minimize Leaderboard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Score & Rank Pinned Card */}
          <div className="p-4 bg-gradient-to-b from-stone-950/80 to-stone-900/90 border-b border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    {isEditingName ? (
                      <input
                        type="text"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        onBlur={() => {
                          if (tempName.trim()) setUserName(tempName.trim());
                          setIsEditingName(false);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (tempName.trim()) setUserName(tempName.trim());
                            setIsEditingName(false);
                          }
                        }}
                        autoFocus
                        className="px-2 py-0.5 text-xs bg-stone-950 border border-emerald-500 rounded text-white font-bold"
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setTempName(userName);
                          setIsEditingName(true);
                        }}
                        className="font-bold text-sm text-white hover:text-amber-300 cursor-pointer flex items-center gap-1"
                        title="Click to rename"
                      >
                        {userName}
                        <span className="text-[10px] text-stone-500 font-normal">(edit)</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {getUserBadgeTitle(userPoints)}
                  </span>
                </div>
              </div>

              {/* Rank Badge */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm">
                  <span>Rank #{userRank}</span>
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {userPoints.toLocaleString()} pts
                </div>
              </div>
            </div>

            {/* Next Rank Progress Bar */}
            {pointsToNext ? (
              <div className="space-y-1.5 bg-stone-950/60 p-2.5 rounded-2xl border border-stone-800 text-[11px]">
                <div className="flex items-center justify-between text-stone-300">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      {language === 'hi'
                        ? `#${userRank - 1} को पछाड़ने के लिए`
                        : `To overtake #${userRank - 1} (${pointsToNext.targetName.split(' ')[0]})`}
                    </span>
                  </span>
                  <strong className="text-amber-400 font-mono font-bold">
                    +{pointsToNext.diff} pts needed
                  </strong>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(15, (userPoints / (userPoints + pointsToNext.diff)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-500/30 p-2 rounded-xl text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-2">
                <CrownIcon className="w-4 h-4 text-amber-300" />
                <span>👑 You are Leading the Explorer Rankings! #1 Forest Sentinel!</span>
              </div>
            )}
          </div>

          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-stone-800 bg-stone-950/60 text-xs font-bold text-center">
            <button
              onClick={() => setActiveSubTab('leaderboard')}
              className={`py-2.5 transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeSubTab === 'leaderboard'
                  ? 'border-amber-400 text-amber-300 bg-stone-900/60'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'शीर्ष 5' : 'Top 5'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('quests')}
              className={`py-2.5 transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeSubTab === 'quests'
                  ? 'border-emerald-400 text-emerald-300 bg-stone-900/60'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'अंक कमाएं' : 'Earn Points'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('rewards')}
              className={`py-2.5 transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeSubTab === 'rewards'
                  ? 'border-teal-400 text-teal-300 bg-stone-900/60'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पुरस्कार' : 'Perks'}</span>
            </button>
          </div>

          {/* Body Content Area */}
          <div className="p-4 overflow-y-auto max-h-[420px] space-y-3">
            {/* TAB 1: TOP 5 PODIUM & LEADERBOARD */}
            {activeSubTab === 'leaderboard' && (
              <div className="space-y-2.5">
                <div className="text-[11px] text-stone-400 flex items-center justify-between pb-1">
                  <span>Rank & Traveler</span>
                  <span>Eco-Points</span>
                </div>

                {top5.map((explorer, idx) => {
                  const rankNum = idx + 1;
                  const isCurrent = explorer.isCurrentUser;

                  // Rank Badge Colors
                  let rankBadge = (
                    <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-xs font-mono">
                      {rankNum}
                    </span>
                  );
                  if (rankNum === 1) {
                    rankBadge = (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs shadow-md">
                        🥇
                      </span>
                    );
                  } else if (rankNum === 2) {
                    rankBadge = (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-stone-950 flex items-center justify-center font-black text-xs shadow-md">
                        🥈
                      </span>
                    );
                  } else if (rankNum === 3) {
                    rankBadge = (
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black text-xs shadow-md">
                        🥉
                      </span>
                    );
                  }

                  return (
                    <div
                      key={explorer.id}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-950/70 border-emerald-400 shadow-md ring-1 ring-emerald-500/50'
                          : rankNum === 1
                          ? 'bg-amber-950/30 border-amber-500/40'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {rankBadge}

                        {explorer.avatarUrl ? (
                          <img
                            src={explorer.avatarUrl}
                            alt={explorer.name}
                            className="w-9 h-9 rounded-full object-cover border border-stone-700"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-300 border border-stone-700">
                            {explorer.name.charAt(0)}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">
                              {explorer.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-stone-950 font-black">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-stone-400">
                            <span className="text-amber-300 font-semibold">{explorer.badgeTitle}</span>
                            <span>•</span>
                            <span>{explorer.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-black text-xs text-emerald-400">
                          {explorer.points.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-400">pts</div>
                      </div>
                    </div>
                  );
                })}

                {/* If user is outside top 5, render their row separated */}
                {userRank > 5 && (
                  <div className="mt-3 pt-2 border-t border-dashed border-stone-800">
                    <div className="text-[10px] text-stone-400 mb-1">Your Current Position:</div>
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-400 shadow-md">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                          {userRank}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white">
                          {userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white flex items-center gap-1">
                            {userName}
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-400 text-stone-950 font-black">
                              YOU
                            </span>
                          </span>
                          <span className="text-[10px] text-amber-300">{getUserBadgeTitle(userPoints)}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono font-black text-xs text-emerald-400">
                        {userPoints.toLocaleString()} pts
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ACTIONABLE QUESTS (EARN POINTS) */}
            {activeSubTab === 'quests' && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Complete green actions to earn Eco-Points and overtake the top travelers on the leaderboard!
                  </span>
                </div>

                {quests.map(quest => {
                  return (
                    <div
                      key={quest.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        quest.completed
                          ? 'bg-stone-950/40 border-stone-800 opacity-80'
                          : 'bg-stone-950/80 border-stone-700 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-white">{quest.title}</h4>
                            {quest.completed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                            {quest.description}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30 whitespace-nowrap">
                          +{quest.points} pts
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-end">
                        {quest.id === 'quest-pledge' && !hasPledged ? (
                          <button
                            onClick={handleTakePledge}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow flex items-center gap-1"
                          >
                            <Trees className="w-3 h-3" />
                            <span>Sign Eco-Pledge (+200 pts)</span>
                          </button>
                        ) : quest.completed || (quest.id === 'quest-pledge' && hasPledged) ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              handleAwardPoints(quest.points, quest.title, quest.id);
                              if (quest.targetAction && onNavigateToTab) {
                                if (quest.targetAction === 'vr' && onOpenVR) {
                                  onOpenVR('netarhat_sunset');
                                }
                                onNavigateToTab(quest.targetAction);
                                setIsOpen(false);
                              } else if (quest.targetAction === 'verify' && onOpenVerifyModal) {
                                onOpenVerifyModal();
                                setIsOpen(false);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-700 text-stone-200 hover:text-white font-bold text-xs transition-all flex items-center gap-1"
                          >
                            <span>{quest.actionText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: REWARDS & UNLOCKED PERKS */}
            {activeSubTab === 'rewards' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-emerald-950/40 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-white">Tier Milestone Rewards</h4>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Earn official JTDC eco-badges and voucher discounts on genuine tribal Dokra & Tussar silk marketplace orders.
                  </p>
                </div>

                {/* Milestone 1 */}
                <div className={`p-3 rounded-2xl border ${userPoints >= 2000 ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-stone-950/60 border-stone-800 opacity-70'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎁</span>
                      <div>
                        <div className="font-bold text-white text-xs">₹250 Artisan Voucher</div>
                        <div className="text-[10px] text-stone-400">Unlocked at 2,000 pts (Silver Trailblazer)</div>
                      </div>
                    </div>
                    {userPoints >= 2000 ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-black text-[10px]">
                        CLAIMED: JTRIP250
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-500 font-mono">
                        Lock ({2000 - userPoints} pts left)
                      </span>
                    )}
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className={`p-3 rounded-2xl border ${userPoints >= 3000 ? 'bg-amber-950/40 border-amber-500/50' : 'bg-stone-950/60 border-stone-800 opacity-70'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏅</span>
                      <div>
                        <div className="font-bold text-white text-xs">Verified Green Sentinel Certificate</div>
                        <div className="text-[10px] text-stone-400">Cryptographic blockchain NFT badge at 3,000 pts</div>
                      </div>
                    </div>
                    {userPoints >= 3000 ? (
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-black text-[10px]">
                        ACTIVE BADGE
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-500 font-mono">
                        Lock ({3000 - userPoints} pts left)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar with quick actions */}
          <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verifiable Eco-Tourism Passport</span>
            </span>
            <button
              onClick={() => {
                setActiveSubTab('quests');
              }}
              className="text-amber-300 font-bold hover:underline"
            >
              + Quick Points
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Crown SVG icon
function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
