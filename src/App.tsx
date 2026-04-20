import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle2,
  Users,
  Server,
  FileText,
  Building,
  ChevronDown,
  ChevronUp,
  MessageSquareWarning,
  ShieldCheck,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';
import { problems, checklist, simulatorScripts } from './data';
import type { Category, Urgency, ProblemData } from './types';

// ==========================================
// Sub-components
// ==========================================

const GaugeMeter = () => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-gray-500 font-semibold text-[10px] uppercase tracking-wide mb-1">현재 창구 피로도 지수</h3>
          <div className="text-2xl font-bold text-gray-900">85<span className="text-sm text-gray-500 font-normal ml-1">%</span></div>
        </div>
        <div className="flex items-center text-[#b91c1c] bg-[#fee2e2] px-2 py-1 rounded text-[10px] font-bold">
          <Activity className="w-3 h-3 mr-1" />
          위험 수준
        </div>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '85%' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-[#ef4444] rounded-full"
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase">
        <span>안정 0</span>
        <span>주의 50</span>
        <span>심각 100</span>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }: any) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-between">
    <div>
      <h3 className="text-gray-500 font-semibold text-[10px] uppercase tracking-wide mb-1">{title}</h3>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
    <div className={`p-2.5 rounded text-gray-900 ${bgColorClass}`}>
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
  </div>
);

const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => {
  const styles = {
    '상': 'bg-[#fee2e2] text-[#b91c1c]',
    '중': 'bg-[#fef3c7] text-[#92400e]',
    '하': 'bg-[#dcfce7] text-[#15803d]',
  };
  return (
    <span className={`px-2 py-[2px] rounded text-[10px] font-bold ${styles[urgency]}`}>
      {urgency === '상' ? '상' : urgency === '중' ? '중' : '하'}
    </span>
  );
};

