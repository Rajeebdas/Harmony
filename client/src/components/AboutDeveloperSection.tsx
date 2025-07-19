import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

export default function AboutDeveloperSection() {
  return (
    <section className="mb-12">
      <div className="bg-card-bg rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-text-primary mb-4">About The Developer!</h2>
        <p className="text-text-secondary mb-6">
          Built with passion for music and technology, this platform represents the perfect harmony between elegant design and powerful functionality. Our mission is to bring you closer to the music you love while discovering new artists and sounds that inspire you.
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
          <Button
            asChild
            variant="link"
            className="flex items-center space-x-2 text-accent-blue hover:underline p-0"
          >
            <a href="https://www.linkedin.com/in/rajeeb-das-cse/" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.521-1.248-1.342-1.248-.822 0-1.358.54-1.358 1.248 0 .694.52 1.248 1.327 1.248h.015zm4.908 8.212h2.4V9.359c0-.215.016-.43.08-.584.175-.43.574-.877 1.244-.877.877 0 1.228.662 1.228 1.634v3.862h2.4V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.6 5.6 0 0 1 .016-.025V6.169h-2.4c.03.7 0 7.225 0 7.225z"/></svg>
              <span>LinkedIn</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
