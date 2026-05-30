/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  DOKDO_HISTORY_EVENTS, 
  DOKDO_QUIZ 
} from './data';
import { 
  HistoryEvent, 
  EventCategory 
} from './types';
import { 
  Calendar, 
  Search, 
  BookOpen, 
  Shield, 
  MapPin, 
  ArrowRight, 
  FileText, 
  ChevronRight, 
  Info, 
  Map, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Compass, 
  HelpCircle, 
  X, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function App() {
  // Navigation / Filter States
  const [activeTab, setActiveTab] = useState<EventCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'ancient-early' | 'late-joseon' | 'modern'>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'cards'>('timeline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Selected Event Modal State
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  
  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Extra Fact Helper Tip State
  const [showGeoTip, setShowGeoTip] = useState(false);

  // Categories configurations
  const categoryConfig: Record<EventCategory, { label: string; bg: string; text: string; border: string; icon: any }> = {
    'korean-official': {
      label: '국내 관찬 사료 🇰🇷',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: FileText
    },
    'civil-defense': {
      label: '민간 영토 수호 🛡️',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: Shield
    },
    'japanese-source': {
      label: '일본 자인 사료 🇯🇵',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: Info
    },
    'international-decree': {
      label: '국제법적 선포 📜',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      icon: Compass
    },
    'imperialist-aggression': {
      label: '일제 침탈 과정 ⚠️',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: AlertTriangle
    }
  };

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    let list = [...DOKDO_HISTORY_EVENTS];

    // Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.summary.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) || 
        item.source.toLowerCase().includes(query) || 
        item.eraName.toLowerCase().includes(query) ||
        item.year.toString().includes(query)
      );
    }

    // Category Tab Filter
    if (activeTab !== 'all') {
      list = list.filter(item => item.category === activeTab);
    }

    // Period Filter
    if (selectedPeriod === 'ancient-early') {
      list = list.filter(item => item.year <= 1531);
    } else if (selectedPeriod === 'late-joseon') {
      list = list.filter(item => item.year > 1531 && item.year <= 1785);
    } else if (selectedPeriod === 'modern') {
      list = list.filter(item => item.year > 1785);
    }

    // Sort Order
    list.sort((a, b) => {
      return sortOrder === 'asc' ? a.year - b.year : b.year - a.year;
    });

    return list;
  }, [searchQuery, activeTab, selectedPeriod, sortOrder]);

  // Quiz Handling
  const handleOptionSelect = (optionIndex: number) => {
    if (quizAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || quizAnswered) return;
    
    const isCorrect = selectedOption === DOKDO_QUIZ[quizIndex].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setQuizAnswered(true);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizAnswered(false);
    
    if (quizIndex + 1 < DOKDO_QUIZ.length) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-teal-100 selection:text-teal-900 pb-12">
      
      {/* Upper Navigation Indicator Bar */}
      <div className="bg-slate-900 text-slate-400 py-2.5 px-4 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            대한민국의 고유 영토, 독도 · 역사적 공식 사료 고증 연표
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>자료 출처: 영토 수호 역사 실록 교과 자료집</span>
            <span>최종 업데이트: 2026-05-30</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 px-4 md:px-8 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle background geographic coordinates/accents */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
          <div className="text-[12rem] font-mono font-bold tracking-widest text-[#0ea5e9]">
            37°14′N 131°52′E
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold tracking-wider uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            대한민국의 고유 영토, 독도 (独島 / DOKDO)
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans"
          >
            우리 땅 독도, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">기록과 역사의 연표</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
          >
            고대 삼국시대(512년)부터 대한제국 시기까지의 공식 사료 분석 및 수호 일지 
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pt-6"
          >
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 md:p-6 text-left shadow-xl backdrop-blur-sm max-w-3xl mx-auto">
              <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                문서 요약 (Abstract)
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                본 문서는 <strong className="text-white font-semibold">512년 신라 이사부의 우산국 복속</strong>부터, 조선 시대 관찬 기록 및 민간 수호 활동(안용복 사건), 그리고 근대 대한제국 시기의 국제법적 영유권 선포와 일제의 침탈 과정을 연도순으로 정밀하게 정돈한 역사적 연표입니다. 수많은 고지도와 한·일 양국의 공식 행정 문서들은 독도가 역사적, 지리적, 국제법적으로 명백한 대한민국의 고유 영토임을 흔들림 없이 증명하고 있습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Core Database Analytics Row */}
      <section className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-800 font-mono">16개</div>
              <div className="text-[11px] font-medium text-slate-500">기록된 역사 사건</div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-800 font-mono">5개</div>
              <div className="text-[11px] font-medium text-slate-500">국내 관찬 사료</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-800 font-mono">2회</div>
              <div className="text-[11px] font-medium text-slate-500">민간 수호 주관</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-rose-800 font-mono">6개</div>
              <div className="text-[11px] font-medium text-slate-500">일본 자인 증명</div>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 bg-gradient-to-r from-teal-500 to-sky-500 rounded-2xl p-4 shadow-md text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono">100%</div>
              <div className="text-[11px] font-medium text-teal-100">명백한 고유 주권</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container - Split Layout (Main Timelines & Documents + Interactive Fact panels) */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Aspect: Navigation & Dynamic History Event List (8 cols) */}
        <div id="timeline-and-archives" className="lg:col-span-8 space-y-6">
          
          {/* Timeline Controller Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input 
                type="text"
                placeholder="역사 연도, 문서명, 위인 이름, 또는 내용 검색 (예: 이사부, 세종실록, 칙령, 태정관)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm placeholder-slate-400 transition-all text-slate-800"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Group: Era Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-semibold mr-1">연대구분:</span>
                <button
                  onClick={() => setSelectedPeriod('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedPeriod === 'all' 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  전체 시기
                </button>
                <button
                  onClick={() => setSelectedPeriod('ancient-early')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedPeriod === 'ancient-early' 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  삼국 ~ 조선 전기 (512 ~ 1531)
                </button>
                <button
                  onClick={() => setSelectedPeriod('late-joseon')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedPeriod === 'late-joseon' 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  조선 후기 외교 (1667 ~ 1785)
                </button>
                <button
                  onClick={() => setSelectedPeriod('modern')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedPeriod === 'modern' 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  근대 및 대일 항쟁 (1870 ~ 1906)
                </button>
              </div>

              {/* View layout Toggle & Sort */}
              <div className="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-1 cursor-pointer"
                  title={sortOrder === 'asc' ? '과거순 정렬 상태' : '최신순 정렬 상태'}
                >
                  <span className="font-medium text-[11px]">{sortOrder === 'asc' ? '시간순 (오름)' : '최신순 (내림)'}</span>
                </button>

                <div className="p-0.5 bg-slate-100 rounded-lg flex">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      viewMode === 'timeline' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    연표 뷰
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      viewMode === 'cards' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    아카이브 뷰
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase tracking-wider">상세구분:</span>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'border-slate-800 bg-slate-900 text-white'
                    : 'border-slate-250 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                전체 기록 ({DOKDO_HISTORY_EVENTS.length})
              </button>
              
              {Object.entries(categoryConfig).map(([category, cfg]) => {
                const count = DOKDO_HISTORY_EVENTS.filter(e => e.category === category).length;
                const isSelected = activeTab === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category as EventCategory)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                      isSelected 
                        ? 'border-slate-800 bg-slate-900 text-white shadow-xs' 
                        : `${cfg.bg} ${cfg.text} ${cfg.border} hover:brightness-95`
                    }`}
                  >
                    {cfg.label} ({count})
                  </button>
                );
              })}
            </div>

          </div>

          {/* Results Status Bar */}
          <div className="flex justify-between items-center text-xs text-slate-500 px-1">
            <div>
              선택한 필터 조건에 매칭되는 역사적 기록: <strong className="text-slate-800 font-bold">{filteredEvents.length}개</strong>
            </div>
            {filteredEvents.length < DOKDO_HISTORY_EVENTS.length && (
              <button 
                onClick={() => {
                  setActiveTab('all');
                  setSelectedPeriod('all');
                  setSearchQuery('');
                }}
                className="text-teal-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> 필터 전체 초기화
              </button>
            )}
          </div>

          {/* EVENTS PRESENTATION ZONE */}
          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-4"
              >
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-700">성공적으로 필터링된 기록이 없습니다.</h3>
                <p className="text-xs max-w-md mx-auto">
                  검색 키워드를 단순하게 변경하거나, 다른 연대구분 또는 카테고리를 설정하시면 독도를 가리키는 고증 자료를 찾으실 수 있습니다.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedPeriod('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  기본 상태로 돌아가기
                </button>
              </motion.div>
            ) : viewMode === 'timeline' ? (
              
              /* TIMELINE VIEW (Vertical Node Branch) */
              <motion.div 
                key="timeline-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative pl-6 md:pl-8 border-l-2 border-slate-200 space-y-8 py-2 ml-3 md:ml-4"
              >
                {filteredEvents.map((event, index) => {
                  const cfg = categoryConfig[event.category];
                  const IconComp = cfg.icon;

                  return (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className="relative group"
                    >
                      {/* Timeline branch circle nodes */}
                      <span className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-6 md:w-8 h-6 md:h-8 rounded-full border-2 ${cfg.border} bg-white flex items-center justify-center text-slate-700 shadow-sm group-hover:scale-115 transition-transform`}>
                        <IconComp className={`w-3 md:w-4 h-3 md:h-4 ${cfg.text}`} />
                      </span>

                      {/* Event Main Block */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-xs hover:shadow-md transition-all duration-350 hover:border-slate-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                          
                          {/* Year Badge & Era description */}
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-lg font-mono">
                              {event.year}년
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {event.eraName}
                            </span>
                          </div>

                          {/* Category Label Chip */}
                          <span className={`self-start sm:self-auto text-[10px] uppercase tracking-wide font-extrabold px-2.5 py-1.5 rounded-md border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>

                        {/* Title and Summary */}
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight group-hover:text-teal-600 transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {event.summary}
                          </p>
                        </div>

                        {/* Highlighting Quote Box */}
                        {event.highlights && event.highlights.length > 0 && (
                          <div className="mt-3.5 bg-slate-50 rounded-xl p-2.5 border-l-3 border-slate-400 text-xs text-slate-600 font-medium">
                            “{event.highlights[0]}”
                          </div>
                        )}

                        {/* Event action footer */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-700">사료 출처:</span> 
                            <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-150">{event.source}</span>
                          </div>
                          <button 
                            onClick={() => setSelectedEvent(event)}
                            className="text-teal-600 font-bold hover:text-teal-700 flex items-center gap-0.5 hover:underline cursor-pointer"
                          >
                            상세 사료 및 사학 원문 보기 <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              
              /* CARD VIEW (Bento-Grid documents archive) */
              <motion.div 
                key="card-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {filteredEvents.map((event, index) => {
                  const cfg = categoryConfig[event.category];
                  const IconComp = cfg.icon;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black bg-slate-800 text-white px-2 py-0.5 rounded-md font-mono">
                              {event.year}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 block">
                              {event.eraName}
                            </span>
                          </div>
                          <div className={`p-1.5 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-800 line-clamp-1 text-sm sm:text-base">
                            {event.title}
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-400">
                            문헌: {event.source}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                          {event.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">
                          (사료 페이지원본-{event.pageNumber}P)
                        </span>
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="text-teal-600 font-bold hover:text-teal-700 text-xs flex items-center gap-0.5 cursor-pointer"
                        >
                          상세분석 <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Geographic Fact Card: Why Geophysics matters in Dokdo's sovereignty */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Visual Grid Backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 max-w-sm sm:max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold">
                  <Map className="w-3.5 h-3.5" /> 지리적 근거 & 지형 고찰
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  "날씨가 맑으면 서로 바라볼 수 있다"의 과학
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  『세종실록지리지』 가 기록한 "우산과 무릉 두 섬이 울진현 동쪽에 있으며 기정하에 날씨가 맑으면 보인다"라는 구절은 역사적인 상상력이 아닙니다. 울릉도 최고봉인 성인봉이나 독도의 고지에서는 맑은 날 육안으로 정밀 관측이 가능함이 확인되었습니다.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => setShowGeoTip(prev => !prev)}
                    className="text-teal-400 font-semibold text-xs hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                  >
                    💡 {showGeoTip ? "세부 거리 해설 숨기기" : "왜 오키섬에서는 독도가 안 보이나요?"}
                  </button>
                </div>
              </div>

              {/* Minimalistic Graphic Comparison scale mapping */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 w-full md:w-72 shrink-0 space-y-4">
                <div className="text-center pb-2 border-b border-slate-700/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">독도와 육지 간 실제 거리 비교</span>
                </div>
                
                {/* Distance Option A (Ulleungdo) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1">
                      🇰🇷 울릉도 ↔ 독도 거리
                    </span>
                    <span className="font-extrabold text-[#38bdf8] font-mono">87.4 km</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '55%' }}
                      transition={{ duration: 1 }}
                      className="bg-gradient-to-r from-teal-400 to-sky-400 h-full rounded-full"
                    ></motion.div>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right font-medium">※ 울릉도에서는 언제나 맑은 날 육안 관측권 (87.4km)</span>
                </div>

                {/* Distance Option B (Oki Island, Japan) */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      🇯🇵 오키섬(일본) ↔ 독도 거리
                    </span>
                    <span className="font-extrabold text-rose-400 font-mono">157.5 km</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1 }}
                      className="bg-rose-400/80 h-full rounded-full"
                    ></motion.div>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right font-medium">※ 오키섬에서는 지구 곡률 상 육안 관측 원천 불가 (157.5km)</span>
                </div>
              </div>
            </div>

            {/* Expandable Geo Explainer Tip */}
            <AnimatePresence>
              {showGeoTip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed"
                >
                  <p className="font-semibold text-teal-400">지구 곡률(Curvature)에 의한 영속적 증명:</p>
                  <p>
                    인간의 가시거리는 지구의 장경 곡률을 기반으로 해발 고도에 좌우됩니다. 독도(동해 해발 98.6m)를 육안으로 보기 위해서는 가장 가까운 울릉도(해발고도 984m 성인봉 혹은 300m 언덕)에서는 정밀하게 시야각이 수평선 위로 돌출되어 날씨가 완전히 쾌청한 가을철 등에 선명히 드러납니다.
                  </p>
                  <p>
                    반면 일본에서 소유권을 주장하며 제기하는 가장 가까운 오키섬(157.5km 외곽)에서는 해발 고도가 아무리 높아도 수평선 아래로 수십 미터 이상 완전히 잠기는 거리이기 때문에, 현대 고성능 장비가 없이는 육안으로 독도가 존재한다는 사실조차 확인하는 것조차 불가능합니다.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Aspect: Side Dashboard of Truth & High-impact Interactive Quizzes (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Historical Evidence Box (일본의 자승자박 사료 기획전) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <AlertSquareIcon className="w-5 h-5 text-rose-500" />
                역사적 6대 반박 사료
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                일본 고유영토론을 제 무덤 삼아 파훼하는 일본의 공식 사적기록
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                { year: '1667년', title: '은주시편 (隱州視聽)', desc: '일본 지방 보고서로 서북부 국가 경계 한계를 오키섬으로 한정하여 서술.' },
                { year: '1695년', title: '돗토리번 답변서', desc: '에도 막부 관성에 "울릉도와 독도는 우리 영지 관할이 아니다"고 답사 보존.' },
                { year: '1696년', title: '죽도 도해 금지령', desc: '막부 국익 명령으로 일본 어민의 울독도 방면 항해를 불법으로 금지해 주권 양도 인정.' },
                { year: '1785년', title: '삼국접양지도', desc: '국가 지도로 독도를 조선 자국 땅과 같은 노란색으로 도장하고 "조선의 것" 글자 기재.' },
                { year: '1870년', title: '조선국교제시말내탐서', desc: '일본 외무성의 밀탐록으로 독도가 조선령이 된 전말을 상세히 기록 보존.' },
                { year: '1877년', title: '태정관 지령 (太政官指令)', desc: '최고 행정기관이 "독도는 조선국 영토요 일본 제국은 관여치 말라"고 공식 지령 고시.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1 group hover:bg-rose-50/50 hover:border-rose-100 transition-colors">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-rose-700 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded font-mono">
                      {item.year}
                    </span>
                    <span className="font-bold text-slate-600 font-sans group-hover:text-slate-800 transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC QUIZ BOARD: Dokdo History Supporter Cert */}
          <div className="bg-white border-2 border-teal-500/80 rounded-3xl p-5 shadow-md relative overflow-hidden">
            {/* Stamp highlight banner */}
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-teal-500/5 rounded-full pointer-events-none flex items-center justify-center">
              <HelpCircle className="w-12 h-12 text-teal-600/10" />
            </div>

            <div className="border-b border-teal-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5 text-teal-800">
                  <AwardIcon className="w-5 h-5 text-teal-600 animate-bounce" />
                  독도 역사 골든벨 퀴즈
                </h3>
                <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
                  핵심 영유권 기록을 학습하고 확인해 보세요
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full shrink-0">
                {quizCompleted ? '완료' : `${quizIndex + 1} / ${DOKDO_QUIZ.length}`}
              </span>
            </div>

            {/* Quiz Body */}
            <div className="mt-4">
              <AnimatePresence mode="wait">
                {!quizCompleted ? (
                  <motion.div
                    key={`q-${quizIndex}`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    {/* Question text */}
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                      Q. {DOKDO_QUIZ[quizIndex].question}
                    </h4>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500 h-full transition-all duration-300"
                        style={{ width: `${((quizIndex + 1) / DOKDO_QUIZ.length) * 100}%` }}
                      ></div>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {DOKDO_QUIZ[quizIndex].options.map((option, idx) => {
                        let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                        
                        if (selectedOption === idx) {
                          btnStyle = 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20';
                        }
                        
                        if (quizAnswered) {
                          if (idx === DOKDO_QUIZ[quizIndex].correctIndex) {
                            btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                          } else if (selectedOption === idx) {
                            btnStyle = 'bg-rose-50 border-rose-300 text-rose-850 line-through';
                          } else {
                            btnStyle = 'opacity-50 border-slate-100 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={quizAnswered}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{option}</span>
                            {quizAnswered && idx === DOKDO_QUIZ[quizIndex].correctIndex && (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                            {quizAnswered && selectedOption === idx && idx !== DOKDO_QUIZ[quizIndex].correctIndex && (
                              <X className="w-4 h-4 text-rose-600 animate-shake" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit or Explanation block */}
                    {selectedOption !== null && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 pt-2"
                      >
                        {!quizAnswered ? (
                          <button
                            onClick={handleQuizSubmit}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
                          >
                            정답 확인하기
                          </button>
                        ) : (
                          <div className="space-y-3 bg-slate-50 border border-slate-150 rounded-xl p-3.5">
                            <div className="flex items-start gap-2">
                              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">역사적 사실 해설:</span>
                                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                                  {DOKDO_QUIZ[quizIndex].explanation}
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={handleNextQuiz}
                              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {quizIndex + 1 === DOKDO_QUIZ.length ? '결과 확인하기' : '다음 문제 풀기'} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* Quiz Completed Result */
                  <motion.div
                    key="quiz-finished"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
                      <AwardIcon className="w-8 h-8 text-teal-600" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-800 text-lg">퀴즈 풀이 완료!</h3>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        독도를 수호하는 영유권 공식 실록 골든벨을 끝마쳤습니다. 당신의 성적표는?
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 inline-block">
                      <span className="text-3xl font-black text-teal-600 font-mono">
                        {quizScore} / {DOKDO_QUIZ.length}
                      </span>
                      <span className="text-xs text-slate-400 block mt-1 font-bold">
                        {quizScore === DOKDO_QUIZ.length ? '🏆 독도 보안관 등급 (만점)' : quizScore >= 3 ? '🎖️ 역사 탐험가 등급 (우수)' : '📜 배움의 주 수호자 등급'}
                      </span>
                    </div>

                    <button
                      onClick={handleRestartQuiz}
                      className="w-full py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 다시 도전하기
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Informative Map Graphic (거리감 고찰 및 배운 사실 정리) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              독도가 우리 영토인 3대 핵심 뼈대
            </h4>
            <ul className="text-xs text-slate-600 space-y-2.5 font-medium leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold shrink-0">01.</span>
                <span>공인된 관찬 역사 지리지(세종실록지리지, 동국여지승람 등)가 대대로 세금 징수와 울릉도 주민 관리를 규정.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold shrink-0">02.</span>
                <span>일본 제국의 최고 사법/행정 통치 문서(태정관 지령, 돗토리번 회답 등)가 독도가 자국 영토가 아님을 서면 결재.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold shrink-0">03.</span>
                <span>1900년 고종 황제의 근대 입법『대한제국 칙령 제41호』를 배포 선언하여 일본의 1905년 무단 가조치보다 수년 앞선 소유권 최종 공고.</span>
              </li>
            </ul>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-3">
        <p className="font-medium">
          대한민국의 영원한 고유 영토, <strong className="text-slate-800">독도는 역사적·지리적·국제법적으로 우리 땅</strong>입니다.
        </p>
        <p className="font-mono">
          © 2026 Dokdo Records Chronological Archive. Created respectfully following standard historical files and archives.
        </p>
      </footer>

      {/* DETAILED DOCUMENT SOURCE MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <React.Fragment>
            {/* Modal Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-slate-950/65 z-50 backdrop-blur-xs flex items-center justify-center p-4"
            >
              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing on clicking card itself
                className="bg-white rounded-3xl border border-slate-100 w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                {/* Modal Title header */}
                <div className="bg-slate-900 text-white p-6 relative">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black bg-teal-500 text-slate-900 px-2.5 py-0.5 rounded">
                      {selectedEvent.year}년 · {selectedEvent.eraName}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      사료 페이지: {selectedEvent.pageNumber}P 수록
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight">
                    {selectedEvent.title}
                  </h3>
                </div>

                {/* Modal Main Content (Scrollzone) */}
                <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed text-slate-600">
                  
                  {/* Category description row */}
                  <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">공식 문서출처 및 카테고리:</span>
                      <p className="font-semibold text-slate-800">
                        {selectedEvent.source} (구분: {categoryConfig[selectedEvent.category].label})
                      </p>
                    </div>
                  </div>

                  {/* Complete detailed description from PDF */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                      상세 사실 기술 해설
                    </h4>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {/* Highlights Bullet list */}
                  {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                        사료 증명의 핵심 근거 대목
                      </h4>
                      <ul className="space-y-2">
                        {selectedEvent.highlights.map((highlight, hidx) => (
                          <li key={hidx} className="flex gap-2.5 items-start text-xs sm:text-sm">
                            <span className="inline-flex w-5 h-5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {hidx + 1}
                            </span>
                            <span className="font-medium text-slate-700">
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Analytical Historical Context Weight */}
                  <div className="pt-3 border-t border-slate-100 bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-1">
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                      💡 역사적 의의 고찰 (Historical Significance)
                    </span>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {selectedEvent.category === 'korean-official' && '우리 선조들이 고유 국경 안에서 지리적·행정적으로 인지하고 순찰·세금을 거둔 완벽한 실효 지배의 산 증거입니다.'}
                      {selectedEvent.category === 'civil-defense' && '정부의 손길이 일시적으로 한가한 중에도 나라를 사랑하는 백성들이 자발적으로 수평선을 넘어 외국의 불법 어로와 강탈 시도를 퇴치하며 지켜낸 소중한 수호 일지입니다.'}
                      {selectedEvent.category === 'japanese-source' && '일본의 관용 문서, 지방성, 국가 최고의결서가 한목소리로 독도를 타국(조선) 영토로 배제했음을 보임으로써 일본 외무성의 오늘날 독도 영유권 생떼 주장을 원천 폭파하는 귀중한 증적입니다.'}
                      {selectedEvent.category === 'international-decree' && '대한제국이 공식 관보를 발행하여 근대 국제법 기준상으로도 자국의 완전한 지방 행정 구역에 완편 지정했음을 전 세계에 반포한 주권 고시의 최정점입니다.'}
                      {selectedEvent.category === 'imperialist-aggression' && '러일전쟁 중에 대한제국의 주권을 침해하며 군용 기지 탐색 목적 아래 강탈을 추진한 일본의 야욕 사실을 소상히 입증하는 군사적 불법 조치 기록입니다.'}
                    </p>
                  </div>

                </div>

                {/* Modal footer Close button */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    사료 창 닫기
                  </button>
                </div>

              </motion.div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

    </div>
  );
}

// Inline fallback icons for safety to avoid import resolution issues in some React environments
function AlertSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2500/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2500/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
