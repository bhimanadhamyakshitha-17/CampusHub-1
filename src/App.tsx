import React, { useState } from 'react';
import {
  GraduationCap,
  Trophy,
  Share2,
  Users,
  UserCheck,
  Bot,
  User,
  ShieldCheck,
  LogOut,
  PenSquare,
  Search,
  Heart,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Send,
  X,
} from 'lucide-react';
import {
  User as UserType,
  Hackathon,
  CommunityPost,
  PeerStudent,
  ProfessorRequest,
} from './types.ts';
import { CampusHubAIMentor } from './components/CampusHubAIMentor.tsx';

export default function App() {
  // Current user state (null if not logged in)
  const [currentUser, setCurrentUser] = useState<UserType | null>({
    name: 'Rahul Sharma',
    role: 'student',
    domain: 'Full Stack',
    experience: 'Intermediate',
  });

  // Role selection on login page
  const [loginRole, setLoginRole] = useState<'student' | 'manager'>('student');
  const [customName, setCustomName] = useState('');
  const [customDomain, setCustomDomain] = useState('Full Stack');
  const [customExp, setCustomExp] = useState('Intermediate');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('student-dashboard');

  // Floating AI Mentor widget state
  const [floatingAIWidgetOpen, setFloatingAIWidgetOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'info' }[]>(
    []
  );

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Hackathons data
  const [hackathons, setHackathons] = useState<Hackathon[]>([
    {
      id: 1,
      title: 'CampusAI Hackathon 2026',
      desc: 'Build generative AI applications solving university campus challenges and student productivity.',
      date: 'Oct 25-27, 2026',
      prize: '$5,000',
      domain: 'AI/ML',
      registered: 42,
    },
    {
      id: 2,
      title: 'Web3 Decentralized Campus Cup',
      desc: 'Create smart contracts for academic credential verification, proof-of-attendance, and micro-grants.',
      date: 'Nov 10-12, 2026',
      prize: '$3,500',
      domain: 'Web3',
      registered: 28,
    },
    {
      id: 3,
      title: 'Full Stack Sprint 2026',
      desc: 'Rapid web prototyping with React, TypeScript, and high-performance serverless backends.',
      date: 'Dec 01-03, 2026',
      prize: '$4,000',
      domain: 'Full Stack',
      registered: 65,
    },
    {
      id: 4,
      title: 'CyberShield CTF Challenge',
      desc: 'Ethical hacking, cryptography, vulnerability mitigation, and campus network defense competition.',
      date: 'Dec 15, 2026',
      prize: '$2,500',
      domain: 'Cybersecurity',
      registered: 31,
    },
  ]);

  const [hackathonSearch, setHackathonSearch] = useState('');

  // Community posts data
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      author: 'Aarav Patel',
      role: 'Student',
      domain: 'AI/ML',
      title: 'Built an LLM Study Companion for Engineering Finals',
      content:
        'Our hackathon team fine-tuned an open-source model on past semester papers and lecture transcripts. Helped 200+ students prepare for exams with high retrieval accuracy and zero hallucination!',
      likes: 18,
      comments: 4,
      time: '2 hours ago',
    },
    {
      id: 2,
      author: 'Neha Sharma',
      role: 'Student',
      domain: 'Full Stack',
      title: 'React 19 + TypeScript SaaS Experience in Hackathon',
      content:
        'Participated in the Full Stack Sprint. Learned how to implement resilient SSE streaming, secure authentication, and modular UI components in under 48 hours.',
      likes: 24,
      comments: 7,
      time: 'Yesterday',
    },
  ]);

  const [feedFilterDomain, setFeedFilterDomain] = useState('All');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostDomain, setNewPostDomain] = useState('Full Stack');

  // Peer directory data
  const [peers, setPeers] = useState<PeerStudent[]>([
    { name: 'Rahul Sharma', domain: 'Full Stack', exp: 'Intermediate', hackathons: 3, avatar: 'RS' },
    { name: 'Aarav Patel', domain: 'AI/ML', exp: 'Expert', hackathons: 6, avatar: 'AP' },
    { name: 'Neha Sharma', domain: 'Full Stack', exp: 'Beginner', hackathons: 1, avatar: 'NS' },
    { name: 'Vikram Singh', domain: 'Web3', exp: 'Expert', hackathons: 5, avatar: 'VS' },
    { name: 'Ananya Iyer', domain: 'Mobile', exp: 'Intermediate', hackathons: 2, avatar: 'AI' },
    { name: 'Rohan Verma', domain: 'Cybersecurity', exp: 'Beginner', hackathons: 0, avatar: 'RV' },
  ]);

  const [dirExpFilter, setDirExpFilter] = useState('All');

  // Professor Help requests data
  const [professorRequests, setProfessorRequests] = useState<ProfessorRequest[]>([
    {
      id: 1,
      student: 'Rahul Sharma',
      topic: 'AI Research Paper Guidance',
      details: 'Need faculty mentorship on structuring our transformer model paper for IEEE student conference.',
      status: 'Pending',
      professor: null,
    },
    {
      id: 2,
      student: 'Ananya Iyer',
      topic: 'Mobile Navigation Offline Sync',
      details: 'Looking for advice on offline-first SQLite sync architecture in our campus accessibility app.',
      status: 'Assigned',
      professor: 'Dr. Alan Turing',
    },
  ]);

  const [newReqTopic, setNewReqTopic] = useState('');
  const [newReqDetails, setNewReqDetails] = useState('');

  // Authentication Handlers
  const handleQuickLogin = (role: 'student' | 'manager') => {
    if (role === 'student') {
      setCurrentUser({
        name: 'Rahul Sharma',
        role: 'student',
        domain: 'Full Stack',
        experience: 'Intermediate',
      });
      setActiveTab('student-dashboard');
    } else {
      setCurrentUser({
        name: 'Dr. Helen Vance',
        role: 'manager',
        domain: 'Faculty Administration',
        experience: 'Expert',
      });
      setActiveTab('manager-dashboard');
    }
    showToast(`Signed in successfully as ${role === 'student' ? 'Student' : 'Faculty Management'}`);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    if (loginRole === 'student') {
      setCurrentUser({
        name: customName.trim(),
        role: 'student',
        domain: customDomain,
        experience: customExp,
      });
      setActiveTab('student-dashboard');
    } else {
      setCurrentUser({
        name: customName.trim(),
        role: 'manager',
        domain: 'Administration',
        experience: 'Expert',
      });
      setActiveTab('manager-dashboard');
    }
    showToast(`Welcome to CampusHub, ${customName.trim()}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of CampusHub.', 'info');
  };

  // Hackathon Registration
  const handleRegisterHackathon = (id: number) => {
    setHackathons((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          showToast(`Successfully registered your team for ${h.title}!`);
          return { ...h, registered: h.registered + 1 };
        }
        return h;
      })
    );
  };

  // Publish Community Post
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim() || !currentUser) return;

    const newPost: CommunityPost = {
      id: Date.now(),
      author: currentUser.name,
      role: currentUser.role === 'manager' ? 'Faculty' : 'Student',
      domain: newPostDomain,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      time: 'Just now',
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostTitle('');
    setNewPostContent('');
    showToast('Published your project experience to the campus feed!');
  };

  const handleLikePost = (id: number) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = p.likedByMe;
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedByMe: !isLiked,
          };
        }
        return p;
      })
    );
  };

  // Submit Professor Request
  const handleSubmitProfRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTopic.trim() || !newReqDetails.trim() || !currentUser) return;

    const req: ProfessorRequest = {
      id: Date.now(),
      student: currentUser.name,
      topic: newReqTopic.trim(),
      details: newReqDetails.trim(),
      status: 'Pending',
      professor: null,
    };

    setProfessorRequests([req, ...professorRequests]);
    setNewReqTopic('');
    setNewReqDetails('');
    showToast('Faculty guidance request submitted to management!');
  };

  // Manager: Assign Professor
  const handleAssignProfessor = (reqId: number, professorName: string) => {
    setProfessorRequests((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          return { ...r, status: 'Assigned', professor: professorName };
        }
        return r;
      })
    );
    showToast(`Assigned ${professorName} to request.`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 bg-slate-950/95 text-white text-xs font-bold flex items-center gap-2.5 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ================= LOGIN VIEW (IF NOT LOGGED IN) ================= */}
      {!currentUser ? (
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-950 overflow-y-auto">
          <div className="max-w-md w-full bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/30 mb-4 ring-4 ring-indigo-500/20">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">CampusHub</h1>
              <p className="text-xs text-indigo-300 font-medium mt-1 uppercase tracking-widest">
                Academic & Student Collaboration Network
              </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-2xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => setLoginRole('student')}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  loginRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('manager')}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  loginRole === 'manager'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Management
              </button>
            </div>

            {/* Quick Demo Login */}
            <div className="space-y-3 mb-6">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                Instant Demo Access
              </p>
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-indigo-200">Rahul Sharma (Student)</p>
                    <p className="text-[10px] text-slate-400">Full Stack & AI/ML • 3 Hackathons</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-purple-200">Dr. Helen Vance (Management)</p>
                    <p className="text-[10px] text-slate-400">Faculty Coordinator & Admin</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Custom Sign In Form */}
            <form onSubmit={handleCustomLogin} className="space-y-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Nair"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              {loginRole === 'student' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                    <select
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Full Stack">Full Stack</option>
                      <option value="AI/ML">AI / ML</option>
                      <option value="Web3">Web3</option>
                      <option value="Mobile">Mobile Apps</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Experience</label>
                    <select
                      value={customExp}
                      onChange={(e) => setCustomExp(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Beginner">Beginner (0-1)</option>
                      <option value="Intermediate">Intermediate (2-4)</option>
                      <option value="Expert">Expert (5+)</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>Enter CampusHub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ================= MAIN APPLICATION WORKSPACE ================= */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Navbar */}
          <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold text-base">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight">CampusHub</span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      currentUser.role === 'student'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {currentUser.role === 'student' ? 'Student Portal' : 'Management Portal'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Academic Ecosystem & Student Collaboration Network
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {currentUser.role === 'student' ? (
                <>
                  <button
                    onClick={() => setActiveTab('student-dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'student-dashboard'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('student-hackathons')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'student-hackathons'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hackathons</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('student-community')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'student-community'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Work Feed</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('student-directory')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'student-directory'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Peer Directory</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('student-ai')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'student-ai'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Academic Mentor</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                  </button>
                  <button
                    onClick={() => setActiveTab('student-professors')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'student-professors'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Prof Help</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveTab('manager-dashboard')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-purple-600 text-white shadow-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Management Hub</span>
                </button>
              )}
            </nav>

            {/* User Profile & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[10px] text-indigo-400">
                    {currentUser.role === 'student' ? currentUser.domain : 'Faculty Coordinator'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign out of CampusHub"
                className="p-2 bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-xl border border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile Navigation Bar */}
          <div className="lg:hidden flex overflow-x-auto gap-1 bg-slate-950 p-2 border-b border-slate-800 shrink-0">
            {currentUser.role === 'student' ? (
              <>
                <button
                  onClick={() => setActiveTab('student-dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
                    activeTab === 'student-dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('student-hackathons')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
                    activeTab === 'student-hackathons' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Hackathons
                </button>
                <button
                  onClick={() => setActiveTab('student-community')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
                    activeTab === 'student-community' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Work Feed
                </button>
                <button
                  onClick={() => setActiveTab('student-directory')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
                    activeTab === 'student-directory' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Peer Directory
                </button>
                <button
                  onClick={() => setActiveTab('student-ai')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap bg-purple-600 text-white flex items-center gap-1`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Mentor</span>
                </button>
                <button
                  onClick={() => setActiveTab('student-professors')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
                    activeTab === 'student-professors' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Prof Help
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('manager-dashboard')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-purple-600 text-white"
              >
                Management Hub
              </button>
            )}
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950">
            {/* ================= 1. STUDENT: DASHBOARD ================= */}
            {activeTab === 'student-dashboard' && (
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Hero Greeting */}
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-indigo-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-500/30">
                      Student Dashboard
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black mt-2">
                      Welcome back, {currentUser.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
                      Explore live hackathons, share your project journey on the peer feed, consult
                      our real-world Gemini AI Academic Mentor, or request guidance from faculty professors.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('student-community')}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      <PenSquare className="w-4 h-4" />
                      <span>Share Work</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('student-ai')}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ring-2 ring-purple-400/40"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Ask AI Mentor</span>
                    </button>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xl">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Active Hackathons</p>
                      <p className="text-xl font-black text-white">4 Live Events</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Community Posts</p>
                      <p className="text-xl font-black text-white">{communityPosts.length} Shared</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Active Peers</p>
                      <p className="text-xl font-black text-white">{peers.length} Students</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-xl">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400">Professor Help</p>
                      <p className="text-xl font-black text-white">
                        {professorRequests.filter((r) => r.status === 'Pending').length} Pending
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured Hackathons Preview & Gemini Chat Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>Featured Hackathons</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('student-hackathons')}
                        className="text-xs font-bold text-indigo-400 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {hackathons.slice(0, 2).map((h) => (
                        <div
                          key={h.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold text-[10px] rounded-full border border-indigo-500/30">
                                {h.domain}
                              </span>
                              <span className="text-xs font-bold text-emerald-400">{h.prize}</span>
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1">{h.title}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {h.desc}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRegisterHackathon(h.id)}
                            className="mt-3 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                          >
                            Join Event ({h.registered} teams)
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gemini AI Mentor Spotlight */}
                  <div className="bg-gradient-to-b from-slate-900 to-purple-950/40 border border-purple-500/30 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                            Gemini AI Mentor
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-mono font-normal">
                              Live AI
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            Real-World AI for Academic Doubts & Code
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">
                        Stuck on a bug, need architectural advice for your hackathon pitch, or want to
                        structure your research paper? Chat directly with the live Gemini AI mentor!
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('student-ai')}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Open AI Mentor Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. STUDENT: HACKATHONS ================= */}
            {activeTab === 'student-hackathons' && (
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">
                      Campus & Global Hackathons
                    </h3>
                    <p className="text-xs text-slate-400">
                      Register your team, build innovative solutions, and win prizes and mentorship.
                    </p>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search hackathons..."
                      value={hackathonSearch}
                      onChange={(e) => setHackathonSearch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hackathons
                    .filter(
                      (h) =>
                        h.title.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
                        h.domain.toLowerCase().includes(hackathonSearch.toLowerCase())
                    )
                    .map((h) => (
                      <div
                        key={h.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-[10px] rounded-full uppercase tracking-wider border border-indigo-500/30">
                              {h.domain}
                            </span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                              {h.prize}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-white text-base mb-1">{h.title}</h4>
                          <p className="text-xs text-slate-300 mb-4 leading-relaxed">{h.desc}</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {h.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              {h.registered} teams
                            </span>
                          </div>
                          <button
                            onClick={() => handleRegisterHackathon(h.id)}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20"
                          >
                            Register Team / Join
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================= 3. STUDENT: COMMUNITY WORK FEED ================= */}
            {activeTab === 'student-community' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Share Work Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <PenSquare className="w-4 h-4 text-indigo-400" />
                    <span>Share Your Work, Project, or Experience</span>
                  </h3>
                  <form onSubmit={handlePublishPost} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Project Title (e.g., EcoRoute - AI Traffic Optimizer)"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe what you built, tech stack used, challenges overcome, and takeaways for fellow students..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs font-semibold text-slate-400">Domain:</label>
                        <select
                          value={newPostDomain}
                          onChange={(e) => setNewPostDomain(e.target.value)}
                          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none"
                        >
                          <option value="Full Stack">Full Stack</option>
                          <option value="AI/ML">AI / ML</option>
                          <option value="Web3">Web3</option>
                          <option value="Mobile">Mobile Apps</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish to Feed</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Feed Filter Bar */}
                <div className="flex items-center justify-between bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">Filter Feed:</span>
                    <select
                      value={feedFilterDomain}
                      onChange={(e) => setFeedFilterDomain(e.target.value)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-white focus:outline-none"
                    >
                      <option value="All">All Domains</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="AI/ML">AI / ML</option>
                      <option value="Web3">Web3</option>
                      <option value="Mobile">Mobile Apps</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>
                  <span className="text-xs font-bold text-indigo-400">
                    {
                      communityPosts.filter(
                        (p) => feedFilterDomain === 'All' || p.domain === feedFilterDomain
                      ).length
                    }{' '}
                    Posts
                  </span>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                  {communityPosts
                    .filter((p) => feedFilterDomain === 'All' || p.domain === feedFilterDomain)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs">
                              {p.author
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-white">
                                {p.author}{' '}
                                <span className="font-normal text-slate-400">• {p.role}</span>
                              </h4>
                              <p className="text-[10px] text-slate-500">{p.time}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-[10px] rounded-full uppercase tracking-wider border border-indigo-500/30">
                            {p.domain}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-white text-sm mb-1">{p.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed">{p.content}</p>
                        </div>

                        <div className="flex items-center gap-4 pt-3 border-t border-slate-800 text-xs font-semibold text-slate-400">
                          <button
                            onClick={() => handleLikePost(p.id)}
                            className={`flex items-center gap-1.5 transition-colors ${
                              p.likedByMe ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${p.likedByMe ? 'fill-current text-rose-500' : ''}`}
                            />
                            <span>{p.likes} Likes</span>
                          </button>
                          <button
                            onClick={() => showToast('Opening discussion thread...')}
                            className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{p.comments} Comments</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================= 4. STUDENT: PEER DIRECTORY ================= */}
            {activeTab === 'student-directory' && (
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">
                        Student Peer Directory & Categorization
                      </h3>
                      <p className="text-xs text-slate-400">
                        Students categorized according to their hackathon experience and technical domains.
                      </p>
                    </div>
                    <select
                      value={dirExpFilter}
                      onChange={(e) => setDirExpFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white"
                    >
                      <option value="All">All Experience Levels</option>
                      <option value="Beginner">Beginner (0-1)</option>
                      <option value="Intermediate">Intermediate (2-4)</option>
                      <option value="Expert">Expert (5+)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {peers
                      .filter((s) => dirExpFilter === 'All' || s.exp.includes(dirExpFilter))
                      .map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold flex items-center justify-center text-sm shadow-sm">
                                {s.avatar}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-white">{s.name}</h4>
                                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/20">
                                  {s.domain}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Experience:</span>
                                <span className="font-bold text-white">{s.exp}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Hackathons Attended:</span>
                                <span className="font-bold text-indigo-400">{s.hackathons} Events</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => showToast(`Sent collaboration invite to ${s.name}!`)}
                            className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold rounded-xl text-xs transition-all border border-indigo-500/30"
                          >
                            Connect & Collaborate
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= 5. STUDENT: AI CHATBOT (REAL GEMINI) ================= */}
            {activeTab === 'student-ai' && (
              <div className="max-w-4xl mx-auto h-[680px]">
                <CampusHubAIMentor userName={currentUser.name} userDomain={currentUser.domain} />
              </div>
            )}

            {/* ================= 6. STUDENT: PROFESSOR REQUESTS ================= */}
            {activeTab === 'student-professors' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Form */}
                  <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs">
                    <h3 className="font-extrabold text-white text-base mb-1">
                      Request Faculty Guidance
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Submit a formal request to campus management to get matched with an available faculty mentor.
                    </p>

                    <form onSubmit={handleSubmitProfRequest} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Project / Research Topic
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. LLM fine-tuning for healthcare"
                          value={newReqTopic}
                          onChange={(e) => setNewReqTopic(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Detailed Help Needed
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Explain your project scope, questions, and specific faculty expertise needed..."
                          value={newReqDetails}
                          onChange={(e) => setNewReqDetails(e.target.value)}
                          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/25"
                      >
                        Submit Request to Management
                      </button>
                    </form>
                  </div>

                  {/* Submitted List */}
                  <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col">
                    <h3 className="font-extrabold text-white text-base mb-1">
                      Your Submitted Requests
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Management reviews these requests and assigns available faculty professors.
                    </p>

                    <div className="flex-1 space-y-3 overflow-y-auto">
                      {professorRequests
                        .filter((r) => r.student === currentUser.name)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-xs text-white">{r.topic}</h4>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.status === 'Pending'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {r.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{r.details}</p>
                            {r.professor && (
                              <p className="text-[11px] font-bold text-indigo-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Assigned Mentor: {r.professor}</span>
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 7. MANAGEMENT: HUB & CONTROL CENTER ================= */}
            {activeTab === 'manager-dashboard' && (
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider rounded-full border border-purple-500/30">
                      Management Portal
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black mt-2">
                      Faculty & Admin Control Center
                    </h2>
                    <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
                      Monitor student work activity, review hackathon engagement, and assign faculty mentors
                      to pending guidance requests.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-center">
                    <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                      Pending Requests
                    </p>
                    <p className="text-2xl font-black text-white">
                      {professorRequests.filter((r) => r.status === 'Pending').length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Request Fulfillment */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs">
                    <h3 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>Professor Guidance Requests Queue</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Assign faculty members to student project requests.
                    </p>

                    <div className="space-y-3">
                      {professorRequests.map((r) => (
                        <div
                          key={r.id}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                {r.student}
                              </span>
                              <h4 className="font-bold text-xs text-white">{r.topic}</h4>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                r.status === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{r.details}</p>

                          {r.status === 'Pending' ? (
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                              <select
                                id={`prof-select-${r.id}`}
                                defaultValue="Dr. Alan Turing"
                                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white"
                              >
                                <option value="Dr. Alan Turing">Dr. Alan Turing (AI/ML)</option>
                                <option value="Dr. Grace Hopper">Dr. Grace Hopper (Full Stack)</option>
                                <option value="Dr. Tim Berners-Lee">Dr. Tim Berners-Lee (Web3)</option>
                              </select>
                              <button
                                onClick={() => {
                                  const sel = document.getElementById(
                                    `prof-select-${r.id}`
                                  ) as HTMLSelectElement;
                                  handleAssignProfessor(r.id, sel?.value || 'Dr. Alan Turing');
                                }}
                                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                              >
                                Assign Mentor
                              </button>
                            </div>
                          ) : (
                            <p className="text-[11px] font-bold text-emerald-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Assigned to: {r.professor}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Project Monitor */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs">
                    <h3 className="text-base font-extrabold text-white mb-1 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span>Student Project Activity Monitor</span>
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Review all work experiences and ideas published across campus.
                    </p>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {communityPosts.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-white">{p.author}</span>
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30">
                              {p.domain}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-200">{p.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{p.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Floating AI Mentor Quick-Launch Button */}
          {activeTab !== 'student-ai' && (
            <button
              onClick={() => setFloatingAIWidgetOpen(true)}
              className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xl shadow-purple-600/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 ring-2 ring-purple-400/30"
              title="Open Gemini AI Academic Mentor"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">Ask AI Mentor</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}

          {/* Floating AI Mentor Modal */}
          {floatingAIWidgetOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <CampusHubAIMentor
                userName={currentUser.name}
                userDomain={currentUser.domain}
                isFloatingModal={true}
                onClose={() => setFloatingAIWidgetOpen(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
