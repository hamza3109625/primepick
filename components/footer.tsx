export function Footer() {
  return (
    <footer className="bg-[#0B2446] border-t border-[#0E325D]/80 px-6 py-4">
      <div className="flex justify-center items-center">
        <div className="footer-copyright text-sm text-white/80">
          &copy; 2026{" "}
          <a 
            href="#" 
            className="text-[#007CFC] hover:text-[#0096FF] transition-colors"
          >
            Mazume Solutions Inc.
          </a>
          . All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}