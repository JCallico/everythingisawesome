import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const DateSelector = ({ 
  visible, 
  onClose, 
  availableDates = [], 
  currentDate = null
}) => {
  const navigate = useNavigate();
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  useEffect(() => {
    // Set the current view to the month of the current/selected date, or latest available
    if (currentDate) {
      const date = moment(currentDate).toDate();
      setCurrentViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    } else if (availableDates.length > 0) {
      // If no current date, show the month of the most recent available date
      const latestDate = moment(availableDates[0]).toDate();
      setCurrentViewDate(new Date(latestDate.getFullYear(), latestDate.getMonth(), 1));
    }
  }, [currentDate, availableDates]);



  const handleDateClick = (dateString, event) => {
    event.preventDefault();
    const targetPath = dateString === availableDates[0] ? '/' : `/${dateString}`;
    onClose();
    navigate(targetPath);
  };

  const renderCalendarDay = (dayInfo) => {
    const { dateString, hasNews, isSelected, isTodayDate, day } = dayInfo;
    
    const isActive = hasNews;
    
    return (
      <div
        key={dateString}
        className={`calendar-day ${isActive ? 'calendar-day-active' : 'calendar-day-inactive'} ${
          isSelected ? 'calendar-day-selected' : ''
        } ${isTodayDate ? 'calendar-day-today' : ''}`}
      >
        {isActive ? (
          <button
            className="calendar-day-link"
            onClick={(e) => handleDateClick(dateString, e)}
          >
            <div className="calendar-day-content">
              <span className="calendar-day-text">{day}</span>
              {isActive && <div className="calendar-day-dot" />}
            </div>
          </button>
        ) : (
          <div className="calendar-day-content">
            <span className="calendar-day-text calendar-day-text-inactive">{day}</span>
          </div>
        )}
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const days = getCalendarDays();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7);
      
      // Fill remaining slots with empty cells to maintain 7-day grid
      while (week.length < 7) {
        week.push(null);
      }
      
      weeks.push(
        <div key={i} className="calendar-week">
          {week.map((dayInfo, index) => 
            dayInfo ? renderCalendarDay(dayInfo) : (
              <div key={`empty-${i}-${index}`} className="calendar-day-placeholder" />
            )
          )}
        </div>
      );
    }
    
    return weeks;
  };

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentViewDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const hasNewsForDate = (dateString) => {
    return availableDates.includes(dateString);
  };

  const formatDateToString = (date) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const getCalendarDays = () => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    // Get the first day of the month and its weekday (0 = Sunday, 6 = Saturday)
    const firstDay = new Date(year, month, 1);
    const firstDayWeekday = firstDay.getDay();
    
    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Generate the actual days for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentCalendarDate = new Date(year, month, day);
      const dateString = formatDateToString(currentCalendarDate);
      const hasNews = hasNewsForDate(dateString);
      const isSelected = dateString === currentDate;
      const isTodayDate = moment(dateString).isSame(moment(), 'day');
      
      days.push({
        date: new Date(currentCalendarDate),
        dateString,
        isCurrentMonth: true,
        hasNews,
        isSelected,
        isTodayDate,
        day: day
      });
    }
    
    // Ensure we have at least 35 days (5 weeks) for consistent layout
    // Add placeholder days if needed to fill out the grid
    while (days.length < 35) {
      days.push(null);
    }
    
    return days;
  };

  const getMonthYearText = () => {
    return currentViewDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (!visible) return null;

  return (
    <div className="date-selector-overlay" onClick={onClose}>
      <div className="date-selector-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="date-selector-header">
          <h2 className="date-selector-title">Browse News by Date</h2>
          <p className="date-selector-subtitle">
            {availableDates.length} days of positive news available
          </p>
          <button 
            onClick={onClose} 
            className="date-selector-close"
            aria-label="Close date selector"
          >
            ✕
          </button>
        </div>

        {/* Quick stats */}
        <div className="date-selector-stats">
          <div className="stat-item">
            <span className="stat-number">{availableDates.length}</span>
            <span className="stat-label">Days</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {availableDates.length > 0 ? Math.ceil(availableDates.length / 7) : 0}
            </span>
            <span className="stat-label">Weeks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">∞</span>
            <span className="stat-label">Awesome</span>
          </div>
        </div>

        {/* Content */}
        <div className="date-selector-content">
          <div className="calendar-container">
            {/* Calendar Header */}
            <div className="calendar-header">
              <button onClick={goToPreviousMonth} className="calendar-nav-button">
                ◀
              </button>
              <h3 className="calendar-title">{getMonthYearText()}</h3>
              <button onClick={goToNextMonth} className="calendar-nav-button">
                ▶
              </button>
            </div>

            {/* Calendar Days Header */}
            <div className="calendar-days-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="calendar-day-header">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {renderCalendarGrid()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
