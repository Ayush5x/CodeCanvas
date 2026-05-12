# 📚 Archive Feature Documentation

## 🎯 Overview

The Archive feature is a modern, responsive web application that provides organized access to programming questions from two main sources:
- **LeetCode Questions**: Categorized by data structure topics
- **IIITK Previous Year Questions (PYQs)**: Academic questions from IIIT Kalyani

## 🌟 Features

### ✨ Core Functionality
- **Dynamic Topic Pages**: `/archive/:topic` for LeetCode, `/archive/pyq/:topic` for IIITK PYQs
- **Smart Search**: Real-time filtering across question titles and descriptions
- **Advanced Filtering**: Filter by difficulty level (Easy/Medium/Hard)
- **Tag-based Organization**: Categorize and filter questions by relevant tags
- **Flexible Sorting**: Sort by title, difficulty, or date added
- **View Modes**: Toggle between list and grid display layouts
- **Pagination**: Efficient navigation through large question sets

### 🎨 Design Highlights
- **Cosmic Theme**: Seamlessly matches the existing website aesthetic
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean cards with hover effects and smooth animations
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Performance**: Optimized rendering with React hooks and memoization

## 🏗️ Architecture

### 📁 File Structure
```
src/features/archive/
├── components/
│   ├── landingpage.jsx     # Archive homepage (existing)
│   └── Archive.jsx         # Main archive component (new)
├── data/
│   ├── leetCodeData.js     # LeetCode questions data
│   └── iiitk_pyqData.js    # IIITK PYQ sample data
├── styles/
│   ├── landingpage.css     # Landing page styles (existing)
│   └── Archive.css         # Archive component styles (new)
└── README.md              # This documentation
```

### 🔗 Routing Structure
- `/archive` → Archive landing page with topic cards
- `/archive/:topic` → LeetCode questions for specified topic
- `/archive/pyq/:topic` → IIITK PYQ questions for specified topic

### 🗄️ Data Structure
Each question object includes:
```javascript
{
  id: 'unique_identifier',
  title: 'Question Title',
  difficulty: 'Easy|Medium|Hard',
  description: 'Brief description of the problem',
  tags: ['Array', 'String', 'Algorithm'],
  dateAdded: '2024-01-15',
  leetcodeUrl: 'https://leetcode.com/problems/...',  // LeetCode only
  solutionUrl: 'https://github.com/...',
  year: '2023',        // IIITK PYQ only
  semester: 'Spring',  // IIITK PYQ only
  marks: 15           // IIITK PYQ only
}
```

## 🚀 Technical Implementation

### ⚛️ React Hooks Used
- `useState`: Managing component state (search, filters, pagination)
- `useEffect`: Side effects (pagination reset on filter changes)
- `useMemo`: Performance optimization for expensive computations
- `useParams`: Route parameter extraction

### 🎭 Key Libraries
- **React Router**: Navigation and routing
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Consistent iconography
- **CSS Modules**: Scoped styling with cosmic theme

### 🔧 Performance Optimizations
- **Memoized Computations**: Filtered and sorted questions
- **Lazy Loading**: Pagination for large datasets
- **Debounced Search**: Efficient search implementation
- **Optimized Re-renders**: Strategic use of React.memo and useMemo

## 📊 Sample Data

### 🔗 LeetCode Topics Available
- **Linked List**: 5 questions (Easy to Medium difficulty)
- **Stacks & Queues**: 5 questions with design patterns
- **Trees**: 5 questions covering BST and binary trees
- **Sorting**: 5 questions with various sorting algorithms
- **Pathfinding**: 5 questions on graph algorithms

### 🎓 IIITK PYQ Topics Available
- **Linked List**: 10 questions (2019-2023, 8-25 marks each)
- **Stacks & Queues**: 10 questions with implementation focus
- **Trees**: 10 questions covering tree algorithms
- **Sorting**: 10 questions on sorting analysis
- **Pathfinding**: 10 questions on graph theory

## 🎨 Design Decisions

### 🌌 Theme Consistency
- **Color Palette**: Cosmic blues (#5bb4e8, #a78bfa) with dark backgrounds
- **Typography**: Inter font family for modern readability
- **Animation**: Subtle hover effects and smooth transitions
- **Layout**: Card-based design with consistent spacing

### 📱 Responsive Strategy
- **Desktop**: Multi-column grid layout with full feature set
- **Tablet**: Adaptive columns with maintained functionality
- **Mobile**: Single-column layout with optimized touch targets

### ♿ Accessibility Features
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Semantic HTML and ARIA labels
- **Focus Management**: Clear focus indicators

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- React 18+
- React Router v6

### Installation
```bash
# Dependencies are already included in the main project
# No additional installation required
```

### Usage
```javascript
// Navigate to archive routes
<Link to="/archive">Archive Home</Link>
<Link to="/archive/linked-list">LeetCode Linked List</Link>
<Link to="/archive/pyq/trees">IIITK Trees PYQs</Link>
```

## 🔧 Customization

### Adding New Topics
1. **Update Data Files**: Add new topic objects to `leetCodeData.js` or `iiitk_pyqData.js`
2. **Update Landing Page**: Add new topic cards to `landingpage.jsx`
3. **Test Routes**: Ensure new routes work with the Archive component

### Modifying Styles
- **Colors**: Update CSS custom properties in `Archive.css`
- **Layout**: Modify grid templates and breakpoints
- **Animations**: Adjust Framer Motion configurations

### Adding Features
- **New Filters**: Add filter options in the controls section
- **Export Functions**: Add question export capabilities
- **Bookmarking**: Implement favorite questions feature

## 🐛 Troubleshooting

### Common Issues
1. **Questions Not Loading**: Check data file exports and imports
2. **Routing Errors**: Verify route configuration in App.jsx
3. **Styling Issues**: Ensure CSS files are properly imported
4. **Performance Problems**: Check for unnecessary re-renders

### Debug Tips
- Use React DevTools to inspect component state
- Check browser console for JavaScript errors
- Verify network requests for data loading
- Test responsive design in browser dev tools

## 🚀 Future Enhancements

### Planned Features
- **Question Difficulty Analytics**: Visual difficulty distribution
- **Progress Tracking**: User completion status
- **Advanced Search**: Full-text search with highlighting
- **Question Ratings**: Community-driven difficulty ratings
- **Study Plans**: Curated learning paths
- **Code Editor Integration**: In-browser coding environment

### Technical Improvements
- **Virtualization**: For handling thousands of questions
- **Caching**: Local storage for improved performance
- **PWA Features**: Offline access and installation
- **Testing**: Comprehensive unit and integration tests
- **Analytics**: Usage tracking and insights

## 📄 License

This feature is part of the DSA-Website project and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or issues related to the Archive feature:
- Open an issue on the main repository
- Check existing documentation and README files
- Review the code comments for implementation details

---

*Built with ❤️ for the IIIT Kottayam by Openverse*
