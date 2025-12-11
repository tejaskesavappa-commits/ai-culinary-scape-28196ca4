import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Link } from 'react-router-dom';

interface LampLoginProps {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LampLogin: React.FC<LampLoginProps> = ({
  email,
  password,
  showPassword,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}) => {
  const [isOn, setIsOn] = useState(false);
  const lampRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { Draggable } = await import('gsap/Draggable');
      
      gsap.registerPlugin(Draggable);

      const PROXY = document.createElement('div');
      const HIT = lampRef.current?.querySelector('.lamp__hit') as SVGElement;
      const DUMMY_CORD = lampRef.current?.querySelector('.cord--dummy') as SVGElement;
      
      if (!HIT || !DUMMY_CORD) return;

      const ENDX = DUMMY_CORD.getAttribute('x2');
      const ENDY = DUMMY_CORD.getAttribute('y2');
      
      gsap.set(PROXY, { x: ENDX, y: ENDY });
      gsap.set(['.cords', HIT], { x: -10 });
      gsap.set('.lamp__eye', {
        rotate: 180,
        transformOrigin: '50% 50%',
        yPercent: 50,
      });

      let startX = 0;
      let startY = 0;

      Draggable.create(PROXY, {
        trigger: HIT,
        type: 'x,y',
        onPress: (e: any) => {
          startX = e.x;
          startY = e.y;
        },
        onDrag: function(this: any) {
          gsap.set(DUMMY_CORD, {
            attr: {
              x2: this.x,
              y2: Math.max(400, this.y),
            },
          });
        },
        onRelease: function(this: any, e: any) {
          const DISTX = Math.abs(e.x - startX);
          const DISTY = Math.abs(e.y - startY);
          const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
          
          gsap.to(DUMMY_CORD, {
            attr: { x2: ENDX, y2: ENDY },
            duration: 0.1,
            onComplete: () => {
              if (TRAVELLED > 50) {
                toggleLamp();
              }
              gsap.set(PROXY, { x: ENDX, y: ENDY });
            },
          });
        },
      });

      const toggleLamp = () => {
        setIsOn(prev => !prev);
        const newState = !isOn;
        const hue = Math.floor(Math.random() * 360);
        
        if (lampRef.current) {
          lampRef.current.style.setProperty('--on', newState ? '1' : '0');
          lampRef.current.style.setProperty('--shade-hue', hue.toString());
        }
        
        gsap.to('.lamp__eye', {
          rotate: newState ? 0 : 180,
          duration: 0.3,
        });
      };

      gsap.set('.lamp', { display: 'block' });
    };

    loadGSAP();
  }, []);

  return (
    <div ref={lampRef} className="lamp-container" style={{
      '--on': isOn ? 1 : 0,
      '--shade-hue': '320',
    } as React.CSSProperties}>
      <style>{`
        .lamp-container {
          --cord: hsl(210, 0%, calc((40 + (var(--on, 0) * 50)) * 1%));
          --opening: hsl(50, calc((10 + (var(--on, 0) * 80)) * 1%), calc((20 + (var(--on, 0) * 70)) * 1%));
          --feature: #0a0a0a;
          --accent: 210;
          --tongue: #e06952;
          --base-top: hsl(var(--accent), 0%, calc((40 + (var(--on, 0) * 40)) * 1%));
          --base-side: hsl(var(--accent), 0%, calc((20 + (var(--on, 0) * 40)) * 1%));
          --post: hsl(var(--accent), 0%, calc((20 + (var(--on, 0) * 40)) * 1%));
          --l-1: hsla(45, calc((0 + (var(--on, 0) * 20)) * 1%), calc((50 + (var(--on, 0) * 50)) * 1%), 0.85);
          --l-2: hsla(45, calc((0 + (var(--on, 0) * 20)) * 1%), calc((50 + (var(--on, 0) * 50)) * 1%), 0.85);
          --t-1: hsl(var(--shade-hue), calc((0 + (var(--on, 0) * 20)) * 1%), calc((30 + (var(--on, 0) * 60)) * 1%));
          --t-2: hsl(var(--shade-hue), calc((0 + (var(--on, 0) * 20)) * 1%), calc((20 + (var(--on, 0) * 35)) * 1%));
          --t-3: hsl(var(--shade-hue), calc((0 + (var(--on, 0) * 20)) * 1%), calc((10 + (var(--on, 0) * 20)) * 1%));
          --glow: hsl(var(--shade-hue), 40%, 45%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8vmin;
          flex-wrap: wrap;
          min-height: 100vh;
        }

        .lamp {
          display: none;
          height: 40vmin;
          overflow: visible !important;
        }

        .cord { stroke: var(--cord); }
        .lamp__tongue { fill: var(--tongue); }
        .lamp__hit { cursor: pointer; opacity: 0; }
        .lamp__feature { fill: var(--feature); }
        .lamp__stroke { stroke: var(--feature); }
        .lamp__mouth, .lamp__light { opacity: var(--on, 0); }
        .shade__opening { fill: var(--opening); }
        .shade__opening-shade { opacity: calc(1 - var(--on, 0)); }
        .post__body { fill: var(--post); }
        .base__top { fill: var(--base-top); }
        .base__side { fill: var(--base-side); }
        .top__body { fill: var(--t-3); }

        .lamp-login-form {
          background: rgba(18, 25, 33, 0.9);
          padding: 3rem 2.5rem;
          border-radius: 20px;
          min-width: 320px;
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 2px solid transparent;
          box-shadow: 0 0 0px rgba(255, 255, 255, 0);
        }

        .lamp-login-form.active {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
          border-color: var(--glow);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1), 0 0 30px var(--glow), inset 0 0 15px rgba(255, 255, 255, 0.05);
        }

        .lamp-login-form h2 {
          color: #fff;
          font-size: 2rem;
          margin: 0 0 2rem 0;
          text-align: center;
          text-shadow: 0 0 8px var(--glow);
        }

        .lamp-form-group {
          margin-bottom: 1.5rem;
        }

        .lamp-form-group label {
          display: block;
          color: #aaa;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 5px var(--glow);
        }

        .lamp-input-wrapper {
          position: relative;
        }

        .lamp-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          pointer-events: none;
        }

        .lamp-form-group input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .lamp-form-group input:focus {
          outline: none;
          border-color: var(--glow);
          box-shadow: 0 0 10px var(--glow);
          background: rgba(255, 255, 255, 0.08);
        }

        .lamp-form-group input::placeholder {
          color: #666;
        }

        .lamp-toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          transition: color 0.3s ease;
        }

        .lamp-toggle-password:hover {
          color: #fff;
        }

        .lamp-login-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, var(--glow), hsl(var(--shade-hue), 40%, 35%));
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          margin-top: 0.5rem;
        }

        .lamp-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 20px var(--glow);
        }

        .lamp-login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .lamp-login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lamp-form-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .lamp-link {
          color: #888;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .lamp-link:hover {
          color: var(--glow);
          text-shadow: 0 0 10px var(--glow);
        }
      `}</style>

      <svg
        className="lamp"
        viewBox="0 0 333 484"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="lamp__shade shade">
          <ellipse className="shade__opening" cx="165" cy="220" rx="130" ry="20" />
          <ellipse className="shade__opening-shade" cx="165" cy="220" rx="130" ry="20" fill="url(#opening-shade)" />
        </g>
        <g className="lamp__base base">
          <path className="base__side" d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" />
          <path d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" fill="url(#side-shading)" />
          <ellipse className="base__top" cx="165" cy="430" rx="80" ry="20" />
          <ellipse cx="165" cy="430" rx="80" ry="20" fill="url(#base-shading)" />
        </g>
        <g className="lamp__post post">
          <path className="post__body" d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" />
          <path d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" fill="url(#post-shading)" />
        </g>
        <g className="lamp__cords cords">
          <line className="cord cord--dummy" x1="124" y2="348" x2="124" y1="190" strokeWidth="6" strokeLinecap="round" />
        </g>
        <path className="lamp__light" d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z" fill="url(#light)" />
        <g className="lamp__top top">
          <path className="top__body" fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" />
          <path className="top__shading" fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" fill="url(#top-shading)" />
        </g>
        <g className="lamp__face face">
          <g className="lamp__mouth">
            <path d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z" fill="#141414" />
            <clipPath className="lamp__feature" id="mouth">
              <path d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z" fill="#141414" />
            </clipPath>
            <g clipPath="url(#mouth)">
              <circle className="lamp__tongue" cx="179.4" cy="172.6" r="18" />
            </g>
          </g>
          <g className="lamp__eyes">
            <path className="lamp__eye lamp__stroke" d="M115 135c0-5.523-5.82-10-13-10s-13 4.477-13 10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path className="lamp__eye lamp__stroke" d="M241 135c0-5.523-5.82-10-13-10s-13 4.477-13 10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        <defs>
          <linearGradient id="opening-shade" x1="35" y1="220" x2="295" y2="220" gradientUnits="userSpaceOnUse">
            <stop />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="base-shading" x1="85" y1="444" x2="245" y2="444" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--b-1)" />
            <stop offset="0.8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="side-shading" x1="119" y1="430" x2="245" y2="430" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--b-3)" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="post-shading" x1="150" y1="288" x2="180" y2="288" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--b-1)" />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="light" x1="165.5" y1="218.5" x2="165.5" y2="483.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--l-1)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--l-2)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="top-shading" x1="56" y1="110" x2="295" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--t-1)" stopOpacity=".8" />
            <stop offset="1" stopColor="var(--t-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle className="lamp__hit" cx="124" cy="347" r="66" fill="#C4C4C4" fillOpacity=".1" />
      </svg>

      <div ref={formRef} className={`lamp-login-form ${isOn ? 'active' : ''}`}>
        <h2>Welcome Back</h2>
        <form onSubmit={onSubmit}>
          <div className="lamp-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="lamp-input-wrapper">
              <Mail className="lamp-input-icon" size={16} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="lamp-form-group">
            <label htmlFor="password">Password</label>
            <div className="lamp-input-wrapper">
              <Lock className="lamp-input-icon" size={16} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="lamp-toggle-password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="lamp-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="lamp-form-footer">
            <Link to="/forgot-password" className="lamp-link">
              Forgot password?
            </Link>
          </div>

          <div className="lamp-form-footer">
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="lamp-link" style={{ fontWeight: 500 }}>
                Sign up
              </Link>
            </span>
          </div>

          <div className="lamp-form-footer">
            <Link to="/" className="lamp-link" style={{ fontSize: '0.85rem' }}>
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LampLogin;
