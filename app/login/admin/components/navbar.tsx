import { Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div>
            <img src="/Main.png" alt="Prime Pick Logo" className="h-8 w-auto" />
        </div>
       <div
            className="
              inline-flex items-center gap-1
              rounded-full
              border border-[#007CFC]/30
              bg-[#EEFBFF]
              px-4 py-2
              text-[#0E325D]
            "
          >
            <Shield className="h-3 w-3 text-[#007CFC]" />
            <span className="text-xs font-semibold text-[#007CFC]">Secure SFTP Management</span>
          </div>
        
      </nav>
    </header>
  );
}
