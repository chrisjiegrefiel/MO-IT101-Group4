
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BarChart, Users, Clock, Calculator } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  const isHomePage = location.pathname === '/';
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isHomePage && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/" aria-label="Back to home">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <div className="flex items-center">
            <span className="text-xl font-semibold">Payfolk</span>
            <span className="text-xs text-primary ml-1">Wizardry</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild className="text-sm font-normal">
            <Link to="/" className={location.pathname === '/' ? 'text-primary' : ''}>
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-sm font-normal">
            <Link to="/employees" className={location.pathname.startsWith('/employees') ? 'text-primary' : ''}>
              <Users className="h-4 w-4 mr-2" />
              Employees
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-sm font-normal">
            <Link to="/attendance" className={location.pathname.startsWith('/attendance') ? 'text-primary' : ''}>
              <Clock className="h-4 w-4 mr-2" />
              Attendance
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="text-sm font-normal">
            <Link to="/payroll" className={location.pathname.startsWith('/payroll') ? 'text-primary' : ''}>
              <Calculator className="h-4 w-4 mr-2" />
              Payroll
            </Link>
          </Button>
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
