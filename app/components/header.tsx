// // "use client"

// // import { useState } from "react";
// // import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import { Button } from "./ui/button";
// // import { Input } from "./ui/input";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "./ui/dropdown-menu";
// // import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
// // import { Badge } from "./ui/badge";
// // import {
// //   Search,
// //   Menu,
// //   Calendar,
// //   Bed,
// //   Map,
// //   Mountain,
// //   Church,
// //   Camera,
// //   TreePine,
// //   Car,
// //   DollarSign,
// // } from "lucide-react";

// // export default function Header() {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [currency, setCurrency] = useState<"USD" | "ETB">("USD");
// //   const router = useRouter();

// //   const handleSearch = (e?: React.FormEvent) => {
// //     if (e) e.preventDefault();
// //     // Navigate to search page with query parameter
// //     const searchParams = new URLSearchParams();
// //     if (searchQuery) {
// //       searchParams.set("q", searchQuery);
// //     }
// //     router.push(`/search?${searchParams.toString()}`);
// //   };

// //   const navigationItems = [
// //     {
// //       title: "Places to Go",
// //       items: [
// //         {
// //           name: "Historic Sites",
// //           href: "/places/historic",
// //           icon: Church,
// //           description: "Ancient churches and monuments",
// //         },
// //         {
// //           name: "National Parks",
// //           href: "/places/parks",
// //           icon: TreePine,
// //           description: "Protected natural areas",
// //         },
// //         {
// //           name: "Lake Tana",
// //           href: "/places/lake-tana",
// //           icon: Mountain,
// //           description: "Source of the Blue Nile",
// //         },
// //         {
// //           name: "Simien Mountains",
// //           href: "/places/simien",
// //           icon: Mountain,
// //           description: "UNESCO World Heritage Site",
// //         },
// //         {
// //           name: "Lalibela",
// //           href: "/places/lalibela",
// //           icon: Church,
// //           description: "Rock-hewn churches",
// //         },
// //         {
// //           name: "Gondar",
// //           href: "/places/gondar",
// //           icon: Church,
// //           description: "Camelot of Africa",
// //         },
// //         {
// //           name: "Blue Nile Falls",
// //           href: "/places/blue-nile-falls",
// //           icon: Mountain,
// //           description: "Spectacular waterfalls",
// //         },
// //       ],
// //     },
// //     {
// //       title: "Things to Do",
// //       items: [
// //         {
// //           name: "Cultural Experiences",
// //           href: "/things/culture",
// //           icon: Camera,
// //           description: "Traditional festivals and customs",
// //         },
// //         {
// //           name: "Adventure & Hiking",
// //           href: "/things/adventure",
// //           icon: Mountain,
// //           description: "Trekking and outdoor activities",
// //         },
// //         {
// //           name: "Wildlife Watching",
// //           href: "/things/wildlife",
// //           icon: Camera,
// //           description: "Endemic species and birds",
// //         },
// //         {
// //           name: "Photography Tours",
// //           href: "/things/photography",
// //           icon: Camera,
// //           description: "Capture stunning landscapes",
// //         },
// //         {
// //           name: "Boat Trips",
// //           href: "/things/boat-trips",
// //           icon: Car,
// //           description: "Lake Tana monasteries",
// //         },
// //         {
// //           name: "Coffee Culture",
// //           href: "/things/coffee",
// //           icon: TreePine,
// //           description: "Birthplace of coffee",
// //         },
// //       ],
// //     },
// //  {
// //       title: "Accommodation",
// //       items: [
// //         {
// //           name: "Hotels & Lodges",
// //           href: "/accommodation/hotels-lodges",
// //           icon: Bed,
// //           description: "Comfortable stays",
// //         },
// //         {
// //           name: "Eco Lodges",
// //           href: "/accommodation/eco-lodges",
// //           icon: TreePine,
// //           description: "Sustainable accommodations",
// //         },
// //         {
// //           name: "Mountain Lodges",
// //           href: "/accommodation/mountain-lodges",
// //           icon: Mountain,
// //           description: "High altitude stays",
// //         },
// //         {
// //           name: "Lake Resorts",
// //           href: "/accommodation/lake-resorts",
// //           icon: Mountain,
// //           description: "Waterfront properties",
// //         },
// //         {
// //           name: "Budget Options",
// //           href: "/accommodation/budget-options",
// //           icon: Bed,
// //           description: "Affordable stays",
// //         },
// //         {
// //           name: "Luxury Hotels",
// //           href: "/accommodation/luxury-hotels",
// //           icon: Bed,
// //           description: "Premium experiences",
// //         },
// //       ],
// //     },
// //     {
// //       title: "Travel & Planning",
// //       items: [
// //         {
// //           name: "Getting Here",
// //           href: "/travel/getting-here",
// //           icon: Car,
// //           description: "Transportation options",
// //         },
// //         {
// //           name: "Getting Around",
// //           href: "/travel/getting-around",
// //           icon: Car,
// //           description: "Local transportation",
// //         },
// //         {
// //           name: "Best Time to Visit",
// //           href: "/travel/when-to-visit",
// //           icon: Calendar,
// //           description: "Seasonal guide",
// //         },
// //         {
// //           name: "Travel Tips",
// //           href: "/travel/tips",
// //           icon: Map,
// //           description: "Essential information",
// //         },
// //         {
// //           name: "Itineraries",
// //           href: "/travel/itineraries",
// //           icon: Map,
// //           description: "Suggested routes",
// //         },
// //         {
// //           name: "Safety & Health",
// //           href: "/travel/safety",
// //           icon: Map,
// //           description: "Important guidelines",
// //         },
// //       ],
// //     },
// //   ];

