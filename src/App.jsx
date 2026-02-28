import React, { useState, useEffect } from 'react';
import { Calendar, Brain, TrendingUp, Target, Clock, Zap, BookOpen, Award, BarChart3, AlertCircle } from 'lucide-react';

const SmartStudyPlanner = () => {
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [userProfile, setUserProfile] = useState({
    studyStreak: 0,
    totalHours: 0,
    lastStudyDate: null
  });
  const [nlInput, setNlInput] = useState('');
  const [view, setView] = useState('dashboard');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', difficulty: 5, priority: 5, examDate: '' });

  // AI-powered task generation from natural language
  const processNaturalLanguage = () => {
    if (!nlInput.trim()) {
      alert('Please enter what you need help with!');
      return;
    }

    const input = nlInput.toLowerCase();
    let days = 20;
    let extractedSubjects = [];
    
    // Extract time period
    const dayMatch = input.match(/(\d+)\s*(day|week|month)/);
    if (dayMatch) {
      const num = parseInt(dayMatch[1]);
      const unit = dayMatch[2];
      days = unit === 'week' ? num * 7 : unit === 'month' ? num * 30 : num;
    }

    // Extract subjects mentioned
    const commonSubjects = ['math', 'physics', 'chemistry', 'biology', 'history', 'english', 'computer', 'science', 'economics', 'geography'];
    commonSubjects.forEach(subject => {
      if (input.includes(subject)) {
        extractedSubjects.push(subject.charAt(0).toUpperCase() + subject.slice(1));
      }
    });

    // If no subjects mentioned, use default subjects or existing
    if (extractedSubjects.length === 0) {
      if (subjects.length > 0) {
        extractedSubjects = subjects.map(s => s.name);
      } else {
        // Default subjects if nothing specified
        extractedSubjects = ['Mathematics', 'Science', 'English'];
      }
    }

    // Generate study plan
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + days);

    const generatedSubjects = extractedSubjects.map((name, index) => ({
      id: Date.now() + Math.random() + index,
      name,
      difficulty: 5,
      priority: 8,
      examDate: examDate.toISOString().split('T')[0],
      performanceScore: 50,
      timeSpent: 0
    }));
    
    setSubjects(prev => [...prev, ...generatedSubjects]);
    generateAdaptivePlan(generatedSubjects, days);
    setNlInput('');
    setView('schedule');
  };

  // Adaptive plan generation
  const generateAdaptivePlan = (subjectsData, totalDays) => {
    const newTasks = [];
    const today = new Date();

    subjectsData.forEach(subject => {
      const sessionsNeeded = Math.ceil(subject.difficulty * 2);
      const timePerSession = subject.difficulty * 30; // minutes
      
      // Spaced repetition schedule
      const intervals = [1, 3, 7, 14, 21]; // days between revisions
      
      for (let i = 0; i < sessionsNeeded; i++) {
        const sessionDate = new Date(today);
        const dayOffset = Math.floor((totalDays / sessionsNeeded) * i);
        sessionDate.setDate(sessionDate.getDate() + dayOffset);

        newTasks.push({
          id: Date.now() + Math.random(),
          subjectId: subject.id,
          subjectName: subject.name,
          title: `${subject.name} - Session ${i + 1}`,
          type: i < 2 ? 'learning' : 'revision',
          duration: timePerSession,
          scheduledDate: sessionDate.toISOString().split('T')[0],
          completed: false,
          difficulty: subject.difficulty,
          priority: subject.priority
        });
      }

      // Add revision sessions using spaced repetition
      intervals.forEach((interval, idx) => {
        const revisionDate = new Date(today);
        revisionDate.setDate(revisionDate.getDate() + interval);
        
        if (revisionDate < new Date(subject.examDate)) {
          newTasks.push({
            id: Date.now() + Math.random() + idx,
            subjectId: subject.id,
            subjectName: subject.name,
            title: `${subject.name} - Revision ${idx + 1}`,
            type: 'revision',
            duration: timePerSession * 0.7,
            scheduledDate: revisionDate.toISOString().split('T')[0],
            completed: false,
            difficulty: subject.difficulty,
            priority: subject.priority - 1
          });
        }
      });
    });

    setTasks(prev => [...prev, ...newTasks.sort((a, b) => 
      new Date(a.scheduledDate) - new Date(b.scheduledDate)
    )]);
  };

  // Add subject manually
  const addSubject = () => {
    if (!newSubject.name.trim()) return;

    const subject = {
      id: Date.now(),
      ...newSubject,
      performanceScore: 50,
      timeSpent: 0
    };

    setSubjects(prev => [...prev, subject]);
    
    const daysUntilExam = Math.ceil(
      (new Date(newSubject.examDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    
    generateAdaptivePlan([subject], daysUntilExam);
    setShowAddSubject(false);
    setNewSubject({ name: '', difficulty: 5, priority: 5, examDate: '' });
  };

  // Complete task with performance tracking
  const completeTask = (taskId, timeSpent, accuracy) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const session = {
      id: Date.now(),
      taskId,
      subjectName: task.subjectName,
      timeSpent,
      accuracy,
      date: new Date().toISOString(),
      scheduledDuration: task.duration
    };

    setStudySessions(prev => [...prev, session]);
    setCompletedTasks(prev => [...prev, { ...task, completedAt: new Date(), timeSpent, accuracy }]);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));

    // Update subject performance
    setSubjects(prev => prev.map(s => {
      if (s.id === task.subjectId) {
        const subjectSessions = [...studySessions, session].filter(ss => ss.subjectName === s.name);
        const avgAccuracy = subjectSessions.reduce((sum, ss) => sum + (ss.accuracy || 0), 0) / subjectSessions.length;
        const totalTime = subjectSessions.reduce((sum, ss) => sum + ss.timeSpent, 0);
        
        return {
          ...s,
          performanceScore: Math.round(avgAccuracy),
          timeSpent: totalTime
        };
      }
      return s;
    }));

    // Update streak
    updateStreak();
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastStudy = userProfile.lastStudyDate;
    
    if (lastStudy === today) {
      return;
    } else if (lastStudy === new Date(Date.now() - 86400000).toDateString()) {
      setUserProfile(prev => ({
        ...prev,
        studyStreak: prev.studyStreak + 1,
        lastStudyDate: today
      }));
    } else {
      setUserProfile(prev => ({
        ...prev,
        studyStreak: 1,
        lastStudyDate: today
      }));
    }
  };

  // Get today's tasks with adaptive rescheduling
  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.scheduledDate === today && !t.completed);
    const overdueTasks = tasks.filter(t => 
      new Date(t.scheduledDate) < new Date(today) && !t.completed
    );

    return [...overdueTasks, ...todayTasks].sort((a, b) => 
      (b.priority * b.difficulty) - (a.priority * a.difficulty)
    );
  };

  // Performance analytics
  const getAnalytics = () => {
    const totalSessions = studySessions.length;
    const avgAccuracy = studySessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions || 0;
    const totalStudyTime = studySessions.reduce((sum, s) => sum + s.timeSpent, 0);
    
    const subjectPerformance = subjects.map(subject => {
      const sessions = studySessions.filter(s => s.subjectName === subject.name);
      const accuracy = sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / sessions.length || 0;
      return {
        name: subject.name,
        accuracy: Math.round(accuracy),
        sessions: sessions.length,
        timeSpent: sessions.reduce((sum, s) => sum + s.timeSpent, 0)
      };
    });

    return { totalSessions, avgAccuracy: Math.round(avgAccuracy), totalStudyTime, subjectPerformance };
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                <Brain className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Study Planner
                </h1>
                <p className="text-gray-600">Your adaptive learning companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 text-orange-600">
                  <Zap size={20} />
                  <span className="text-2xl font-bold">{userProfile.studyStreak}</span>
                </div>
                <p className="text-xs text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Clock size={20} />
                  <span className="text-2xl font-bold">{Math.round(analytics.totalStudyTime / 60)}</span>
                </div>
                <p className="text-xs text-gray-600">Hours Studied</p>
              </div>
            </div>
          </div>

          {/* NLP Input */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && processNaturalLanguage()}
                placeholder='Try: "I have math and physics exam in 30 days, help me prepare"'
                className="flex-1 px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none"
              />
              <button
                onClick={processNaturalLanguage}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Generate Plan
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          {['dashboard', 'schedule', 'analytics', 'subjects'].map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                view === tab
                  ? 'bg-white shadow-lg text-indigo-600'
                  : 'bg-white/50 text-gray-600 hover:bg-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Tasks */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-indigo-600" />
                Today's Focus
              </h2>
              {getTodayTasks().length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No tasks scheduled for today. Add subjects to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getTodayTasks().map(task => (
                    <TaskCard key={task.id} task={task} onComplete={completeTask} />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Award size={32} />
                  <span className="text-4xl font-bold">{analytics.avgAccuracy}%</span>
                </div>
                <p className="text-green-100">Average Accuracy</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" />
                  Subject Performance
                </h3>
                <div className="space-y-3">
                  {analytics.subjectPerformance.slice(0, 4).map(subject => (
                    <div key={subject.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{subject.name}</span>
                        <span className="text-gray-600">{subject.accuracy}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                          style={{ width: `${subject.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule View */}
        {view === 'schedule' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-indigo-600" />
              Study Schedule
            </h2>
            <div className="space-y-4">
              {tasks.filter(t => !t.completed).map(task => (
                <div key={task.id} className="border-l-4 border-indigo-500 pl-4 py-3 bg-indigo-50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{task.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(task.scheduledDate).toLocaleDateString()} • {task.duration} min • {task.type}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.priority >= 7 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      Priority {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" />
                Performance Metrics
              </h2>
              <div className="space-y-6">
                {analytics.subjectPerformance.map(subject => (
                  <div key={subject.name} className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-lg">{subject.name}</span>
                      <span className="text-2xl font-bold text-indigo-600">{subject.accuracy}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Sessions</p>
                        <p className="font-semibold">{subject.sessions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time Spent</p>
                        <p className="font-semibold">{Math.round(subject.timeSpent)} min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Study Insights</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-blue-900">Smart Recommendations</p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    {analytics.subjectPerformance
                      .filter(s => s.accuracy < 70)
                      .map(s => (
                        <li key={s.name}>• Focus more on {s.name} (current: {s.accuracy}%)</li>
                      ))}
                  </ul>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="font-semibold text-green-900">Strengths</p>
                  <ul className="mt-2 space-y-1 text-sm text-green-800">
                    {analytics.subjectPerformance
                      .filter(s => s.accuracy >= 80)
                      .map(s => (
                        <li key={s.name}>• Great progress in {s.name}! ({s.accuracy}%)</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects View */}
        {view === 'subjects' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                My Subjects
              </h2>
              <button
                onClick={() => setShowAddSubject(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                + Add Subject
              </button>
            </div>

            {showAddSubject && (
              <div className="bg-indigo-50 p-6 rounded-xl mb-6">
                <h3 className="font-bold mb-4">Add New Subject</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Subject name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="px-4 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none"
                  />
                  <input
                    type="date"
                    value={newSubject.examDate}
                    onChange={(e) => setNewSubject({ ...newSubject, examDate: e.target.value })}
                    className="px-4 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 outline-none"
                  />
                  <div>
                    <label className="text-sm text-gray-600">Difficulty (1-10)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newSubject.difficulty}
                      onChange={(e) => setNewSubject({ ...newSubject, difficulty: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-sm font-semibold">{newSubject.difficulty}</span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Priority (1-10)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newSubject.priority}
                      onChange={(e) => setNewSubject({ ...newSubject, priority: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-sm font-semibold">{newSubject.priority}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addSubject}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    Add Subject
                  </button>
                  <button
                    onClick={() => setShowAddSubject(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <div key={subject.id} className="border-2 border-indigo-100 rounded-xl p-4 hover:shadow-lg transition-all">
                  <h3 className="font-bold text-xl mb-2">{subject.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Performance</span>
                      <span className="font-semibold">{subject.performanceScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty</span>
                      <span className="font-semibold">{subject.difficulty}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exam Date</span>
                      <span className="font-semibold">{new Date(subject.examDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Task completion component
const TaskCard = ({ task, onComplete }) => {
  const [showComplete, setShowComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(task.duration);
  const [accuracy, setAccuracy] = useState(70);

  const handleComplete = () => {
    onComplete(task.id, timeSpent, accuracy);
    setShowComplete(false);
  };

  return (
    <div className="border-2 border-indigo-100 rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.duration} minutes • {task.type}</p>
        </div>
        <button
          onClick={() => setShowComplete(!showComplete)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
        >
          Complete
        </button>
      </div>

      {showComplete && (
        <div className="mt-4 pt-4 border-t space-y-3">
          <div>
            <label className="text-sm font-medium">Time Spent (minutes)</label>
            <input
              type="number"
              value={timeSpent}
              onChange={(e) => setTimeSpent(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">How well did you understand? ({accuracy}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={accuracy}
              onChange={(e) => setAccuracy(parseInt(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <button
            onClick={handleComplete}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Submit & Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartStudyPlanner;