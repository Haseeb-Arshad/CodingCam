import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from '@progress/kendo-react-buttons';
import { Popup } from '@progress/kendo-react-popup';
import { Avatar } from '@progress/kendo-react-layout';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { currentUser } from "@/lib/mockData";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = true; // For demo purposes
  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef(null);
  
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    // Implement logout functionality
    navigate('/login');
  };

  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 h-16">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg className="h-8 w-8 text-wakatime-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gradient">CodeCortex</span>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <BadgeContainer>
              <Button
                look="flat"
                icon="bell"
                className="k-button-md k-rounded-md"
              />
              <Badge themeColor="primary" size="small" position="top end" />
            </BadgeContainer>
            
            <span
              onClick={handleMenuToggle}
              ref={anchorRef}
              className="cursor-pointer"
            >
              <Avatar
                type="image"
                size="medium"
                shape="circle"
                src={currentUser.avatar}
                alt={currentUser.name}
              />
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
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <hr className="my-1" />
                <Link to="/profile" className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md">
                  <span className="flex-1">Profile</span>
                </Link>
                <div className="flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Settings</span>
                </div>
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
            <Button look="flat" onClick={() => navigate('/login')}>Log in</Button>
            <Button themeColor="primary" onClick={() => navigate('/signup')}>Sign up</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;