// //   return (
// //     <header className="sticky top-0 z-50 w-full bg-white shadow-md">
// //       {/* Top bar with quick links */}
// //       <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm">
// //         <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
// //           <div className="flex items-center space-x-4">
// //             <span>✈️ Plan your Amhara adventure</span>
// //             <Badge variant="secondary" className="bg-white/20 text-white">
// //               Best time to visit: Oct-Mar
// //             </Badge>
// //           </div>
// //           <div className="hidden md:flex items-center space-x-4">
// //             <Link href="/contact" className="hover:underline">
// //               Contact
// //             </Link>
// //             <Link href="/help" className="hover:underline">
// //               Help
// //             </Link>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Main navigation */}
// //       <div className="max-w-7xl mx-auto px-4">
// //         <div className="flex items-center justify-between h-16">
// //           {/* Logo */}
// //           <Link href="/" className="flex items-center space-x-2">
// //             <Mountain className="h-8 w-8 text-emerald-600" />
// //             <div className="flex flex-col">
// //               <span className="text-xl font-bold text-gray-900">
// //                 Visit Amhara
// //               </span>
// //               <span className="text-xs text-gray-500">
// //                 Ethiopia&apos;s Historic Heart
// //               </span>
// //             </div>
// //           </Link>

// //           {/* Desktop Navigation */}
// //           <nav className="hidden lg:flex items-center space-x-8">
// //             <Link
// //               href="/search"
// //               className="text-gray-700 hover:text-emerald-600 font-medium"
// //             >
// //               Search
// //             </Link>
// //             {navigationItems.map((section) => (
// //               <DropdownMenu key={section.title}>
// //                 <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium">
// //                   <span>{section.title}</span>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent className="w-80 p-4">
// //                   <div className="grid grid-cols-1 gap-2">
// //                     {section.items.map((item) => (
// //                       <DropdownMenuItem key={item.name} asChild>
// //                         <Link
// //                           href={item.href}
// //                           className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
// //                         >
// //                           <item.icon className="h-5 w-5 text-emerald-600 mt-1" />
// //                           <div>
// //                             <div className="font-medium text-gray-900">
// //                               {item.name}
// //                             </div>
// //                             <div className="text-sm text-gray-500">
// //                               {item.description}
// //                             </div>
// //                           </div>
// //                         </Link>
// //                       </DropdownMenuItem>
// //                     ))}
// //                   </div>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             ))}
// //           </nav>

// //           {/* Search, Currency and Mobile Menu */}
// //           <div className="flex items-center space-x-4">
// //             {/* Currency Selector */}
// //             <div className="hidden md:block">
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     className="flex items-center space-x-1"
// //                   >
// //                     <DollarSign className="h-4 w-4" />
// //                     <span>{currency}</span>
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent>
// //                   <DropdownMenuItem
// //                     onClick={() => setCurrency("USD")}
// //                     className={currency === "USD" ? "bg-gray-100" : ""}
// //                   >
// //                     <div className="flex items-center space-x-2">
// //                       <span>💵</span>
// //                       <div>
// //                         <div className="font-medium">USD - US Dollar</div>
// //                         <div className="text-xs text-gray-500">
// //                           International currency
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </DropdownMenuItem>
// //                   <DropdownMenuItem
// //                     onClick={() => setCurrency("ETB")}
// //                     className={currency === "ETB" ? "bg-gray-100" : ""}
// //                   >
// //                     <div className="flex items-center space-x-2">
// //                       <span>🇪🇹</span>
// //                       <div>
// //                         <div className="font-medium">ETB - Ethiopian Birr</div>
// //                         <div className="text-xs text-gray-500">
// //                           Local currency (1 USD ≈ 55.5 ETB)
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </DropdownMenuItem>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>

// //             {/* Search */}
// //             <div className="hidden md:flex items-center space-x-2">
// //               <form
// //                 onSubmit={handleSearch}
// //                 className="flex items-center space-x-2"
// //               >
// //                 <div className="relative">
// //                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                   <Input
// //                     type="text"
// //                     placeholder="Search destinations, activities..."
// //                     value={searchQuery}
// //                     onChange={(e) => setSearchQuery(e.target.value)}
// //                     className="pl-10 w-64"
// //                   />
// //                 </div>
// //                 <Button
// //                   type="submit"
// //                   size="sm"
// //                   className="bg-emerald-600 hover:bg-emerald-700"
// //                 >
// //                   Search
// //                 </Button>
// //               </form>
// //             </div>

// //             {/* Mobile Menu */}
// //             <Sheet open={isOpen} onOpenChange={setIsOpen}>
// //               <SheetTrigger asChild className="lg:hidden">
// //                 <Button variant="outline" size="icon">
// //                   <Menu className="h-5 w-5" />
// //                 </Button>
// //               </SheetTrigger>
// //               <SheetContent className="w-80">
// //                 <div className="py-6">
// //                   {/* Mobile Search & Currency */}
// //                   <div className="mb-6 space-y-4">
// //                     {/* Mobile Currency Selector */}
// //                     <div>
// //                       <label className="text-sm font-medium text-gray-700 mb-2 block">
// //                         Currency
// //                       </label>
// //                       <div className="grid grid-cols-2 gap-2">
// //                         <Button
// //                           variant={currency === "USD" ? "default" : "outline"}
// //                           size="sm"
// //                           onClick={() => setCurrency("USD")}
// //                           className="flex items-center space-x-1"
// //                         >
// //                           <span>💵</span>
// //                           <span>USD</span>
// //                         </Button>
// //                         <Button
// //                           variant={currency === "ETB" ? "default" : "outline"}
// //                           size="sm"
// //                           onClick={() => setCurrency("ETB")}
// //                           className="flex items-center space-x-1"
// //                         >
// //                           <span>🇪🇹</span>
// //                           <span>ETB</span>
// //                         </Button>
// //                       </div>
// //                     </div>

// //                     {/* Mobile Search */}
// //                     <form onSubmit={handleSearch} className="space-y-3">
// //                       <div className="relative">
// //                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                         <Input
// //                           type="text"
// //                           placeholder="Search..."
// //                           value={searchQuery}
// //                           onChange={(e) => setSearchQuery(e.target.value)}
// //                           className="pl-10"
// //                         />
// //                       </div>
// //                       <Button
// //                         type="submit"
// //                         className="w-full bg-emerald-600 hover:bg-emerald-700"
// //                         onClick={() => setIsOpen(false)}
// //                       >
// //                         Search
// //                       </Button>
// //                     </form>
// //                   </div>

// //                   {/* Mobile Navigation */}
// //                   <nav className="space-y-6">
// //                     {navigationItems.map((section) => (
// //                       <div key={section.title}>
// //                         <h3 className="font-semibold text-gray-900 mb-3">
// //                           {section.title}
// //                         </h3>
// //                         <div className="space-y-2">
// //                           {section.items.map((item) => (
// //                             <Link
// //                               key={item.name}
// //                               href={item.href}
// //                               className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
// //                               onClick={() => setIsOpen(false)}
// //                             >
// //                               <item.icon className="h-4 w-4 text-emerald-600" />
// //                               <span className="text-gray-700">{item.name}</span>
// //                             </Link>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </nav>
// //                 </div>
// //               </SheetContent>
// //             </Sheet>
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }



// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
// import { Badge } from "./ui/badge";
// import {
//   Search,
//   Menu,
//   Calendar,
//   Bed,
//   Map,
//   Mountain,
//   Church,
//   Camera,
//   TreePine,
//   Car,
//   DollarSign,
//   LogIn,
// } from "lucide-react";

// export default function Header() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [currency, setCurrency] = useState<"USD" | "ETB">("USD");
//   const router = useRouter();

//   const handleSearch = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     const searchParams = new URLSearchParams();
//     if (searchQuery) {
//       searchParams.set("q", searchQuery);
//     }
//     router.push(`/search?${searchParams.toString()}`);
//   };

//   const navigationItems = [
//     {
//       title: "Places to Go",
//       items: [
//         {
//           name: "Historic Sites",
//           href: "/places/historic",
//           icon: Church,
//           description: "Ancient churches and monuments",
//         },
//         {
//           name: "National Parks",
//           href: "/places/parks",
//           icon: TreePine,
//           description: "Protected natural areas",
//         },
//         {
//           name: "Lake Tana",
//           href: "/places/lake-tana",
//           icon: Mountain,
//           description: "Source of the Blue Nile",
//         },
//         {
//           name: "Simien Mountains",
//           href: "/places/simien",
//           icon: Mountain,
//           description: "UNESCO World Heritage Site",
//         },
//         {
//           name: "Lalibela",
//           href: "/places/lalibela",
//           icon: Church,
//           description: "Rock-hewn churches",
//         },
//         {
//           name: "Gondar",
//           href: "/places/gondar",
//           icon: Church,
//           description: "Camelot of Africa",
//         },
//         {
//           name: "Blue Nile Falls",
//           href: "/places/blue-nile-falls",
//           icon: Mountain,
//           description: "Spectacular waterfalls",
//         },
//       ],
//     },
//     {
//       title: "Things to Do",
//       items: [
//         {
//           name: "Cultural Experiences",
//           href: "/things/culture",
//           icon: Camera,
//           description: "Traditional festivals and customs",
//         },
//         {
//           name: "Adventure & Hiking",
//           href: "/things/adventure",
//           icon: Mountain,
//           description: "Trekking and outdoor activities",
//         },
//         {
//           name: "Wildlife Watching",
//           href: "/things/wildlife",
//           icon: Camera,
//           description: "Endemic species and birds",
//         },
//         {
//           name: "Photography Tours",
//           href: "/things/photography",
//           icon: Camera,
//           description: "Capture stunning landscapes",
//         },
//         {
//           name: "Boat Trips",
//           href: "/things/boat-trips",
//           icon: Car,
//           description: "Lake Tana monasteries",
//         },
//         {
//           name: "Coffee Culture",
//           href: "/things/coffee",
//           icon: TreePine,
//           description: "Birthplace of coffee",
//         },
//       ],
//     },
//     {
//       title: "Accommodation",
//       items: [
//         {
//           name: "Hotels & Lodges",
//           href: "/accommodation/hotels-lodges",
//           icon: Bed,
//           description: "Comfortable stays",
//         },
//         {
//           name: "Eco Lodges",
//           href: "/accommodation/eco-lodges",
//           icon: TreePine,
//           description: "Sustainable accommodations",
//         },
//         {
//           name: "Mountain Lodges",
//           href: "/accommodation/mountain-lodges",
//           icon: Mountain,
//           description: "High altitude stays",
//         },
//         {
//           name: "Lake Resorts",
//           href: "/accommodation/lake-resorts",
//           icon: Mountain,
//           description: "Waterfront properties",
//         },
//         {
//           name: "Budget Options",
//           href: "/accommodation/budget-options",
//           icon: Bed,
//           description: "Affordable stays",
//         },
//         {
//           name: "Luxury Hotels",
//           href: "/accommodation/luxury-hotels",
//           icon: Bed,
//           description: "Premium experiences",
//         },
//       ],
//     },
//     {
//       title: "Travel & Planning",
//       items: [
//         {
//           name: "Getting Here",
//           href: "/travel/getting-here",
//           icon: Car,
//           description: "Transportation options",
//         },
//         {
//           name: "Getting Around",
//           href: "/travel/getting-around",
//           icon: Car,
//           description: "Local transportation",
//         },
//         {
//           name: "Best Time to Visit",
//           href: "/travel/when-to-visit",
//           icon: Calendar,
//           description: "Seasonal guide",
//         },
//         {
//           name: "Travel Tips",
//           href: "/travel/tips",
//           icon: Map,
//           description: "Essential information",
//         },
//         {
//           name: "Itineraries",
//           href: "/travel/itineraries",
//           icon: Map,
//           description: "Suggested routes",
//         },
//         {
//           name: "Safety & Health",
//           href: "/travel/safety",
//           icon: Map,
//           description: "Important guidelines",
//         },
//       ],
//     },
//   ];

