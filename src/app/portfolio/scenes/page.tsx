import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Scenes - GNG Global Investment Group",
  description: "Digital content company helping clients enhance their brand through integrated and interactive marketing campaigns.",
};

export default function ScenesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#293d7c] to-[#1a2850] text-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="text-cyan-400 mb-2">Media & Digital Content</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Scenes</h1>
              <p className="text-xl text-gray-200 mb-6">
                Australia
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/portfolio">
                    Back to Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#293d7c] mb-6">Overview</h2>
              <p className="text-lg text-gray-700 mb-6">
                Scenes is a digital content company who helps private and public clients enhance and grow their brand by developing and implementing integrated and interactive marketing campaigns.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Sector</div>
                  <div className="text-lg font-semibold text-[#293d7c]">Media & Digital Content</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Established</div>
                  <div className="text-lg font-semibold text-[#293d7c]">2023</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#293d7c] mb-8">Services</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Integrated Marketing Campaigns</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Interactive Digital Content</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Brand Development</h3>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Digital Strategy</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
