import { useState } from 'react';
import { 
  Calendar,
  Clock,
  Shield,
  ShoppingBag,
  GraduationCap,
  Heart,
  MapPin,
  User,
  ChevronRight,
  Search
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'safety' | 'academic' | 'shopping' | 'general';
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Essential Campus Safety Tips for New Students',
    excerpt: 'Stay safe on campus with these practical security guidelines and emergency protocols every student should know.',
    content: `Starting university life brings excitement and new challenges. Your safety should always be a top priority. Here are essential safety tips to help you navigate campus life securely.

**Personal Safety Guidelines:**
• Always walk with friends during late hours, especially after evening classes or library sessions
• Keep your student ID visible and carry emergency contacts
• Use well-lit pathways and avoid shortcuts through isolated areas
• Trust your instincts - if something feels wrong, seek help immediately

**Dormitory Security:**
• Always lock your room when leaving, even for short periods
• Don't prop open security doors for others you don't know
• Report suspicious activities to security immediately
• Keep valuables locked away and avoid displaying expensive items

**Emergency Procedures:**
• Save campus security numbers in your phone: 0302-123-456
• Know the locations of emergency call boxes around campus
• Familiarize yourself with evacuation routes in your residence
• Register for campus emergency alert systems

**Digital Safety:**
• Use strong passwords for all accounts and WiFi connections
• Be cautious about sharing personal information on social media
• Avoid using public computers for sensitive transactions
• Keep your devices updated with latest security patches

Remember, campus security is here to help. Don't hesitate to contact them for escorts or if you feel unsafe.`,
    category: 'safety',
    author: 'Campus Security Office',
    publishedAt: '2024-01-15',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: '2',
    title: 'Exam Preparation Strategies That Actually Work',
    excerpt: 'Proven study techniques and exam strategies to help you perform your best during assessment periods.',
    content: `Exam season can be stressful, but with the right preparation strategies, you can approach your assessments with confidence.

**Effective Study Techniques:**
• Create a realistic study timetable 4-6 weeks before exams
• Use active recall methods instead of just re-reading notes
• Form study groups to discuss complex concepts
• Practice past papers under timed conditions

**Time Management:**
• Break large topics into smaller, manageable chunks
• Use the Pomodoro Technique: 25 minutes study, 5 minutes break
• Prioritize subjects based on exam dates and your confidence level
• Schedule regular breaks to avoid burnout

**Exam Day Success:**
• Get adequate sleep (7-8 hours) before exam day
• Eat a nutritious breakfast to fuel your brain
• Arrive early to settle in and review your materials
• Read all questions carefully before starting
• Manage your time effectively during the exam

**Stress Management:**
• Practice relaxation techniques like deep breathing
• Exercise regularly to reduce anxiety and improve focus
• Maintain social connections - don't isolate yourself
• Seek help from counselors if stress becomes overwhelming

**Resources Available:**
• Library extends hours during exam periods
• Free tutoring sessions available in the Learning Center
• Study spaces reserved specifically for exam preparation
• Mental health support through Student Services

Remember, preparation is key to success. Start early and maintain consistent study habits throughout the semester.`,
    category: 'academic',
    author: 'Academic Support Center',
    publishedAt: '2024-01-12',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    title: 'Best Shopping Spots Near Campus for Students',
    excerpt: 'Discover affordable shopping destinations, student discounts, and budget-friendly options around campus.',
    content: `Living on a student budget doesn't mean you have to compromise on your needs. Here's your guide to smart shopping near campus.

**Grocery Shopping:**
• **Shoprite Legon** - 10 min walk, student discounts on bulk purchases
• **Melcom Plus** - Affordable household items and electronics
• **Local Markets** - Fresh produce at unbeatable prices, open daily
• **Campus Store** - Emergency snacks and supplies, accepts student cards

**Clothing & Fashion:**
• **Kantamanto Market** - Vintage and affordable clothing options
• **Accra Mall** - Mid-range shopping with occasional student promotions
• **Local Boutiques** - Unique pieces and custom tailoring services
• **Second-hand Shops** - Quality items at fraction of original prices

**Electronics & Tech:**
• **Koala Shopping Center** - Computers, phones, and accessories
• **Kwame Nkrumah Circle** - Affordable phone repairs and accessories
• **Campus Tech Hub** - Student laptop rentals and repairs
• **Online Platforms** - Jumia and Tonaton for delivered items

**Books & Supplies:**
• **Campus Bookstore** - Textbooks and academic materials
• **EPP Bookshop** - Discounted books and stationery
• **Online Resources** - Digital textbooks and materials
• **Student Exchange** - Buy/sell used textbooks with peers

**Money-Saving Tips:**
• Join student discount programs and loyalty cards
• Shop during end-of-semester sales
• Buy in groups to qualify for bulk discounts
• Use campus shuttle services to reach shopping centers
• Check social media for flash sales and promotions

**Student Services:**
• Financial literacy workshops every month
• Budgeting assistance through Student Affairs
• Emergency financial support programs available
• Part-time job listings updated weekly

Plan your shopping trips and always compare prices. Many vendors offer special rates for students with valid ID cards.`,
    category: 'shopping',
    author: 'Student Life Office',
    publishedAt: '2024-01-10',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '4',
    title: 'Mental Health Resources and Wellness Tips',
    excerpt: 'Take care of your mental health with these campus resources and daily wellness practices for students.',
    content: `Your mental health is just as important as your academic success. Here are resources and tips to maintain your wellbeing.

**Campus Mental Health Services:**
• Counseling Center - Free individual and group therapy sessions
• Peer Support Groups - Weekly meetings for various topics
• Crisis Hotline - 24/7 support available at 0302-789-123
• Wellness Workshops - Stress management and mindfulness sessions

**Daily Wellness Practices:**
• Establish a consistent sleep schedule
• Exercise regularly - use campus gym or join sports clubs
• Practice mindfulness or meditation for 10-15 minutes daily
• Maintain social connections and don't isolate yourself
• Eat balanced meals and stay hydrated

**Academic Stress Management:**
• Break large assignments into smaller tasks
• Use campus study spaces designed for focus
• Join study groups to share the workload
• Communicate with professors when struggling
• Utilize tutoring and academic support services

**Warning Signs to Watch For:**
• Persistent feelings of sadness or anxiety
• Changes in sleep or appetite patterns
• Difficulty concentrating or making decisions
• Loss of interest in activities you usually enjoy
• Thoughts of self-harm or suicide

If you notice these signs in yourself or others, seek help immediately. Remember, asking for help is a sign of strength, not weakness.`,
    category: 'general',
    author: 'Wellness Center',
    publishedAt: '2024-01-08',
    readTime: '4 min read',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '5',
    title: 'Campus Events Calendar: January 2024',
    excerpt: 'Stay updated with upcoming campus events, workshops, and activities planned for this month.',
    content: `Don't miss out on these exciting campus events and opportunities happening this month.

**Academic Events:**
• Jan 20: Research Methodology Workshop
• Jan 25: Career Fair with 50+ Companies
• Jan 28: Graduate School Information Session

**Social Activities:**
• Jan 22: Welcome Back Party at Student Center
• Jan 27: International Food Festival
• Jan 30: Movie Night Under the Stars

**Sports & Recreation:**
• Ongoing: Intramural Basketball League
• Jan 24: Campus 5K Fun Run
• Jan 31: Swimming Competition

**Professional Development:**
• Jan 21: Resume Writing Workshop
• Jan 26: Interview Skills Masterclass
• Jan 29: Entrepreneurship Seminar

All events are free for registered students. Check your student portal for registration links and updates.`,
    category: 'general',
    author: 'Events Coordinator',
    publishedAt: '2024-01-05',
    readTime: '2 min read',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All News', icon: GraduationCap },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'general', label: 'General', icon: Heart }
  ];

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'academic': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shopping': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Article Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 mb-4"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to News
            </button>
            
            <div className="max-w-4xl mx-auto">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getCategoryColor(selectedArticle.category)}`}>
                {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedArticle.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedArticle.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedArticle.publishedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.readTime}
                </div>
              </div>
              
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full aspect-video object-cover rounded-xl mb-8"
              />
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Student News & Updates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay informed with the latest campus news, safety updates, academic tips, and student resources.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Featured Article */}
        {filteredArticles.find(article => article.featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Article</h2>
            {(() => {
              const featured = filteredArticles.find(article => article.featured)!;
              return (
                <div 
                  onClick={() => setSelectedArticle(featured)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-1/2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getCategoryColor(featured.category)}`}>
                        {featured.category.charAt(0).toUpperCase() + featured.category.slice(1)}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {featured.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{featured.author}</span>
                        <span>•</span>
                        <span>{formatDate(featured.publishedAt)}</span>
                        <span>•</span>
                        <span>{featured.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.filter(article => !article.featured).map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getCategoryColor(article.category)}`}>
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{article.author}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}