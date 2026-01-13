const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} MovieStream. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
