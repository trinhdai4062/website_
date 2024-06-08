import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(prevProgress => prevProgress + 1);
      } else {
        clearInterval(interval);
      }
    }, 30); // Điều chỉnh tốc độ cập nhật tại đây
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    }}>
      <style>
        {`
          .loading-container {
            position: relative;
            width: 120px;
            height: 120px;
            text-align: center;
          }
          .loading-spinner {
            border-right: 16px solid #f3f3f3;
            border-top: 16px solid #FFD700;
            border-bottom: 16px solid #8A2BE2;
            border-left: 16px solid #008000;
            width: 100%;
            height: 100%;
            animation: spin 2s linear infinite;
            background: linear-gradient(to right, #8A2BE2, #8A2BE2) top,
                        linear-gradient(to right, #FFD700, #FFD700) right,
                        linear-gradient(to right, #FF0000, #FF0000) bottom,
                        linear-gradient(to right, #f3f3f3, #f3f3f3) left;
            background-repeat: no-repeat;
            background-size: 100% 10px, 10px 100%, 100% 10px, 10px 100%;
            border-radius: 50%;
          }
          .loading-text {
            position: absolute;
            top: 35%;
            left: 0;
            width: 100%;
            transform: translateY(-50%);
            font-size: 24px;
            margin-top: 20px;
            animation: fade-in 2s ease-out;
            animation-fill-mode: forwards;
            opacity: 0;
            transition: opacity 1s ease-out;
          }
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">{progress}%</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