//   return (
//     <header className="sticky top-0 z-50 w-full bg-white shadow-md">
//       <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm">
//         <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <span>✈️ Plan your Amhara adventure</span>
//             <Badge variant="secondary" className="bg-white/20 text-white">
//               Best time to visit: Oct-Mar
//             </Badge>
//           </div>
//           <div className="hidden md:flex items-center space-x-4">
//             <Link href="/contact" className="hover:underline">
//               Contact
//             </Link>
//             <Link href="/help" className="hover:underline">
//               Help
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <Link href="/" className="flex items-center space-x-2">
//             <Mountain className="h-8 w-8 text-emerald-600" />
//             <div className="flex flex-col">
//               <span className="text-xl font-bold text-gray-900">
//                 Visit Amhara
//               </span>
//               <span className="text-xs text-gray-500">
//                 Ethiopia&apos;s Historic Heart
//               </span>
//             </div>
//           </Link>

//           <nav className="hidden lg:flex items-center space-x-8">
//             <Link
//               href="/search"
//               className="text-gray-700 hover:text-emerald-600 font-medium"
//             >
//               Search
//             </Link>
//             {navigationItems.map((section) => (
//               <DropdownMenu key={section.title}>
//                 <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium">
//                   <span>{section.title}</span>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-80 p-4">
//                   <div className="grid grid-cols-1 gap-2">
//                     {section.items.map((item) => (
//                       <DropdownMenuItem key={item.name} asChild>
//                         <Link
//                           href={item.href}
//                           className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
//                         >
//                           <item.icon className="h-5 w-5 text-emerald-600 mt-1" />
//                           <div>
//                             <div className="font-medium text-gray-900">
//                               {item.name}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {item.description}
//                             </div>
//                           </div>
//                         </Link>
//                       </DropdownMenuItem>
//                     ))}
//                   </div>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ))}
//           </nav>

//           <div className="flex items-center space-x-4">
//             <div className="hidden md:block">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center space-x-1"
//                   >
//                     <DollarSign className="h-4 w-4" />
//                     <span>{currency}</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem
//                     onClick={() => setCurrency("USD")}
//                     className={currency === "USD" ? "bg-gray-100" : ""}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <span>💵</span>
//                       <div>
//                         <div className="font-medium">USD - US Dollar</div>
//                         <div className="text-xs text-gray-500">
//                           International currency
//                         </div>
//                       </div>
//                     </div>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     onClick={() => setCurrency("ETB")}
//                     className={currency === "ETB" ? "bg-gray-100" : ""}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <span>🇪🇹</span>
//                       <div>
//                         <div className="font-medium">ETB - Ethiopian Birr</div>
//                         <div className="text-xs text-gray-500">
//                           Local currency (1 USD ≈ 55.5 ETB)
//                         </div>
//                       </div>
//                     </div>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <div className="hidden md:flex items-center space-x-2">
//               <form
//                 onSubmit={handleSearch}
//                 className="flex items-center space-x-2"
//               >
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <Input
//                     type="text"
//                     placeholder="Search destinations, activities..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 w-64"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   size="sm"
//                   className="bg-emerald-600 hover:bg-emerald-700"
//                 >
//                   Search
//                 </Button>
//               </form>
//             </div>

//             <div className="hidden md:flex items-center">
//               <Link href="/login">
//                 <Button variant="outline" size="sm" className="flex items-center ">
//                   <LogIn className="h-4 w-4" />
//                   <span>Login</span>
//                 </Button>
//               </Link>
//               {/* <Link href="/register">
//                 <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
//                   Sign Up
//                 </Button>
//               </Link> */}
//             </div>

