import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, Briefcase, ArrowRight } from "lucide-react";

// Sample portfolio data
const samplePortfolios = [
  {
    id: "p1",
    title: "E-commerce Website Redesign",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Design",
    clientName: "Fashion Boutique",
    description: "Complete redesign of an e-commerce platform, focusing on improved user experience and conversion rate optimization.",
    tags: ["E-commerce", "UX Design", "Frontend"],
    featured: true
  },
  {
    id: "p2",
    title: "Mobile Banking App",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Mobile App",
    clientName: "FinTech Solutions",
    description: "Intuitive mobile banking application with secure authentication and real-time transaction tracking.",
    tags: ["Fintech", "Mobile", "Security"],
    featured: true
  },
  {
    id: "p3",
    title: "Content Management System",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Development",
    clientName: "Publishing House",
    description: "Custom CMS solution for a publishing company to streamline their content workflow and distribution.",
    tags: ["CMS", "Backend", "API"],
    featured: false
  },
  {
    id: "p4",
    title: "Restaurant Ordering System",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Application",
    clientName: "Gourmet Dining Chain",
    description: "End-to-end solution for restaurant orders, kitchen management, and customer engagement.",
    tags: ["Food Service", "Real-time", "Integration"],
    featured: false
  },
  {
    id: "p5",
    title: "Healthcare Patient Portal",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Web Application",
    clientName: "Medical Center",
    description: "Secure patient portal for appointment scheduling, medical records access, and doctor communication.",
    tags: ["Healthcare", "Security", "User Experience"],
    featured: true
  },
  {
    id: "p6",
    title: "Fitness Tracking Application",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    category: "Mobile App",
    clientName: "Wellness Company",
    description: "Mobile application for tracking workouts, nutrition, and progress with personalized recommendations.",
    tags: ["Health", "Mobile", "Data Visualization"],
    featured: false
  }
];

// Categories for filtering
const categories = [
  "All",
  "Web Design",
  "Mobile App",
  "Web Application",
  "Web Development"
];

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPortfolios, setFilteredPortfolios] = useState(samplePortfolios);
  const [activeTab, setActiveTab] = useState("all");

  // Filter portfolios based on search term and category
  useEffect(() => {
    let filtered = samplePortfolios;
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(portfolio => portfolio.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(portfolio => 
        portfolio.title.toLowerCase().includes(term) ||
        portfolio.description.toLowerCase().includes(term) ||
        portfolio.clientName.toLowerCase().includes(term) ||
        portfolio.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by tab
    if (activeTab === "featured") {
      filtered = filtered.filter(portfolio => portfolio.featured);
    }
    
    setFilteredPortfolios(filtered);
  }, [searchTerm, selectedCategory, activeTab]);

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">Portfolio Case Studies</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search case studies by name, client, or technology..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button variant="outline" className="md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            <span>More Filters</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All Projects
            </TabsTrigger>
            <TabsTrigger value="featured">
              Featured
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all">
          {filteredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center">
                <Briefcase className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Case Studies Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  We couldn't find any case studies matching your current filters. Try adjusting your search terms or category selection.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setActiveTab("all");
                }}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="featured">
          {filteredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center">
                <Briefcase className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Featured Case Studies Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  We couldn't find any featured case studies matching your current filters. Try adjusting your search terms or category selection.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setActiveTab("featured");
                }}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PortfolioCard({ portfolio }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition duration-300">
      <div className="relative">
        <img 
          src={portfolio.image} 
          alt={portfolio.title} 
          className="w-full h-48 object-cover"
        />
        {portfolio.featured && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Featured
          </div>
        )}
        <div className="absolute top-3 left-3 bg-gray-900 bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-full">
          {portfolio.category}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{portfolio.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Client: {portfolio.clientName}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{portfolio.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {portfolio.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link href={`/portfolio/${portfolio.id}`}>
          <Button className="w-full flex items-center justify-center">
            View Case Study
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}