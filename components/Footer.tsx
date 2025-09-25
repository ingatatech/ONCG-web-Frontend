import Image from "next/image"
import Link from "next/link"
import { Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-border text-white">
      <div className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/images/oncg-logo1.jpg"
                alt="ONCG - ON Consulting Group Ltd"
                width={200}
                height={80}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/80 mb-6 text-pretty leading-relaxed">
              ON Consulting Group Ltd delivers expert auditing, advisory services, and strategic consultancy to help
              businesses achieve compliance, efficiency, and sustainable growth.
            </p>
            
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Leadership
                </Link>
              </li>
             
              <li>
                <Link href="/insights" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                  Insights
                </Link>
              </li>
           
            </ul>
          </div>

            {/* Contact Info */}
            <div className="space-y-3">
            <h3 className="font-semibold text-white mb-4">Our Contacts</h3>

              <div className="flex items-center space-x-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@oncg.co.rw" className="hover:text-white transition-colors">
                  info@oncg.co.rw
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <a href="tel:+250788303061" className="hover:text-white transition-colors">
                  +(250) 788 303 061
                </a>
              </div>
               <div className="flex items-center space-x-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <a href="tel:+250780066190" className="hover:text-white transition-colors">
                 +(250) 780 066 190
                </a>
              </div>
              <div className="flex items-start space-x-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-2 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <div className="text-sm text-primary-foreground/80">
              © {new Date().getFullYear()} ON Consulting Group Ltd. All rights reserved.
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <span className="text-sm text-primary-foreground/80">
              Developed by <span className="font-semibold text-white">The Ingata Technologies Ltd</span>
            </span>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://linkedin.com/company/oncg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-primary transition-all duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/oncg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-primary transition-all duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/oncg"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-primary transition-all duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}