//             <Sheet open={isOpen} onOpenChange={setIsOpen}>
//               <SheetTrigger asChild className="lg:hidden">
//                 <Button variant="outline" size="icon">
//                   <Menu className="h-5 w-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent className="w-80">
//                 <div className="py-6">
//                   <div className="mb-6 space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700 mb-2 block">
//                         Currency
//                       </label>
//                       <div className="grid grid-cols-2 gap-2">
//                         <Button
//                           variant={currency === "USD" ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setCurrency("USD")}
//                           className="flex items-center space-x-1"
//                         >
//                           <span>💵</span>
//                           <span>USD</span>
//                         </Button>
//                         <Button
//                           variant={currency === "ETB" ? "default" : "outline"}
//                           size="sm"
//                           onClick={() => setCurrency("ETB")}
//                           className="flex items-center space-x-1"
//                         >
//                           <span>🇪🇹</span>
//                           <span>ETB</span>
//                         </Button>
//                       </div>
//                     </div>

//                     <form onSubmit={handleSearch} className="space-y-3">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                         <Input
//                           type="text"
//                           placeholder="Search..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           className="pl-10"
//                         />
//                       </div>
//                       <Button
//                         type="submit"
//                         className="w-full bg-emerald-600 hover:bg-emerald-700"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         Search
//                       </Button>
//                     </form>

//                     <div className="">
//                       <Link href="/login" onClick={() => setIsOpen(false)}>
//                         <Button
//                           variant="outline"
//                           className="w-full flex items-center justify-center space-x-1"
//                         >
//                           <LogIn className="h-4 w-4" />
//                           <span>Login</span>
//                         </Button>
//                       </Link>
//                       {/* <Link href="/register" onClick={() => setIsOpen(false)}>
//                         <Button
//                           className="w-full bg-emerald-600 hover:bg-emerald-700"
//                         >
//                           Sign Up
//                         </Button>
//                       </Link> */}
//                     </div>
//                   </div>

//                   <nav className="space-y-6">
//                     {navigationItems.map((section) => (
//                       <div key={section.title}>
//                         <h3 className="font-semibold text-gray-900 mb-3">
//                           {section.title}
//                         </h3>
//                         <div className="space-y-2">
//                           {section.items.map((item) => (
//                             <Link
//                               key={item.name}
//                               href={item.href}
//                               className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
//                               onClick={() => setIsOpen(false)}
//                             >
//                               <item.icon className="h-4 w-4 text-emerald-600" />
//                               <span className="text-gray-700">{item.name}</span>
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </nav>
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import {
  Search,
  Menu,
  Calendar,
  Bed,
  Map,
  Mountain,
  Church,
  Camera,
  TreePine,
  Car,
  DollarSign,
  LogIn,
} from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "ETB">("USD");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const searchParams = new URLSearchParams();
    if (searchQuery) {
      searchParams.set("q", searchQuery);
    }
    router.push(`/search?${searchParams.toString()}`);
  };

  const navigationItems = [
    {
      title: "Places to Go",
      items: [
        {
          name: "Historic Sites",
          href: "/places/historic",
          icon: Church,
          description: "Ancient churches and monuments",
        },
        {
          name: "National Parks",
          href: "/places/parks",
          icon: TreePine,
          description: "Protected natural areas",
        },
        {
          name: "Lake Tana",
          href: "/places/lake-tana",
          icon: Mountain,
          description: "Source of the Blue Nile",
        },
        {
          name: "Simien Mountains",
          href: "/places/simien",
          icon: Mountain,
          description: "UNESCO World Heritage Site",
        },
        {
          name: "Lalibela",
          href: "/places/lalibela",
          icon: Church,
          description: "Rock-hewn churches",
        },
        {
          name: "Gondar",
          href: "/places/gondar",
          icon: Church,
          description: "Camelot of Africa",
        },
        {
          name: "Blue Nile Falls",
          href: "/places/blue-nile-falls",
          icon: Mountain,
          description: "Spectacular waterfalls",
        },
      ],
    },
    {
      title: "Things to Do",
      items: [
        {
          name: "Cultural Experiences",
          href: "/things/culture",
          icon: Camera,
          description: "Traditional festivals and customs",
        },
        {
          name: "Adventure & Hiking",
          href: "/things/adventure",
          icon: Mountain,
          description: "Trekking and outdoor activities",
        },
        {
          name: "Wildlife Watching",
          href: "/things/wildlife",
          icon: Camera,
          description: "Endemic species and birds",
        },
        {
          name: "Photography Tours",
          href: "/things/photography",
          icon: Camera,
          description: "Capture stunning landscapes",
        },
        {
          name: "Boat Trips",
          href: "/things/boat-trips",
          icon: Car,
          description: "Lake Tana monasteries",
        },
        {
          name: "Coffee Culture",
          href: "/things/coffee",
          icon: TreePine,
          description: "Birthplace of coffee",
        },
      ],
    },
    {
      title: "Accommodation",
      items: [
        {
          name: "Hotels & Lodges",
          href: "/accommodation/hotels-lodges",
          icon: Bed,
          description: "Comfortable stays",
        },
        {
          name: "Eco Lodges",
          href: "/accommodation/eco-lodges",
          icon: TreePine,
          description: "Sustainable accommodations",
        },
        {
          name: "Mountain Lodges",
          href: "/accommodation/mountain-lodges",
          icon: Mountain,
          description: "High altitude stays",
        },
        {
          name: "Lake Resorts",
          href: "/accommodation/lake-resorts",
          icon: Mountain,
          description: "Waterfront properties",
        },
        {
          name: "Budget Options",
          href: "/accommodation/budget-options",
          icon: Bed,
          description: "Affordable stays",
        },
        {
          name: "Luxury Hotels",
          href: "/accommodation/luxury-hotels",
          icon: Bed,
          description: "Premium experiences",
        },
      ],
    },
    {
      title: "Travel & Planning",
      items: [
        {
          name: "Getting Here",
          href: "/travel/getting-here",
          icon: Car,
          description: "Transportation options",
        },
        {
          name: "Getting Around",
          href: "/travel/getting-around",
          icon: Car,
          description: "Local transportation",
        },
        {
          name: "Best Time to Visit",
          href: "/travel/when-to-visit",
          icon: Calendar,
          description: "Seasonal guide",
        },
        {
          name: "Travel Tips",
          href: "/travel/tips",
          icon: Map,
          description: "Essential information",
        },
        {
          name: "Itineraries",
          href: "/travel/itineraries",
          icon: Map,
          description: "Suggested routes",
        },
        {
          name: "Safety & Health",
          href: "/travel/safety",
          icon: Map,
          description: "Important guidelines",
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>✈️ Plan your Amhara adventure</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Best time to visit: Oct-Mar
            </Badge>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Visit Amhara
              </span>
              <span className="text-[10px] text-gray-500">
                Ethiopia&apos;s Historic Heart
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-gray-700 hover:text-emerald-600 font-medium text-sm ml-10"
            >
              Search
            </Link>
            {navigationItems.map((section) => (
              <DropdownMenu key={section.title}>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 font-medium text-sm">
                  <span>{section.title}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-4">
                  <div className="grid grid-cols-1 gap-2">
                    {section.items.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          href={item.href}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                        >
                          <item.icon className="h-5 w-5 text-emerald-600 mt-1" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 text-sm"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>{currency}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setCurrency("USD")}
                    className={currency === "USD" ? "bg-gray-100" : ""}
                  >
                    <div className="flex items-center space-x-2">
                      <span>💵</span>
                      <div>
                        <div className="font-medium text-sm">USD - US Dollar</div>
                        <div className="text-xs text-gray-500">
                          International currency
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCurrency("ETB")}
                    className={currency === "ETB" ? "bg-gray-100" : ""}
                  >
                    <div className="flex items-center space-x-2">
                      <span>🇪🇹</span>
                      <div>
                        <div className="font-medium text-sm">ETB - Ethiopian Birr</div>
                        <div className="text-xs text-gray-500">
                          Local currency (1 USD ≈ 55.5 ETB)
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search destinations, activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-56 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-sm"
                >
                  Search
                </Button>
              </form>
            </div>

            <div className="hidden md:flex items-center">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
                <div className="py-6">
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Currency
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={currency === "USD" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrency("USD")}
                          className="flex items-center space-x-1 text-sm"
                        >
                          <span>💵</span>
                          <span>USD</span>
                        </Button>
                        <Button
                          variant={currency === "ETB" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrency("ETB")}
                          className="flex items-center space-x-1 text-sm"
                        >
                          <span>🇪🇹</span>
                          <span>ETB</span>
                        </Button>
                      </div>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 text-sm"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        Search
                      </Button>
                    </form>

                    <div>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center space-x-1 text-sm"
                        >
                          <LogIn className="h-4 w-4" />
                          <span>Login</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <nav className="space-y-6">
                    {navigationItems.map((section) => (
                      <div key={section.title}>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                          {section.title}
                        </h3>
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 text-sm"
                              onClick={() => setIsOpen(false)}
                            >
                              <item.icon className="h-4 w-4 text-emerald-600" />
                              <span className="text-gray-700">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}