import React from 'react';

const LogoLoader: React.FC = () => (
  <>
    <style>{`
      @keyframes ll-pulse {
        0%, 100% { transform: scale(1);    opacity: 1;    filter: brightness(1); }
        50%       { transform: scale(1.12); opacity: 0.85; filter: brightness(1.15); }
      }

      @keyframes ll-dots {
        0%   { content: ''; }
        33%  { content: '.'; }
        66%  { content: '..'; }
        100% { content: '...'; }
      }

      @keyframes ll-fade-in {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .ll-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        animation: ll-fade-in 0.4s ease forwards;
      }

      .ll-logo {
        width: clamp(72px, 16vw, 120px);
        height: clamp(72px, 16vw, 120px);
        object-fit: contain;
        animation: ll-pulse 2s ease-in-out infinite;
        will-change: transform, opacity;
      }

      .ll-label {
        font-family: var(--font-sans, system-ui, sans-serif);
        font-size: clamp(11px, 1.8vw, 13px);
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.35);
        display: flex;
        align-items: baseline;
        gap: 1px;
      }

      .ll-dots::after {
        content: '';
        animation: ll-dots 1.5s steps(1) infinite;
      }
    `}</style>

    <div className="ll-wrap">
      <img src="/bf-logo.svg" alt="BlockForge" className="ll-logo" />
      <p className="ll-label">
        Authenticating<span className="ll-dots" />
      </p>
    </div>
  </>
);

export default LogoLoader;
