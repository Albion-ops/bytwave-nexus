import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">BW</span>
              </div>
              <span className="font-bold text-xl">BytWave</span>
            </div>
            <p className="text-muted-foreground">
              Professional technology solutions for modern businesses.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">CCTV Installation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Hardware Supply</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Software Solutions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">POS Systems</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>contact@bytwave.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Tech Street, Suite 100</li>
              <li>San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BytWave Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
