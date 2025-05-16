import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Globe, Clock, User, Tag, ExternalLink, Share } from "lucide-react";

// Sample detailed portfolio data with case studies
const portfolioDetails = {
  "p1": {
    id: "p1",
    title: "E-commerce Website Redesign",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Design",
    clientName: "Fashion Boutique",
    clientDescription: "A high-end fashion retailer with both physical and online presence, looking to enhance their digital shopping experience.",
    projectDuration: "3 months",
    completionDate: "March 2023",
    website: "https://example.com/fashion-boutique",
    description: "Complete redesign of an e-commerce platform, focusing on improved user experience and conversion rate optimization.",
    tags: ["E-commerce", "UX Design", "Frontend", "Responsive Design", "Payment Integration"],
    featured: true,
    challenge: "The client was struggling with a high cart abandonment rate and poor mobile experience, leading to lower-than-expected online sales. Their existing website was outdated, slow, and not optimized for mobile devices.",
    solution: "We implemented a complete redesign with a mobile-first approach, focusing on streamlined checkout processes and intuitive navigation. The new design included high-quality product imagery, detailed size guides, and integrated customer reviews.",
    results: [
      "42% decrease in cart abandonment rate",
      "67% increase in mobile conversions",
      "Average session duration increased by 2.5 minutes",
      "28% improvement in overall conversion rate"
    ],
    technologies: ["React", "Node.js", "Stripe API", "Algolia Search", "AWS"],
    testimonial: {
      quote: "The redesign completely transformed our online presence. We're seeing record-breaking sales and customer feedback has been overwhelmingly positive.",
      author: "Sarah Johnson",
      position: "Digital Marketing Director, Fashion Boutique"
    },
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1491897554428-130a60dd4757?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "p2": {
    id: "p2",
    title: "Mobile Banking App",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Mobile App",
    clientName: "FinTech Solutions",
    clientDescription: "A digital banking startup aiming to revolutionize personal finance management for millennials.",
    projectDuration: "5 months",
    completionDate: "November 2023",
    website: "https://example.com/fintech",
    description: "Intuitive mobile banking application with secure authentication and real-time transaction tracking.",
    tags: ["Fintech", "Mobile", "Security", "UX/UI", "API Integration"],
    featured: true,
    challenge: "The client needed a secure, user-friendly mobile banking application that would appeal to younger users while meeting strict financial regulations and security standards.",
    solution: "We developed a mobile banking app with biometric authentication, real-time transaction notifications, and intuitive expense categorization. The app included personalized financial insights, goal setting features, and seamless integration with multiple banking systems.",
    results: [
      "100,000+ downloads in the first month",
      "4.8/5 average rating on app stores",
      "92% user retention rate after 30 days",
      "Featured in 'Best New Finance Apps' by Apple App Store"
    ],
    technologies: ["React Native", "Firebase", "Plaid API", "JWT Authentication", "GraphQL"],
    testimonial: {
      quote: "The team delivered a product that exceeded our expectations. Our users love the intuitive design and robust security features.",
      author: "Michael Chen",
      position: "CTO, FinTech Solutions"
    },
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1564417510515-b3d20c821653?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1565373987291-4d7424dd9e59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "p3": {
    id: "p3",
    title: "Content Management System",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Development",
    clientName: "Publishing House",
    clientDescription: "A major publishing company with multiple digital publications needing a centralized content management solution.",
    projectDuration: "4 months",
    completionDate: "August 2023",
    website: "https://example.com/publishing",
    description: "Custom CMS solution for a publishing company to streamline their content workflow and distribution.",
    tags: ["CMS", "Backend", "API", "Content Delivery", "Workflow Automation"],
    featured: false,
    challenge: "The client was using multiple disparate systems to manage content across their various publications, resulting in inefficiencies, inconsistencies, and publishing delays.",
    solution: "We built a custom CMS that centralized content creation, editing, approval, and publishing workflows. The system included role-based access control, content versioning, scheduled publishing, and multi-platform distribution capabilities.",
    results: [
      "Publishing time reduced by 60%",
      "Editorial workflow efficiency improved by 45%",
      "50% reduction in content-related errors",
      "Integrated distribution to 8 different digital platforms"
    ],
    technologies: ["Django", "PostgreSQL", "Redis", "AWS S3", "Elasticsearch"],
    testimonial: {
      quote: "The custom CMS has transformed our editorial operations. What used to take days now happens in hours, with fewer errors and better content quality.",
      author: "Emily Rodriguez",
      position: "Head of Digital Content, Publishing House"
    },
    images: [
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "p4": {
    id: "p4",
    title: "Restaurant Ordering System",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Application",
    clientName: "Gourmet Dining Chain",
    clientDescription: "A multi-location restaurant chain seeking to modernize their ordering and kitchen management systems.",
    projectDuration: "6 months",
    completionDate: "January 2024",
    website: "https://example.com/restaurant",
    description: "End-to-end solution for restaurant orders, kitchen management, and customer engagement.",
    tags: ["Food Service", "Real-time", "Integration", "POS", "Customer Management"],
    featured: false,
    challenge: "The client was struggling with order accuracy, kitchen delays, and limited customer engagement capabilities across their 12 restaurant locations.",
    solution: "We developed an integrated system that included digital menus, tableside ordering, kitchen display systems, inventory management, and a customer loyalty program. The solution worked both online and offline to ensure reliability.",
    results: [
      "Order processing time decreased by 35%",
      "Food wastage reduced by 28%",
      "Customer wait time improved by 42%",
      "15% increase in repeat customer visits"
    ],
    technologies: ["Vue.js", "Express", "Socket.IO", "MongoDB", "Electron"],
    testimonial: {
      quote: "The new system has revolutionized our operations. Our staff can focus more on hospitality rather than juggling orders, and our customers appreciate the improved experience.",
      author: "Thomas Wright",
      position: "Operations Director, Gourmet Dining Chain"
    },
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "p5": {
    id: "p5",
    title: "Healthcare Patient Portal",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Application",
    clientName: "Medical Center",
    clientDescription: "A large healthcare provider looking to improve patient engagement and streamline administrative processes.",
    projectDuration: "7 months",
    completionDate: "October 2023",
    website: "https://example.com/healthcare",
    description: "Secure patient portal for appointment scheduling, medical records access, and doctor communication.",
    tags: ["Healthcare", "Security", "User Experience", "HIPAA Compliance", "Telemedicine"],
    featured: true,
    challenge: "The client needed to modernize patient interaction while maintaining strict HIPAA compliance and security protocols. They also wanted to reduce administrative overhead and improve patient satisfaction.",
    solution: "We created a secure patient portal that allowed for appointment scheduling, medical record access, secure messaging with healthcare providers, prescription refill requests, and telemedicine consultations. The system integrated with their existing EHR system.",
    results: [
      "30% reduction in missed appointments",
      "Administrative calls decreased by 45%",
      "Patient satisfaction scores improved by 36%",
      "90% of patients activated their portal accounts"
    ],
    technologies: ["Angular", "ASP.NET Core", "SQL Server", "Azure", "WebRTC"],
    testimonial: {
      quote: "This portal has transformed how we interact with patients. The secure messaging and telemedicine features have been especially valuable during the pandemic.",
      author: "Dr. Amanda Collins",
      position: "Chief Medical Officer, Medical Center"
    },
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "p6": {
    id: "p6",
    title: "Fitness Tracking Application",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Mobile App",
    clientName: "Wellness Company",
    clientDescription: "A fitness brand expanding into the digital space with a comprehensive wellness tracking solution.",
    projectDuration: "5 months",
    completionDate: "June 2023",
    website: "https://example.com/fitness",
    description: "Mobile application for tracking workouts, nutrition, and progress with personalized recommendations.",
    tags: ["Health", "Mobile", "Data Visualization", "Wearable Integration", "AI"],
    featured: false,
    challenge: "The client wanted to create a fitness app that would stand out in a crowded market by offering more personalized recommendations and better integration with multiple wearable devices.",
    solution: "We developed a mobile application that tracks workouts, nutrition, sleep, and other wellness metrics. The app included AI-driven personalized recommendations, social features for community engagement, and integration with popular fitness wearables.",
    results: [
      "250,000+ downloads within first quarter",
      "Average user engagement of 22 minutes per day",
      "85% of users connected at least one wearable device",
      "Featured in 'Best Health & Fitness Apps' lists"
    ],
    technologies: ["Flutter", "TensorFlow", "Firebase", "Google Fit API", "Apple HealthKit"],
    testimonial: {
      quote: "The team delivered an exceptional product that truly understands what fitness enthusiasts need. The personalized recommendations have received outstanding feedback from our users.",
      author: "Jessica Lawson",
      position: "Product Director, Wellness Company"
    },
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ]
  }
};

export default function PortfolioDetail() {
  const { id } = useParams();
  const portfolio = portfolioDetails[id];

  if (!portfolio) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn't find the case study you're looking for.
          </p>
          <Link href="/portfolio">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/portfolio">
          <Button variant="outline" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="relative">
            <img 
              src={portfolio.image} 
              alt={portfolio.title} 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="text-xs font-semibold text-primary-400 mb-2">
                {portfolio.category}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{portfolio.title}</h1>
              <p className="text-white text-opacity-80">{portfolio.clientName}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-y-4 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
              <div className="w-1/2 md:w-1/4 flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Client</span>
                <span className="font-medium">{portfolio.clientName}</span>
              </div>
              <div className="w-1/2 md:w-1/4 flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Duration</span>
                <span className="font-medium">{portfolio.projectDuration}</span>
              </div>
              <div className="w-1/2 md:w-1/4 flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Completed</span>
                <span className="font-medium">{portfolio.completionDate}</span>
              </div>
              <div className="w-1/2 md:w-1/4 flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Website</span>
                <a 
                  href={portfolio.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 dark:text-primary-400 flex items-center"
                >
                  Visit Site
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {portfolio.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {portfolio.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">The Challenge</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {portfolio.challenge}
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Our Solution</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {portfolio.solution}
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <ul className="list-disc list-inside space-y-2">
                {portfolio.results.map((result, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{result}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {portfolio.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolio.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${portfolio.title} screenshot ${index + 1}`} 
                    className="rounded-lg h-48 w-full object-cover"
                  />
                ))}
              </div>
            </div>
            
            {portfolio.testimonial && (
              <div className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <h2 className="text-xl font-semibold mb-4">Client Testimonial</h2>
                <blockquote className="italic text-gray-700 dark:text-gray-300 mb-4">
                  "{portfolio.testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300">
                    {portfolio.testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">{portfolio.testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{portfolio.testimonial.position}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" asChild>
                <Link href="/portfolio">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Portfolio
                </Link>
              </Button>
              
              <Button variant="outline" className="ml-auto">
                <Share className="mr-2 h-4 w-4" />
                Share Case Study
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}