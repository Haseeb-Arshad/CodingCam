import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef(null);
  
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 h-16">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg className="h-8 w-8 text-[#014D71]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gradient">CodingCam</span>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <BadgeContainer>
              <Button
                icon="notification"
                className="k-button-md k-rounded-md"
                style={{ backgroundColor: 'transparent', border: 'none' }}
              />
              <Badge themeColor="primary" size="small" position="inside" />
            </BadgeContainer>
            
            <span
              onClick={handleMenuToggle}
              ref={anchorRef}
              className="cursor-pointer"
            >
              <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-[#014D71] flex-shrink-0">
                <img 
                  src={user?.profilePicture || 'https://via.placeholder.com/40'} 
                  alt={user?.fullName || user?.username || 'User'} 
                  className="w-full h-full object-cover"
                />
              </div>
            </span>
            
            <Popup
              anchor={anchorRef.current}
              show={showMenu}
              popupClass="k-popup-content"
              animate={false}
              style={{
                width: '224px',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="p-2">
                <div className="font-normal">
                  <div className="flex items-center space-x-2 p-2">
                    <div className="rounded-full overflow-hidden w-8 h-8">
                      <img 
                        src={user?.profilePicture || 'https://via.placeholder.com/32'} 
                        alt={user?.fullName || user?.username || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <hr className="my-1" />
                <Link 
                  to="/profile" 
                  className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMenu(false)}
                >
                  <span className="flex-1">Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setShowMenu(false)}
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Settings</span>
                </Link>
                <hr className="my-1" />
                <div 
                  className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={handleLogout}
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log out</span>
                </div>
              </div>
            </Popup>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/login')}
              style={{ backgroundColor: 'transparent', border: '1px solid #014D71', color: '#014D71' }}
            >
              Log in
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              themeColor="primary"
              style={{ backgroundColor: '#014D71' }}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;