const CategoryIcon = ({ category }: { category: Category }) => {
  switch (category) {
    case '현장/민원': return <Users className="w-4 h-4 text-gray-500" />;
    case '전산/시스템': return <Server className="w-4 h-4 text-gray-500" />;
    case '제도/지침': return <FileText className="w-4 h-4 text-gray-500" />;
    case '조직/인력': return <Building className="w-4 h-4 text-gray-500" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const ProblemCard = ({ data, isExpanded, onToggle }: { data: ProblemData, isExpanded: boolean, onToggle: () => void }) => {
  const [activeTab, setActiveTab] = useState<'short' | 'long'>('short');
  const [showRiskDetails, setShowRiskDetails] = useState(false);

  return (
    <div 
      className={`rounded-lg border transition-all duration-300 overflow-hidden ${
        isExpanded ? 'border-[#1e3a8a] bg-[#f0f4ff] shadow-sm' : 'bg-white border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50/40 hover:-translate-y-1 hover:shadow-md cursor-pointer'
      }`}
    >
      <div className="p-3" onClick={onToggle}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
               <CategoryIcon category={data.category} />
             </div>
            <h3 className="text-[14px] font-semibold text-gray-900 leading-none mt-px">
              {data.id}. {data.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <UrgencyBadge urgency={data.urgency} />
            <div className="w-5 h-5 flex items-center justify-center">
              {!isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-white"
          >
            <div className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-[12px] uppercase tracking-wider font-semibold text-gray-500 mb-2">Cause (원인)</h4>
                  <p className="text-[15px] text-gray-900 leading-relaxed">{data.cause}</p>
                </div>
                <div>
                  <h4 className="text-[12px] uppercase tracking-wider font-semibold text-gray-500 mb-2">Impact (공무원 부담)</h4>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowRiskDetails(!showRiskDetails); }}
                    className="flex items-center gap-1 text-[13px] font-semibold text-[#1e3a8a] hover:text-[#b91c1c] transition-colors mb-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    현장 리스크 및 사례 상세보기
                    <motion.div
                      animate={{ rotate: showRiskDetails ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showRiskDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#fef2f2] border border-[#fecaca] rounded p-3 mt-2">
                          <p className="text-[13px] text-[#991b1b] leading-relaxed mb-2 font-medium">
                            {data.officerRisk}
                          </p>
                          <div className="text-[12px] text-[#7f1d1d] border-l-[2px] border-[#fca5a5] pl-2 opacity-90 mt-2">
                            <span className="font-semibold pb-1 block">실제 현장 사례:</span>
                            "{data.example}"
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-lg mt-2 border border-gray-100">
                <div className="flex gap-4 border-b-2 border-gray-200 mb-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTab('short'); }}
                    className={`pb-2 text-[14px] font-semibold tracking-tight border-b-2 transition-colors mb-[-2px] ${
                      activeTab === 'short' ? 'border-[#1e3a8a] text-[#1e3a8a]' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    단기 해결방안
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTab('long'); }}
                    className={`pb-2 text-[14px] font-semibold tracking-tight border-b-2 transition-colors mb-[-2px] ${
                      activeTab === 'long' ? 'border-[#1e3a8a] text-[#1e3a8a]' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    중장기 해결방안
                  </button>
                </div>
                
                <AnimatePresence mode="wait">
                  {activeTab === 'short' ? (
                     <motion.div key="short" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[14px] font-medium text-[#111827] leading-relaxed">
                       {data.shortTerm}
                     </motion.div>
                  ) : (
                     <motion.div key="long" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[14px] font-medium text-[#111827] leading-relaxed">
                       {data.longTerm}
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// Main Application
// ==========================================

export default function App() {
  const [filterUrgency, setFilterUrgency] = useState<Urgency | '전체'>('전체');
  const [filterCategory, setFilterCategory] = useState<Category | '전체'>('전체');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchUrgency = filterUrgency === '전체' || p.urgency === filterUrgency;
      const matchCategory = filterCategory === '전체' || p.category === filterCategory;
      return matchUrgency && matchCategory;
    }).sort((a, b) => {
      const weight = { '상': 3, '중': 2, '하': 1 };
      return weight[b.urgency] - weight[a.urgency] || a.id - b.id;
    });
  }, [filterUrgency, filterCategory]);

  const toggleCheck = (id: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedItems(newChecked);
  };

  return (
    <div className="min-h-screen text-[#111827] bg-[#f3f4f6] pb-20">
      
      {/* Header aligned exactly to HTML Theme */}
      <header className="bg-[#1e3a8a] text-white px-5 md:px-8 py-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold tracking-tight">행정 혁신: 민생 지원금 접수 분석 대시보드</h1>
          <p className="text-[12px] opacity-80 mt-1">읍면동 주민센터 실무자 업무 개선 및 프로세스 최적화 도구</p>
        </div>
        
        {/* Header Summary Widgets */}
        <div className="flex gap-4">
          <div className="bg-white/10 px-4 py-2 rounded-lg text-center flex-1">
            <div className="text-[10px] uppercase opacity-70">전체 분석 건수</div>
            <div className="text-[18px] font-bold">10건</div>
          </div>
          <div className="bg-[#ef4444] px-4 py-2 rounded-lg text-center flex-1">
            <div className="text-[10px] uppercase opacity-90 text-white/90">시급성 '상'</div>
            <div className="text-[18px] font-bold">5건</div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg text-center flex-1 hidden sm:block">
            <div className="text-[10px] uppercase opacity-70">평균 피로도</div>
            <div className="text-[18px] font-bold">위험</div>
          </div>
        </div>
      </header>

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        
        {/* Section 1: Dashboard Overview */}
        <section className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GaugeMeter />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="식별된 주요 문제" value="10건" icon={AlertTriangle} colorClass="text-gray-600" bgColorClass="bg-gray-100" />
            <StatCard title="민원 응대 관련" value="4건" icon={Users} colorClass="text-gray-600" bgColorClass="bg-gray-100" />
            <StatCard title="전산 지연 위험" value="2건" icon={Server} colorClass="text-gray-600" bgColorClass="bg-gray-100" />
          </div>
        </section>

        {/* Section 2: Interactive Problem Cards */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-[14px] font-semibold tracking-wide text-gray-500 uppercase flex items-center justify-between w-full md:w-auto">
              <span>현안 리스트 (10)</span>
            </h2>
            
            <div className="flex items-center gap-3 mt-3 md:mt-0">
              <div className="flex bg-white rounded-md border border-gray-200 p-0.5">
                {(['전체', '상', '중'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setFilterUrgency(u)}
                    className={`px-3 py-1 text-[12px] font-semibold rounded-[4px] transition-colors ${
                      filterUrgency === u ? 'bg-[#f0f4ff] text-[#1e3a8a]' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {u === '전체' ? '시급성 전체' : u}
                  </button>
                ))}
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="bg-white border border-gray-200 text-gray-700 text-[12px] font-semibold rounded-md px-2 py-1.5 focus:outline-none"
              >
                <option value="전체">유형 전체</option>
                <option value="현장/민원">현장/민원</option>
                <option value="제도/지침">제도/지침</option>
                <option value="전산/시스템">전산/시스템</option>
                <option value="조직/인력">조직/인력</option>
              </select>
            </div>
          </div>

          {/* Applied the Minimal Utility layout for cards container */}
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {filteredProblems.map(problem => (
                <motion.div
                  key={problem.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProblemCard 
                    data={problem} 
                    isExpanded={expandedId === problem.id}
                    onToggle={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredProblems.length === 0 && (
              <div className="py-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200 text-sm">
                해당 필터 조건에 맞는 데이터가 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Summary Table */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-[14px] font-semibold text-gray-500 uppercase tracking-wide">종합 요약 데이터 테이블</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-900 border-collapse">
              <thead className="text-[11px] text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">유형</th>
                  <th className="px-5 py-3 font-semibold">문제명</th>
                  <th className="px-5 py-3 font-semibold text-center">시급성</th>
                  <th className="px-5 py-3 font-semibold">단기 대응방안 핵심 요약</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, idx) => (
                  <tr key={p.id} className={`border-b border-gray-100 transition-colors ${idx % 2 !== 0 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-[#f0f4ff]/50`}>
                    <td className="px-5 py-3 font-medium text-gray-600 whitespace-nowrap text-[13px]">{p.category}</td>
                    <td className="px-5 py-3 font-semibold text-[13px]">{p.title}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block py-[2px] px-2 rounded text-[10px] font-bold ${
                        p.urgency === '상' ? 'bg-[#fee2e2] text-[#b91c1c]' : p.urgency === '중' ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#dcfce7] text-[#15803d]'
                      }`}>
                        {p.urgency}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px]">{p.shortTerm.substring(0, 50)}{p.shortTerm.length > 50 ? '...' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Toolkit (Checklist + Simulator) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Admin Checklist Theme matches .checklist-panel */}
          <div className="bg-[#1e293b] rounded-xl text-white p-5">
            <div className="mb-3 pb-2 border-b border-white/10 flex justify-between items-center">
              <span className="text-[14px] font-medium tracking-wide">일일 창구 운영 체크리스트 (Admin Toolkit)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {checklist.map(item => (
                <label 
                  key={item.id} 
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded border-2 transition-colors flex flex-shrink-0 items-center justify-center ${
                    checkedItems.has(item.id) ? 'bg-[#10b981] border-[#10b981]' : 'border-white/30 group-hover:border-white/50'
                  }`}>
                    {checkedItems.has(item.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-[13px] leading-tight transition-opacity ${
                    checkedItems.has(item.id) ? 'opacity-50 line-through' : 'opacity-90'
                  }`}>
                    {item.text}
                  </span>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={checkedItems.has(item.id)} 
                    onChange={() => toggleCheck(item.id)} 
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setCheckedItems(new Set())}
                className="text-[12px] font-medium text-white/50 hover:text-white transition-colors"
              >
                초기화
              </button>
            </div>
          </div>

          {/* Simulator Panel styled clean utility */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center space-x-2">
              <MessageSquareWarning className="w-5 h-5 text-gray-500" />
              <h2 className="text-[14px] font-semibold text-gray-900">민원 응대 스크립트 시뮬레이터</h2>
            </div>
            <div className="p-5 flex flex-col">
              
              <div className="flex gap-2 flex-wrap mb-4">
                {simulatorScripts.map(script => (
                  <button
                    key={script.id}
                    onClick={() => setActiveScriptId(script.id)}
                    className={`flex-1 text-center px-3 py-2 rounded-lg text-[13px] font-semibold transition-all border ${
                      activeScriptId === script.id 
                      ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {script.label.replace(/[^가-힣\s()]/g, '').trim()}
                  </button>
                ))}
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {activeScriptId ? (
                    <motion.div
                      key={activeScriptId}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 border border-gray-200 text-gray-800 p-4 rounded-lg shadow-sm"
                    >
                      <div className="text-[14px] font-medium leading-relaxed text-[#111827]">
                        {simulatorScripts.find(s => s.id === activeScriptId)?.script}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="border border-dashed border-gray-300 bg-gray-50/50 text-gray-400 p-4 rounded-lg text-[13px] text-center font-medium h-full min-h-[82px] flex items-center justify-center">
                      위에서 상황을 선택하면 표준 응대가 표시됩니다.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
