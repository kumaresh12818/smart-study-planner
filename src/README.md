# 🧠 AI Study Planner - Smart Learning Assistant

An intelligent, adaptive study planner powered by AI that personalizes your learning experience based on your behavior, performance, and goals.

![AI Study Planner](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.2-06B6D4) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🤖 AI-Powered Planning
- **Natural Language Input**: Just type "I have math and physics exam in 30 days, help me prepare" and get a complete study plan
- **Smart Subject Detection**: Automatically extracts subjects and timelines from your input
- **Adaptive Scheduling**: Adjusts plans based on subject difficulty and priority

### 📊 Performance Analytics
- **Real-time Tracking**: Monitor your accuracy and time spent on each subject
- **Performance Insights**: AI identifies weak areas and suggests focus topics
- **Progress Visualization**: Beautiful charts showing your improvement over time

### 🎯 Personalized Learning
- **Difficulty-Based Time Allocation**: More time automatically allocated to harder subjects
- **Spaced Repetition**: Smart revision scheduler using proven intervals (1, 3, 7, 14, 21 days)
- **Priority System**: Tasks organized by importance and difficulty

### 🔥 Gamification
- **Study Streaks**: Track consecutive study days
- **Performance Scores**: See your mastery level for each subject
- **Achievement Tracking**: Monitor total hours studied and sessions completed

### 📅 Smart Scheduling
- **Automatic Task Generation**: Creates learning and revision sessions based on exam dates
- **Overdue Task Management**: Automatically reschedules missed tasks
- **Today's Focus**: Prioritized daily task list

## 🚀 Demo

[Live Demo](https://your-app-url.vercel.app) *(Add your Vercel URL here after deployment)*

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Study Schedule
![Schedule](screenshots/schedule.png)

### Analytics
![Analytics](screenshots/analytics.png)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.2
- **Icons**: Lucide React
- **Build Tool**: Vite 4.3.9
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/smart-study-planner.git
cd smart-study-planner
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

## 🎮 How to Use

### 1. Natural Language Planning
Type your study goal in plain English:
- "I have math and physics exam in 30 days, help me prepare"
- "Chemistry test in 2 weeks"
- "Help me study biology in 20 days"

### 2. Manual Subject Addition
- Click "Subjects" tab
- Click "+ Add Subject"
- Fill in subject name, exam date, difficulty, and priority
- System generates personalized study plan

### 3. Complete Tasks
- View today's tasks on Dashboard
- Click "Complete" on any task
- Enter time spent and understanding level
- System updates your performance analytics

### 4. Track Progress
- View "Analytics" tab for detailed insights
- See which subjects need more attention
- Monitor your study streaks and total hours

## 🧮 Algorithm Details

### Adaptive Planning Algorithm
```javascript
// Sessions needed based on difficulty (1-10 scale)
sessions = difficulty × 2

// Time per session in minutes
timePerSession = difficulty × 30

// Spaced repetition intervals (days)
revisionIntervals = [1, 3, 7, 14, 21]
```

### Task Prioritization
```javascript
priority_score = task.priority × task.difficulty
// Higher score = shown first in daily tasks
```

### Performance Calculation
```javascript
subject_performance = average(all_session_accuracies)
// Updated after each completed task
```

## 📁 Project Structure
```
smart-study-planner/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md           # Project documentation
```

## 🎨 Key Components

- **SmartStudyPlanner**: Main app component with state management
- **TaskCard**: Individual task with completion tracking
- **Dashboard View**: Today's focus and quick stats
- **Schedule View**: Complete study timeline
- **Analytics View**: Performance metrics and insights
- **Subjects View**: Subject management interface

## 🔮 Future Enhancements

- [ ] Quiz generation for each subject
- [ ] Integration with calendar apps (Google Calendar, Outlook)
- [ ] Mobile app version (React Native)
- [ ] Study group collaboration features
- [ ] Pomodoro timer integration
- [ ] Voice input for task logging
- [ ] Export study reports as PDF
- [ ] Dark mode theme
- [ ] Multiple language support
- [ ] Browser extension for quick task logging

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev/)
- UI inspiration from modern learning platforms
- Spaced repetition algorithm based on cognitive science research

## 📞 Support

If you like this project, please give it a ⭐ on GitHub!

For issues and questions, please open an issue on the [GitHub repository](https://github.com/YOUR_USERNAME/smart-study-planner/issues).

---

**Made with ❤️ for students worldwide**