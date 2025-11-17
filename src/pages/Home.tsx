import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Clock,
  Coffee,
  Headphones,
  Key,
  MapPin,
  Shield,
  Sparkles,
  Users,
  Wifi
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import RoomCard from '../components/RoomCard';
import TestimonialSlider from '../components/TestimonialSlider';
import { rooms, properties } from '../data/sampleData';

export default function Home() {
  const { navigate } = useRouter();
  const featuredRooms = rooms.slice(0, 3);

  const stats = [
    { label: 'Purpose-built residences', value: '4', icon: Building2, description: 'All within 15 minutes of campus' },
    { label: 'Residents settled', value: '280+', icon: Users, description: 'Students and young professionals' },
    { label: 'Average response time', value: '12min', icon: Headphones, description: 'Resident support team' },
    { label: 'Community rating', value: '4.8/5', icon: Sparkles, description: 'Based on verified reviews' }
  ];

  const howItWorks = [
    {
      title: 'Tell us what you need',
      description: 'Share your budget, preferred location, and move-in date. We match you with the right community instantly.',
      icon: MapPin
    },
    {
      title: 'Pick your perfect space',
      description: 'Tour virtually or in person, compare amenities, and reserve your favourite room in minutes.',
      icon: CalendarCheck
    },
    {
      title: 'Move in with confidence',
      description: 'From airport pickup to roommate pairing, our team stays with you through move-in day and beyond.',
      icon: Key
    }
  ];

  const perks = [
    {
      title: 'Fast Mobile Network & Study-ready spaces',
      description: 'Dedicated study lounges and top tier network connection for stable internet keep you connected when deadlines hit.',
      icon: Wifi
    },
    {
      title: 'Always-on security',
      description: 'Smart access, CCTV, and on-site guards deliver round-the-clock peace of mind.',
      icon: Shield
    },
    {
      title: 'Flexible stay plans',
      description: 'Semester, trimester, or full-year—switch between properties without losing your deposit.',
      icon: Clock
    },
    {
      title: 'Social & wellness calendar',
      description: 'Weekly mixers, gym sessions, and mental wellness check-ins build a supportive community.',
      icon: Coffee
    }
  ];

  return (
    <div>
      <section className="relative flex items-center justify-center overflow-hidden bg-gray-900 min-h-[calc(70vh+120px)] md:h-[70vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=2000"
            alt="Student suite hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        </div>

        <div className="relative z-10 max-w-5xl px-4 py-12 md:py-24 text-center text-white mt-[115px] md:mt-0">

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Five-star living tailored for students across Accra
          </h1>
          <p className="mt-6 text-lg text-white/80 md:text-xl">
            Discover four vibrant communities with curated amenities, active resident support, and flexible contracts designed around your academic rhythm.
          </p>
          <div className="mt-6 md:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('/booking')}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:translate-y-0.5 hover:bg-rose-800 w-full sm:w-auto max-w-xs"
            >
              Reserve your space
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-4 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-white transition hover:border-white hover:bg-white/10 w-full sm:w-auto max-w-xs"
            >
              Schedule a tour
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <Icon className="mb-4 h-9 w-9 text-rose-700 dark:text-rose-400" />
                  <p className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Featured rooms ready for move-in</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Secure your space today and switch between properties as your schedule evolves.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              View all floor plans
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rates start from ₵800/month · Flexible payment plans available</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                Group Booking Special
              </span>
              <h2 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
                Book together, save together
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Planning to move in with friends? Our group booking feature lets up to 4 people secure rooms in the same property with coordinated move-in dates and group discounts.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 text-rose-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Up to 4 people per group</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for friend groups or study partners</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5 text-rose-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Group discounts available</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Save up to 10% when booking as a group</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5 text-rose-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Synchronized move-in dates</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Coordinate your arrival with your group</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/booking')}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-800"
              >
                Start Group Booking
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-rose-50 to-rose-100 p-8 shadow-xl dark:border-gray-700 dark:from-rose-900/20 dark:to-rose-800/20">
                <div className="mb-6 flex -space-x-4">
                  <div className="h-16 w-16 rounded-full border-4 border-white bg-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    A
                  </div>
                  <div className="h-16 w-16 rounded-full border-4 border-white bg-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    B
                  </div>
                  <div className="h-16 w-16 rounded-full border-4 border-white bg-rose-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    C
                  </div>
                  <div className="h-16 w-16 rounded-full border-4 border-white bg-rose-800 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    D
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  How Group Booking Works
                </h3>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span>One person initiates the group booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>Invite up to 3 friends via email or link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span>Everyone selects their preferred room</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                    <span>Confirm booking and enjoy group benefits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              Move-in made easy
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Three simple steps to life at Student Suite</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              From your first tour to the day you unpack, our concierge-style team keeps every milestone effortless.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map(step => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="absolute -right-10 top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl" />
                  <Icon className="h-9 w-9 text-emerald-500" />
                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Wellness-first living for focused study</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Student Suite Hostels blends premium amenities with structured support so you can focus on coursework and campus life. Our resident team curates academic workshops, wellness programmes, and city discovery tours every month.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {perks.map(perk => {
                  const Icon = perk.icon;
                  return (
                    <div key={perk.title} className="rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <Icon className="h-8 w-8 text-rose-600 dark:text-rose-400" />
                      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{perk.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{perk.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-rose-700 via-rose-600 to-rose-800 p-8 text-white shadow-xl dark:border-rose-500/40">
              <h3 className="text-2xl font-semibold">Dedicated success partner</h3>
              <p className="mt-3 text-sm text-white/80">
                Every resident is paired with a community mentor who checks in weekly to help with academic resources, mental health support, and career coaching.
              </p>
              <div className="mt-8 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Headphones className="mt-1 h-5 w-5" />
                  <span>24/7 help desk with live chat and WhatsApp support.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-1 h-5 w-5" />
                  <span>Monthly progress check-ins and curated events for networking.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-5 w-5" />
                  <span>Career-boost workshops hosted with alumni and partner firms.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Explore resident portal
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              What our residents say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Hear how Student Suite Hostels keeps students thriving on and off campus.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <TestimonialSlider />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gray-900 py-16 text-white">
  <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-rose-500/40 to-transparent blur-3xl" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Stay ahead of campus life</h2>
              <p className="mt-4 text-white/70">
                Join our newsletter for insider room drops, roommate match alerts, and invites to exclusive Student Suite events before they go public.
              </p>
            </div>
            <form className="flex flex-col gap-4 md:flex-row">
              <input
                type="email"
                required
                placeholder="Enter your student email"
                className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-rose-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800">
                Join the list
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
