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
          <Button variant="link" className="flex items-center space-x-2 text-accent-blue hover:underline p-0">
            <Phone className="w-4 h-4" />
            <span>+91 0987654321</span>
          </Button>
          <Button variant="link" className="flex items-center space-x-2 text-accent-blue hover:underline p-0">
            <Mail className="w-4 h-4" />
            <span>dbraaga@gmail.com</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
