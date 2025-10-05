import React from 'react'

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-secondary/10 via-primary/5 to-secondary/10 dark:from-secondary/20 dark:via-primary/10 dark:to-secondary/20 backdrop-blur border-t border-border/40 dark:border-gray-700/40 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-end">
          {/* Logo */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-10 w-10 lg:w-15 lg:h-15 mr-0 "
                style={{ maxWidth: '100%', maxHeight: '100%' }}
             />
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Predictive
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Revolutionizing healthcare with AI-powered diagnostics and personalized health insights.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This content is AI-generated and for informational purposes only. 
              Consult a healthcare professional before taking any medication or making medical decisions.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right sm:col-span-2 lg:col-span-1">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 Predictive. All rights reserved.
            </p>
            
            
              <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-2 pt-6">
                Developed By:
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                <a
                  href="https://portfolio-xhbc.onrender.com/"
                  className="text-xs sm:text-sm text-primary hover:scale-120 transition-transform duration-200"

                >
                  Prayanshu
                </a>
                <span className="text-xs sm:text-sm text-muted-foreground">&</span>
                <a
                  href="https://portfolio-nine-mu-z4qejubsp7.vercel.app/"
                  className="text-xs sm:text-sm text-primary hover:scale-120 transition-transform duration-200"

                >
                  Manvendra
                </a>
              </div>
            
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer