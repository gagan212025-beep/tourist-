import { Destination, Provider, MarketplaceProduct, CulturalEvent, BlockchainBlock, TouristReview, AnalyticsSnapshot, BookingRecord } from '../types';
import { computeBlockHash } from '../lib/cryptoUtils';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'netarhat',
    name: 'Netarhat',
    hindiName: 'नेतरहाट',
    tagline: 'Queen of Chotanagpur — Famous for mesmerizing Sunrise & Magnolia Sunset Point',
    category: 'eco',
    district: 'Latehar',
    coordinates: { lat: 23.4795, lng: 84.2694 },
    elevation: '1,071 m (3,514 ft)',
    bestTimeToVisit: 'October to March (Pleasant misty winters)',
    entryFee: 'Free (Eco-parks: ₹20-50)',
    timings: 'Open 24/7 (Sunset Point best between 4:30 PM - 6:30 PM)',
    description: 'Perched at over 3,500 feet atop the Chotanagpur Plateau, Netarhat is the crowned hill jewel of Jharkhand. Surrounded by dense chir pine and sal forests, rolling mist, and deep valleys, it offers the celebrated Magnolia Sunset Point named after an enigmatic colonial love legend, Upper Ghaghri Falls, Lower Ghaghri Falls, and pristine pear orchards.',
    highlights: [
      'Magnolia Sunset Point with breathtaking plateau drop-off',
      'Pine Forest walking trails & British-era colonial cottages',
      'Upper & Lower Ghaghri Waterfalls',
      'Netarhat Residential School legacy',
      'Cool micro-climate and starry dark skies'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'netarhat_sunset',
    transportInfo: {
      nearestAirport: 'Birsa Munda Airport Ranchi (156 km)',
      nearestRailway: 'Lohardaga Railway Station (85 km) or Ranchi Junction (156 km)',
      roadAccess: 'NH-43 & SH connectivity via Ranchi-Lohardaga-Gumla-Netarhat scenic ghat road',
      localTransportTips: 'Daily shared jeeps and tourism buses run from Ranchi Ratu Road bus stand. Private SUVs recommended for ghat climbs.'
    },
    ratings: { average: 4.8, count: 342 },
    ecoGuidelines: [
      'Zero Single-Use Plastic Zone in forest lookouts',
      'Do not play loud music near bird nesting pine grooves',
      'Support local Oraon & Asur tribal guides'
    ],
    culturalSignificance: 'Homeland to the ancient Asur tribe — one of India’s earliest iron-smelting indigenous communities, and Oraon villages with vibrant Karma dance traditions.'
  },
  {
    id: 'patratu-valley',
    name: 'Patratu Valley & Dam',
    hindiName: 'पतरातू घाटी एवं जलाशय',
    tagline: 'Winding scenic ghat road curves and sprawling lakeside eco-resort',
    category: 'adventure',
    district: 'Ramgarh',
    coordinates: { lat: 23.6341, lng: 85.2988 },
    elevation: '405 m (1,328 ft)',
    bestTimeToVisit: 'September to March',
    entryFee: 'Free (Boating & Lake Resort: ₹50-300)',
    timings: '6:00 AM – 7:00 PM',
    description: 'Famous for its serpentine hairpin road descending into a turquoise reservoir surrounded by lush green hills, Patratu is the photography and road-trip capital of Jharkhand. The Lake Resort offers speed boating, jet skiing, island dining, and sunset cruises.',
    highlights: [
      'Zig-zag scenic hairpin turns offering drone-worthy panoramic views',
      'Patratu Lake Resort with water sports and speed boats',
      'Night-lit highway viewpoints',
      'Island garden park inside the reservoir'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'patratu_valley',
    transportInfo: {
      nearestAirport: 'Birsa Munda Airport Ranchi (42 km)',
      nearestRailway: 'Patratu Railway Station (PTRU) or Ranchi Junction (35 km)',
      roadAccess: 'Smooth 4-lane expressway from Ranchi (approx 45 min drive)',
      localTransportTips: 'Taxis and auto-rickshaws readily available from Ranchi Kanke Road.'
    },
    ratings: { average: 4.7, count: 512 },
    ecoGuidelines: [
      'No littering along the ghat cliff sides',
      'Use life jackets during boating activities',
      'Drive within 40 km/h speed limit on mountain curves'
    ],
    culturalSignificance: 'Bridge point connecting Ranchi plateau to Coal and industrial belt, surrounded by traditional Santhal agricultural villages.'
  },
  {
    id: 'betla-national-park',
    name: 'Betla National Park & Palamau',
    hindiName: 'बेतला राष्ट्रीय उद्यान',
    tagline: 'Ancient 16th-century Chero dynasty forts hidden in tiger & elephant sal forest',
    category: 'eco',
    district: 'Latehar & Palamau',
    coordinates: { lat: 23.8824, lng: 84.1895 },
    elevation: '320 m',
    bestTimeToVisit: 'November to April (Safari season)',
    entryFee: '₹100 per person + Safari Gypsy ₹1200-1800',
    timings: '6:00 AM – 10:00 AM & 2:00 PM – 5:30 PM',
    description: 'Betla was one of the earliest nine tiger reserves declared under Project Tiger in 1973. Spread across dense sal and bamboo canopy along the Auranga river, it is home to wild elephants, leopards, sloth bears, gaurs (Indian bison), sambars, and the hauntingly majestic ruins of the 16th-century Chero dynasty Palamau Forts tucked deep in the jungle.',
    highlights: [
      'Morning Jungle Safari with certified tribal forest trackers',
      'Twin ancient Palamau Forts built by Raja Medini Ray in the 16th century',
      'Elephant & Indian Gaur (Bison) herds',
      'Tatapani Hot Geothermal Springs nearby'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'betla_safari',
    transportInfo: {
      nearestAirport: 'Ranchi Airport (170 km)',
      nearestRailway: 'Daltonganj / Medininagar (25 km)',
      roadAccess: 'Well-connected via NH-39 from Ranchi and Medininagar',
      localTransportTips: 'Forest department registered gypsy safaris can be booked at the Betla gate.'
    },
    ratings: { average: 4.6, count: 280 },
    ecoGuidelines: [
      'Strict silence during safari tracking',
      'No off-roading or littering in wildlife corridors',
      'Avoid bright colored clothing; wear earthy greens/khaki'
    ],
    culturalSignificance: 'The Chero kings fought Mughal expansion from these jungle fortresses; the indigenous Baiga and Oraon communities possess generational herbal folklore.'
  },
  {
    id: 'hundru-falls',
    name: 'Hundru Falls',
    hindiName: 'हुंडरू जलप्रपात',
    tagline: 'Subarnarekha River cascading 320 feet across sculpted rock canyons',
    category: 'waterfalls',
    district: 'Ranchi',
    coordinates: { lat: 23.4477, lng: 85.6547 },
    elevation: '655 m',
    bestTimeToVisit: 'July to February (Peak monsoon roaring flow)',
    entryFee: '₹20 per visitor',
    timings: '7:00 AM – 5:30 PM',
    description: 'Among Jharkhand’s most dramatic waterfalls, Hundru is formed by the Subarnarekha River plunging 98 meters (320 feet) down vertical granite cliffs. Below the falls, the river forms a natural pool surrounded by geological rock formations carved by millennia of water flow.',
    highlights: [
      '320 ft majestic plunge waterfall',
      'Natural rock pools and river-worn granite rockscapes',
      'Subarnarekha river hydro-electric station legacy',
      'Traditional snacks like Dhuska, Barra, and roasted forest corn stalls'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'hundru_falls',
    transportInfo: {
      nearestAirport: 'Ranchi Airport (48 km)',
      nearestRailway: 'Muri Junction (24 km) or Ranchi Junction (45 km)',
      roadAccess: 'Ranchi-Purulia highway route via Ormanjhi / Angara',
      localTransportTips: 'Private cabs and rental two-wheelers ideal from Ranchi.'
    },
    ratings: { average: 4.7, count: 420 },
    ecoGuidelines: [
      'Do not swim beyond designated safety zones during high water velocity',
      'Take all plastic packaging back with you',
      'Descend carefully along the 700+ paved steps'
    ],
    culturalSignificance: 'Regarded as a sacred river source by Munda and Kudmi communities who celebrate regional river rites during Tusu Parab.'
  },
  {
    id: 'baidyanath-dham-deoghar',
    name: 'Baba Baidyanath Dham (Deoghar)',
    hindiName: 'बाबा बैद्यनाथ धाम (देवघर)',
    tagline: 'One of the twelve sacred Shiva Jyotirlingas & world-famous Shravani Mela',
    category: 'spiritual',
    district: 'Deoghar',
    coordinates: { lat: 24.4923, lng: 86.7001 },
    elevation: '254 m',
    bestTimeToVisit: 'October to March (Or July-August during Shravan Mela)',
    entryFee: 'Free (Special Darshan pass available via Temple Trust)',
    timings: '4:00 AM – 9:00 PM (Temple closes briefly during Bhog 3:30-6:00 PM)',
    description: 'Baba Baidyanath Temple complex in Deoghar houses one of the 12 revered Shiva Jyotirlingas in India. Featuring 22 ornate stone temples tied together with red holy ribbons, it is also one of the 51 Shakti Peethas. During the month of Shravan, millions of saffron-clad Kanwariyas undertake an arduous 108 km barefoot trek from Sultanganj carrying holy Ganga water.',
    highlights: [
      'Main sanctum with sacred Kamana Lingam',
      'Panchshul gold trident atop the main shrine dome',
      'Nearby Naulakha Temple, Tapovan Caves, and Trikuta Parvat ropeway',
      'Famous Deoghar Peda (sweet milk delicacy)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'baidyanath_dham',
    transportInfo: {
      nearestAirport: 'Deoghar Airport (DGH) (6 km)',
      nearestRailway: 'Jasidih Junction (JSME) (7 km) - Major mainline rail hub',
      roadAccess: 'Excellent highways from Patna, Ranchi, Kolkata, and Bhagalpur',
      localTransportTips: 'E-rickshaws and auto-rickshaws connect Jasidih station directly to the temple complex.'
    },
    ratings: { average: 4.9, count: 890 },
    ecoGuidelines: [
      'Deposit floral offerings only in designated biodegradable compost bins',
      'Dress modestly according to traditional customs',
      'Follow queue management systems during high-traffic festivals'
    ],
    culturalSignificance: 'A cornerstone of Hindu pilgrimage since the Vedic era, symbolizing the synthesis of Shaivite and Shakta spiritual traditions.'
  },
  {
    id: 'parasnath-shikharji',
    name: 'Parasnath (Shri Sammed Shikharji)',
    hindiName: 'पारसनाथ (सम्मेद शिखरजी)',
    tagline: 'Highest peak of Jharkhand (1,365m) and supreme Jain pilgrimage tirtha',
    category: 'spiritual',
    district: 'Giridih',
    coordinates: { lat: 23.9628, lng: 86.1306 },
    elevation: '1,365 m (4,478 ft)',
    bestTimeToVisit: 'October to March (Crisp mountain trekking weather)',
    entryFee: 'Free (Doli/Palanquin services available at base for elderly)',
    timings: 'Trek begins 3:00 AM – 6:00 PM',
    description: 'Parasnath is the highest mountain summit in the state of Jharkhand. Known as Shri Sammed Shikharji, it is the most sacred pilgrimage for Jainism worldwide, where 20 of the 24 Tirthankaras attained Nirvana (moksha). The 27-km circumambulation trek ascends through dense forests and serene marble mountain shrines.',
    highlights: [
      'Highest summit peak of Jharkhand at 1,365 meters',
      'Ancient Tonks (shrines) dedicated to 20 Jain Tirthankaras',
      'Madhuvan base camp with historic dharamshalas and museums',
      'Panoramic 360° views across the Chotanagpur plateau'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'parasnath_shikharji',
    transportInfo: {
      nearestAirport: 'Kazi Nazrul Islam Airport Durgapur (130 km) or Ranchi (160 km)',
      nearestRailway: 'Parasnath Railway Station (PNME) (18 km from Madhuvan base)',
      roadAccess: 'Directly off Grand Trunk Road (NH-19 / NH-2)',
      localTransportTips: 'Taxis, shared jeeps, and electric carts run regularly from Parasnath station to Madhuvan.'
    },
    ratings: { average: 4.9, count: 640 },
    ecoGuidelines: [
      'Strict vegetarian and alcohol-free eco-sanctuary zone',
      'Carry refillable water flasks; zero littering on mountain trail',
      'Support local Doli-bearers from Santhal tribal villages'
    ],
    culturalSignificance: 'Sacred mountain revered across centuries by both Jain pilgrims and the indigenous Santhal people who revere the mountain as Marang Buru.'
  },
  {
    id: 'tribal-cultural-village-khunti',
    name: 'Tribal Cultural Heritage & Birsa Trail',
    hindiName: 'जनजातीय सांस्कृतिक धरोहर (खूंटी)',
    tagline: 'Living traditions of Munda & Santhal artisans, Sohrai art & Birsa Munda history',
    category: 'cultural',
    district: 'Khunti & Ranchi',
    coordinates: { lat: 23.0768, lng: 85.2789 },
    elevation: '610 m',
    bestTimeToVisit: 'All year round (Folk harvest festivals Oct-April)',
    entryFee: '₹50 (Workshop fees support local artisan collective)',
    timings: '9:00 AM – 6:00 PM',
    description: 'Khunti is the historic heartland of Bhagwan Birsa Munda’s legendary Ulgulan (tribal independence movement). Here, tourists experience authentic living tribal heritage: village homestays with mud walls adorned in UNESCO-recognized Sohrai-Khovar geometric murals, live Dokra bell-metal lost-wax casting workshops, bamboo basketry, and Munda folk music played on Mandar drums.',
    highlights: [
      'Ulihatu — birthplace of freedom fighter Bhagwan Birsa Munda',
      'Live Sohrai & Khovar mural art painting masterclasses with tribal women',
      'Dokra brass lost-wax smelting artisan clusters',
      'Authentic tribal cuisine: Marua roti, Chilka pitha, Rugra mushroom curry, and Bamboo shoot fry'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'khunti_heritage_village',
    transportInfo: {
      nearestAirport: 'Ranchi Airport (35 km)',
      nearestRailway: 'Hatia / Ranchi Junction (38 km)',
      roadAccess: 'Smooth highway via Ranchi-Khunti road (approx 50 mins)',
      localTransportTips: 'Guided cultural village tours with certified Munda guides available on Johar Jharkhand platform.'
    },
    ratings: { average: 4.8, count: 195 },
    ecoGuidelines: [
      'Respect village privacy and ask before photographing sacred Sarna sthal groves',
      'Fair-trade direct purchase from artisan self-help groups',
      'Leave no plastic in rural agricultural fields'
    ],
    culturalSignificance: 'Epicenter of Jharkhand’s indigenous identity, Sarna nature worship faith, and tribal self-governance traditions.'
  },
  {
    id: 'jonha-dassam-falls',
    name: 'Jonha & Dassam Waterfalls Circuit',
    hindiName: 'जोन्हा एवं दशम जलप्रपात',
    tagline: 'Terraced step falls on the sacred Kanchi river with Gautam Buddha shrine',
    category: 'waterfalls',
    district: 'Ranchi',
    coordinates: { lat: 23.3441, lng: 85.6083 },
    elevation: '580 m',
    bestTimeToVisit: 'August to March',
    entryFee: '₹20-30 per entry',
    timings: '8:00 AM – 5:00 PM',
    description: 'Forming a world-class waterfall circuit just outside Ranchi, Jonha (also called Gautamdhara after Lord Buddha who is believed to have bathed here) cascades gracefully over stepped terraces with a quiet monastery at the summit. Nearby Dassam Falls plunges 144 feet in 10 distinct streams from the Kanchi river into a natural rocky amphitheater.',
    highlights: [
      'Jonha 722-step scenic stairway descending through dense canopy',
      'Lord Buddha monastery and peaceful meditation pavilion',
      'Dassam Falls 144 ft thunderous cascade across rock fissures',
      'Lush picnic meadows by the riverbank'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: true,
    panoramaUrl: 'jonha_dassam_falls',
    transportInfo: {
      nearestAirport: 'Ranchi Airport (40 km)',
      nearestRailway: 'Jonha Railway Station (2 km) or Ranchi Junction (40 km)',
      roadAccess: 'Ranchi-Purulia Road (NH-320)',
      localTransportTips: 'Easily covered as a half-day or full-day cab excursion combined with Sita Falls.'
    },
    ratings: { average: 4.6, count: 310 },
    ecoGuidelines: [
      'Avoid bathing near slippery rock edges with fast undercurrents',
      'Dispose meal containers in designated trash cans only'
    ],
    culturalSignificance: 'Sacred pilgrimage bath site during Makar Sankranti where local Munda and Santhal communities gather for traditional fairs.'
  },
  {
    id: 'hazaribagh-national-park',
    name: 'Hazaribagh Sanctuary & Canary Hill',
    hindiName: 'हजारीबाग अभयारण्य एवं कैनरी हिल',
    tagline: 'Land of a Thousand Gardens, ancient prehistoric megaliths & rock art',
    category: 'heritage',
    district: 'Hazaribagh',
    coordinates: { lat: 24.0041, lng: 85.3572 },
    elevation: '610 m',
    bestTimeToVisit: 'October to April',
    entryFee: '₹50 per visitor',
    timings: '6:30 AM – 6:00 PM',
    description: 'Hazaribagh, meaning "City of a Thousand Gardens", is famed for its sal forests, scenic Canary Hill watchtower offering sunset views over three lakes, and the surrounding prehistoric rock art shelters of Isco and Punkree Barwadih megaliths dating back over 5,000 years to the Chalcolithic and Mesolithic eras.',
    highlights: [
      'Canary Hill observation tower and botanical lake park',
      'Isco Prehistoric Rock Art Caves with zoomorphic ochre petroglyphs',
      'Punkree Barwadih Solstice Megaliths observatory',
      'Tranquil forest rest houses and deer parks'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80'
    ],
    has360Panorama: false,
    transportInfo: {
      nearestAirport: 'Ranchi Airport (95 km)',
      nearestRailway: 'Hazaribagh Town (HZBN) or Koderma Junction (55 km)',
      roadAccess: 'Located right on NH-20 (Ranchi-Patna highway)',
      localTransportTips: 'Buses depart every 15 minutes between Ranchi Kantatoli and Hazaribagh.'
    },
    ratings: { average: 4.5, count: 215 },
    ecoGuidelines: [
      'Do not touch or carve graffiti on ancient prehistoric petroglyphs',
      'Preserve the natural stone alignment of megalithic heritage sites'
    ],
    culturalSignificance: 'Home to the indigenous Birhor, Santhal, and Ganju tribes who preserve Khovar bridal cave art traditions.'
  }
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-001',
    name: 'Somra Munda',
    role: 'guide',
    community: 'Munda Indigenous Community',
    location: 'Latehar & Betla National Park',
    district: 'Latehar',
    contactPhone: '+91 94311 88201',
    contactEmail: 'somra.munda.tour@jharkhand-tourism.in',
    experienceYears: 14,
    languages: ['Hindi', 'English', 'Mundari', 'Nagpuri'],
    rating: 4.95,
    reviewsCount: 168,
    bio: 'Government-certified master naturalist tracker born on the fringes of Palamau Tiger Reserve. Expert in elephant herd tracking, bird vocalizations, and 16th-century Chero dynasty oral history.',
    servicesOffered: [
      'Betla Wildlife & Tiger Track Safari',
      'Palamau Forts Historical Trek',
      'Latehar Waterfalls & Hidden Caves Expedition'
    ],
    pricing: '₹1,200 / half day (up to 6 guests)',
    verified: true,
    certificateHash: '0x8f2a6b1049c3098d57e2a9b1c70e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
    blockHeight: 104,
    issuedDate: '2025-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    documentsVerified: ['Aadhaar ID', 'Forest Dept License #JH-FOR-2024-88', 'First Aid Certificate']
  },
  {
    id: 'prov-002',
    name: 'Parvati Devi Sohrai Collective',
    role: 'artisan',
    community: 'Kurmi / Ganju Tribal Artisans',
    location: 'Hazaribagh Art Village',
    district: 'Hazaribagh',
    contactPhone: '+91 98350 44192',
    contactEmail: 'parvati.sohrai@crafts.jharkhand.gov.in',
    experienceYears: 22,
    languages: ['Hindi', 'Khortha', 'Basic English'],
    rating: 4.9,
    reviewsCount: 94,
    bio: 'State Award-winning Sohrai & Khovar master artist. Uses 100% natural earth pigments (red geru, black manganese, yellow dudhi, white kaolin) to preserve prehistoric mural iconography.',
    servicesOffered: [
      'Sohrai Painting Live Canvas Workshop',
      'Natural Earth Color Extraction Masterclass',
      'Authentic Framed Wall Art Commissions'
    ],
    pricing: '₹800 / person (Includes canvas & materials)',
    verified: true,
    certificateHash: '0x7e3c5a892b1049f7e6a4c2b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    blockHeight: 112,
    issuedDate: '2025-02-01',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    documentsVerified: ['State Craft Award #JH-ART-2023', 'Artisan Registration #ART-4421']
  },
  {
    id: 'prov-003',
    name: 'Mahua Forest Eco Homestay (Oraon Family)',
    role: 'homestay',
    community: 'Oraon Heritage Family',
    location: 'Near Magnolia Point, Netarhat',
    district: 'Latehar',
    contactPhone: '+91 97712 33810',
    contactEmail: 'mahua.homestay.netarhat@gmail.com',
    experienceYears: 6,
    languages: ['Hindi', 'Kurukh', 'English'],
    rating: 4.88,
    reviewsCount: 142,
    bio: 'Traditional mud-walled cottage with handcrafted tiled roofs surrounded by pear orchards and chir pine. Guests enjoy home-cooked tribal delicacies, open star-gazing courtyard, and evening folk flute sessions.',
    servicesOffered: [
      'Eco Deluxe Cottage Stay (Private Bathroom)',
      'Organic Farm-to-Table Traditional Dining',
      'Guided Dawn Walk to Magnolia Sunset Point'
    ],
    pricing: '₹2,200 / night (Includes breakfast & evening tea)',
    verified: true,
    certificateHash: '0x3a9b1c70e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    blockHeight: 118,
    issuedDate: '2025-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80',
    documentsVerified: ['Jharkhand Tourism Homestay Permit #HOM-2024-19', 'FSSAI Hygiene Certificate']
  },
  {
    id: 'prov-004',
    name: 'Budhan Karmakar Dokra Guild',
    role: 'artisan',
    community: 'Malhor / Karmakar Bell Metal Guild',
    location: 'Pundi Craft Village',
    district: 'Khunti',
    contactPhone: '+91 93341 99022',
    contactEmail: 'dokra.budhan@jharkhandcrafts.org',
    experienceYears: 30,
    languages: ['Hindi', 'Mundari'],
    rating: 4.92,
    reviewsCount: 88,
    bio: 'Preserving the 4,000-year-old ancient lost-wax casting technique (cire perdue). Specializes in handcrafted brass tribal musicians, elephants, peacocks, and ritual oil lamps.',
    servicesOffered: [
      'Dokra Metal Smelting Demonstration',
      'Custom Heritage Brass Sculpture Crafting',
      'Artisan Direct Wholesale & Retail'
    ],
    pricing: '₹600 / workshop session',
    verified: true,
    certificateHash: '0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    blockHeight: 125,
    issuedDate: '2025-02-18',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    documentsVerified: ['Ministry of Textiles Artisan Card #DOK-JH-9182', 'Aadhaar Verified']
  },
  {
    id: 'prov-005',
    name: 'Chotanagpur Green Trails & Taxis',
    role: 'transport',
    community: 'Eco-Driver Union Ranchi',
    location: 'Ranchi Main Station & Airport',
    district: 'Ranchi',
    contactPhone: '+91 94701 55219',
    contactEmail: 'greentrails.ranchi@gmail.com',
    experienceYears: 11,
    languages: ['Hindi', 'English', 'Bengali', 'Bhojpuri'],
    rating: 4.8,
    reviewsCount: 210,
    bio: 'Fleet of eco-inspected SUVs and clean hybrid cabs driven by hill-certified local drivers. Specialized in Ranchi-Netarhat-Betla-Patratu circuit travel.',
    servicesOffered: [
      'Airport / Railway Pickup & Drop',
      'Netarhat Sunset & Sunrise 2-Day Roundtrip',
      'Waterfalls Circuit Full Day Cab'
    ],
    pricing: '₹3,500 / day (All-inclusive fuel & toll)',
    verified: true,
    certificateHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    blockHeight: 130,
    issuedDate: '2025-02-22',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    documentsVerified: ['Commercial Transport Permit #JH-01-TAX-891', 'Driver Police Clearance']
  }
];

export const INITIAL_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod-001',
    name: 'Traditional Dokra Tribal Musician Ensemble',
    hindiName: 'डोकरा जनजातीय वादक समूह (पीतल)',
    category: 'dokra',
    price: 1850,
    artisanId: 'prov-004',
    artisanName: 'Budhan Karmakar Dokra Guild',
    village: 'Pundi, Khunti',
    description: 'Masterfully hand-cast lost-wax brass sculpture featuring three tribal musicians playing Mandar, Nagara, and Bansuri flute. Each piece is unique and cast in beeswax clay molds.',
    materials: 'Pure bell metal brass alloy, natural beeswax, alluvial clay mold',
    craftHeritage: 'UNESCO recognized non-ferrous casting tradition dating back to Mohenjo-daro Dancing Girl.',
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    dimensions: '18 cm x 12 cm x 8 cm',
    weight: '750 grams',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'prod-002',
    name: 'Sohrai Natural Earth Pigment Canvas (Peacock & Deer)',
    hindiName: 'सोहराई प्राकृतिक भित्ति चित्र (मोर एवं हिरण)',
    category: 'painting',
    price: 2400,
    artisanId: 'prov-002',
    artisanName: 'Parvati Devi Sohrai Collective',
    village: 'Hazaribagh Art Village',
    description: 'Authentic Sohrai harvest mural painting on handmade archival cotton canvas. Painted with chewed neem-twig brushes and natural forest clay pigments.',
    materials: 'Black manganese, red iron-oxide geru, white kaolin clay, neem twig brush, handmade canvas',
    craftHeritage: 'GI-tagged indigenous tribal ritual art celebrated during harvest and cattle thanksgiving.',
    stock: 9,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    dimensions: '45 cm x 30 cm (Framed ready to hang)',
    weight: '900 grams',
    rating: 5.0,
    reviewsCount: 45
  },
  {
    id: 'prod-003',
    name: 'Kuchai Organic Tussar Silk Stole / Shawl',
    hindiName: 'कुचाई जैविक तसर सिल्क शॉल',
    category: 'silk',
    price: 3200,
    artisanId: 'prov-002',
    artisanName: 'Seraikela Silk Weavers Cooperative',
    village: 'Kuchai, Seraikela-Kharsawan',
    description: 'Exquisite wild forest Tussar silk woven on traditional pit looms. Features distinctive natural golden sheen, breathable weave, and tribal geometric borders.',
    materials: '100% Certified Organic Kuchai Wild Tussar Silk (Ahimsa yarn)',
    craftHeritage: 'Organic silk harvested from Asan and Arjun trees in Jharkhand’s indigenous forests.',
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    dimensions: '200 cm x 70 cm',
    weight: '180 grams',
    rating: 4.85,
    reviewsCount: 52
  },
  {
    id: 'prod-004',
    name: 'Handcrafted Bamboo Tea Set & Serving Basket',
    hindiName: 'हस्तनिर्मित बांस चाय सेट एवं ट्रे',
    category: 'bamboo',
    price: 1100,
    artisanId: 'prov-001',
    artisanName: 'Latehar Bamboo Craft Society',
    village: 'Latehar Forest Border',
    description: 'Eco-friendly bamboo crafted cups, teapot flask, and woven serving tray treated with natural neem oil for water resistance and longevity.',
    materials: 'Treated hill bamboo, natural beeswax polish',
    craftHeritage: 'Sustainable tribal basketry transformed into modern zero-waste tableware.',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    dimensions: 'Tray 35 cm diameter',
    weight: '450 grams',
    rating: 4.75,
    reviewsCount: 29
  },
  {
    id: 'prod-005',
    name: 'Traditional Lac & Glass Beaded Tribal Bangles Set',
    hindiName: 'पारंपरिक लाख की चूड़ियाँ',
    category: 'lac',
    price: 750,
    artisanId: 'prov-004',
    artisanName: 'Ranchi Lac Crafts Federation',
    village: 'Namkum, Ranchi',
    description: 'Durable, vibrant natural lac bangles studded with golden foil and mirror work. Handcrafted from pure natural forest resin.',
    materials: 'Natural tree-extracted Lac resin, non-toxic mineral colors, glass accents',
    craftHeritage: 'Jharkhand produces over 60% of India’s natural lac resin.',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1611591475152-4783ec389e76?auto=format&fit=crop&w=600&q=80',
    dimensions: 'Sizes: 2.4, 2.6, 2.8',
    weight: '120 grams',
    rating: 4.8,
    reviewsCount: 64
  },
  {
    id: 'prod-006',
    name: 'Wild Multiflora Raw Forest Honey (Netarhat Valley)',
    hindiName: 'नेतरहाट शुद्ध जंगली शहद',
    category: 'organic',
    price: 650,
    artisanId: 'prov-003',
    artisanName: 'Netarhat Tribal Forest Foragers',
    village: 'Netarhat Plateau',
    description: 'Unprocessed, unfiltered raw wild honey collected by indigenous forest foragers from deep sal, mahua, and wild medicinal flower blooms.',
    materials: '100% Raw Wild Apis Dorsata Forest Honey',
    craftHeritage: 'Ethical sustainable honey hunting preserving wild bee hives.',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    dimensions: '500g Glass Jar',
    weight: '500 grams',
    rating: 4.95,
    reviewsCount: 81
  }
];

export const INITIAL_EVENTS: CulturalEvent[] = [
  {
    id: 'evt-001',
    title: 'Sarhul Nature Festival',
    hindiTitle: 'सरहुल प्रकृति महापर्व',
    dateOrSeason: 'March / April (Chaitra Shukla Tritiya)',
    location: 'Ranchi, Khunti, Gumla & Across Jharkhand',
    district: 'Statewide',
    category: 'festival',
    description: 'The most revered nature festival of Jharkhand celebrated by Oraon, Munda, and Santhal tribes when the Sal tree bursts into fragrant blossom. Pahan (priests) offer Sal flowers and prayers to Mother Nature and the sun god Singbonga.',
    significance: 'Celebrates ecological harmony, earth regeneration, and indigenous reverence for sacred Sal trees.',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Colorful traditional costumes with white-and-red border saris',
      'Synchronized group dance to Mandar and Dhol beats',
      'Distribution of sacred Sal blossom blossoms (Sarhul Phool)',
      'Grand Sarhul Shobhayatra parade through Ranchi city'
    ]
  },
  {
    id: 'evt-002',
    title: 'Karma Puja (Bhatkhanda)',
    hindiTitle: 'करमा पूजा',
    dateOrSeason: 'August / September (Bhadrapada Ekadashi)',
    location: 'Villages across Chotanagpur Plateau',
    district: 'Statewide',
    category: 'festival',
    description: 'Celebrates brotherhood, good harvest, and nature fertility through the sacred worship of the Karma tree (Nauclea parvifolia). Youths sing traditional Karma songs around planted branches throughout the night.',
    significance: 'Folklore of Karma and Dharma brothers symbolizing hard work, righteousness, and ecological balance.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Karma branch planting ceremony in the village Akhra (courtyard)',
      'Night-long traditional circle folk dances',
      'Special Javara sprouted cereal offerings',
      'Traditional rice beer (Handia) and pitha sweets'
    ]
  },
  {
    id: 'evt-003',
    title: 'Shravani Mela (Deoghar Pilgrimage)',
    hindiTitle: 'श्रावणी मेला (देवघर)',
    dateOrSeason: 'July – August (Entire Hindu month of Shravana)',
    location: 'Baba Baidyanath Dham, Deoghar',
    district: 'Deoghar',
    category: 'festival',
    description: 'One of the longest religious fairs in the world, stretching over a 108 km walking corridor where over 5 million pilgrims carry sacred Ganga water in Kanwars to offer at Baidyanath Jyotirlinga.',
    significance: 'Spiritual devotion, unity, and massive cultural congregation across Eastern India.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=80',
    highlights: [
      '108 km illuminated pedestrian Kanwar pilgrimage corridor',
      'Spiritual hymns and chanting of "Bol Bam"',
      'Free community kitchens (langars) and healthcare camps',
      'Deoghar cultural exhibitions and handicrafts bazaar'
    ]
  },
  {
    id: 'evt-004',
    title: 'Weekly Tribal Haat Bazaar (Weekly Rural Market)',
    hindiTitle: 'साप्ताहिक जनजातीय हाट बाज़ार',
    dateOrSeason: 'Every Wednesday & Saturday',
    location: 'Murhu & Khunti Rural Marketgrounds',
    district: 'Khunti',
    category: 'haat',
    description: 'Vibrant traditional weekly open-air market where local tribal villagers trade forest produce, wild mushrooms (Rugra), Mahua, bamboo wares, handmade jewelry, cattle, and enjoy street foods like Dhuska Barra.',
    significance: 'The living socio-economic heartbeat of rural Jharkhand.',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Direct purchase of organic forest produce and spices',
      'Fresh hot Dhuska with spicy Chana Ghugni',
      'Traditional black and silver tribal jewelry stalls',
      'Folk instruments and hand-woven baskets'
    ]
  }
];

// Initialize Blockchain Ledger with Genesis Block & Provider Certifications
const genesisTimestamp = '2025-01-01T00:00:00.000Z';
const genesisPayload = {
  entityId: 'SYSTEM-GENESIS',
  entityName: 'Jharkhand Tourism Development Corporation (JTDC)',
  action: 'GENESIS_BLOCK_INITIALIZED',
  details: 'Cryptographically secured immutable ledger for certified eco-guides, homestay licenses, artisan provenance, and tourist bookings.'
};
const genesisHash = computeBlockHash(0, genesisTimestamp, 'SYSTEM_GENESIS', genesisPayload, '0'.repeat(64), 0);

export const INITIAL_BLOCKCHAIN_BLOCKS: BlockchainBlock[] = [
  {
    index: 0,
    timestamp: genesisTimestamp,
    type: 'SYSTEM_GENESIS',
    payload: genesisPayload,
    previousHash: '0'.repeat(64),
    hash: genesisHash,
    nonce: 1042
  },
  {
    index: 1,
    timestamp: '2025-01-15T10:30:00.000Z',
    type: 'PROVIDER_CERTIFICATION',
    payload: {
      entityId: 'prov-001',
      entityName: 'Somra Munda',
      action: 'CERTIFIED_NATURALIST_GUIDE',
      details: 'Certified Master Guide for Betla National Park & Latehar Forests under JTDC Ecotourism Norms.',
      issuer: 'Jharkhand Forest & Tourism Department'
    },
    previousHash: genesisHash,
    hash: '0x8f2a6b1049c3098d57e2a9b1c70e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
    nonce: 2841
  },
  {
    index: 2,
    timestamp: '2025-02-01T14:15:00.000Z',
    type: 'PROVIDER_CERTIFICATION',
    payload: {
      entityId: 'prov-002',
      entityName: 'Parvati Devi Sohrai Collective',
      action: 'CERTIFIED_HERITAGE_ARTISAN',
      details: 'GI-Protected Sohrai & Khovar Natural Earth Pigment Master Artisan accreditation.',
      issuer: 'Directorate of Handloom & Handicrafts, Jharkhand'
    },
    previousHash: '0x8f2a6b1049c3098d57e2a9b1c70e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
    hash: '0x7e3c5a892b1049f7e6a4c2b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    nonce: 3190
  },
  {
    index: 3,
    timestamp: '2025-02-10T11:00:00.000Z',
    type: 'PROVIDER_CERTIFICATION',
    payload: {
      entityId: 'prov-003',
      entityName: 'Mahua Forest Eco Homestay (Oraon Family)',
      action: 'CERTIFIED_ECO_HOMESTAY',
      details: 'Eco-Friendly Heritage Homestay accreditation with Sarna nature preservation guidelines.',
      issuer: 'JTDC Rural Hospitality Board'
    },
    previousHash: '0x7e3c5a892b1049f7e6a4c2b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    hash: '0x3a9b1c70e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    nonce: 4512
  },
  {
    index: 4,
    timestamp: '2025-02-18T16:45:00.000Z',
    type: 'PROVIDER_CERTIFICATION',
    payload: {
      entityId: 'prov-004',
      entityName: 'Budhan Karmakar Dokra Guild',
      action: 'CERTIFIED_DOKRA_FOUNDRY',
      details: '4,000-year lost wax brass casting authenticity provenance guarantee.',
      issuer: 'Jharkhand State Khadi & Village Industries Board'
    },
    previousHash: '0x3a9b1c70e4f1a2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    hash: '0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    nonce: 5129
  },
  {
    index: 5,
    timestamp: '2025-02-22T09:20:00.000Z',
    type: 'PROVIDER_CERTIFICATION',
    payload: {
      entityId: 'prov-005',
      entityName: 'Chotanagpur Green Trails & Taxis',
      action: 'CERTIFIED_ECO_TRANSPORT',
      details: 'Hill-Safety Certified fleet with verified background checks and zero-carbon emission goals.',
      issuer: 'Jharkhand Transport Authority'
    },
    previousHash: '0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    nonce: 6014
  }
];

export const INITIAL_REVIEWS: TouristReview[] = [
  {
    id: 'rev-001',
    destinationId: 'netarhat',
    providerId: 'prov-003',
    authorName: 'Aarav Sharma',
    authorLocation: 'Bengaluru, Karnataka',
    rating: 5,
    date: '2025-02-14',
    comment: 'The sunrise at Magnolia Point was mystical with the morning fog swirling over the pine valley! Staying at Mahua Eco Homestay was the highlight — the host prepared hot Marua rotis with Desi Saag and narrated beautiful folklore.',
    sentimentScore: 96,
    sentimentLabel: 'Positive',
    aspects: {
      authenticity: 98,
      cleanliness: 92,
      safety: 95,
      hospitality: 99,
      value: 94
    },
    verifiedVisit: true
  },
  {
    id: 'rev-002',
    destinationId: 'betla-national-park',
    providerId: 'prov-001',
    authorName: 'Dr. Sunita Sen',
    authorLocation: 'Kolkata, West Bengal',
    rating: 5,
    date: '2025-02-18',
    comment: 'Somra Munda is an incredible guide. Within two hours inside Betla, his tracking skills helped us spot a herd of wild elephants by the waterhole and Indian Gaurs. The 16th century Palamau Fort ruins amidst the jungle feel like an Indiana Jones set!',
    sentimentScore: 98,
    sentimentLabel: 'Positive',
    aspects: {
      authenticity: 100,
      cleanliness: 90,
      safety: 96,
      hospitality: 98,
      value: 96
    },
    verifiedVisit: true
  },
  {
    id: 'rev-003',
    destinationId: 'patratu-valley',
    providerId: 'prov-005',
    authorName: 'Rohit Kulkarni',
    authorLocation: 'Pune, Maharashtra',
    rating: 4,
    date: '2025-02-20',
    comment: 'The winding ghat roads are truly world class. Speed boating at Patratu Lake Resort was thrilling. Great evening atmosphere, though parking during weekend peak hours requires a little patience.',
    sentimentScore: 84,
    sentimentLabel: 'Positive',
    aspects: {
      authenticity: 85,
      cleanliness: 88,
      safety: 90,
      hospitality: 82,
      value: 86
    },
    verifiedVisit: true
  },
  {
    id: 'rev-004',
    destinationId: 'tribal-cultural-village-khunti',
    providerId: 'prov-002',
    authorName: 'Elena Rostova',
    authorLocation: 'Paris, France',
    rating: 5,
    date: '2025-02-25',
    comment: 'Participating in the Sohrai painting workshop with Parvati Devi opened my eyes to prehistoric tribal cosmology. Using natural earth ochres to paint on canvas with twig brushes was a deeply therapeutic cultural experience.',
    sentimentScore: 99,
    sentimentLabel: 'Positive',
    aspects: {
      authenticity: 100,
      cleanliness: 95,
      safety: 98,
      hospitality: 100,
      value: 98
    },
    verifiedVisit: true
  }
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BKG-2025-081',
    touristName: 'Aarav Sharma',
    touristEmail: 'aarav.sharma@example.com',
    touristPhone: '+91 98200 11928',
    serviceType: 'homestay_stay',
    targetTitle: 'Mahua Forest Eco Homestay (2 Nights)',
    providerId: 'prov-003',
    bookingDate: '2025-02-12',
    travelDate: '2025-02-14',
    amount: 4400,
    status: 'confirmed',
    transactionHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    blockHeight: 119,
    paymentMethod: 'Pay on Arrival / Cash',
    notes: 'Requested organic vegetarian meals'
  },
  {
    id: 'BKG-2025-094',
    touristName: 'Dr. Sunita Sen',
    touristEmail: 'sunita.sen@cu.ac.in',
    touristPhone: '+91 98300 44210',
    serviceType: 'guide_tour',
    targetTitle: 'Betla Forest & Palamau Forts Guided Safari',
    providerId: 'prov-001',
    bookingDate: '2025-02-16',
    travelDate: '2025-02-18',
    amount: 1200,
    status: 'confirmed',
    transactionHash: '0x8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c',
    blockHeight: 121,
    paymentMethod: 'UPI Pre-authorization',
    notes: 'Party of 4 birdwatchers'
  },
  {
    id: 'BKG-2025-102',
    touristName: 'Vikramaditya Roy',
    touristEmail: 'vikram.roy@outlook.com',
    touristPhone: '+91 94331 87291',
    serviceType: 'marketplace_order',
    targetTitle: 'Traditional Dokra Musician Ensemble + Kuchai Silk Shawl',
    providerId: 'prov-004',
    productId: 'prod-001',
    bookingDate: '2025-02-21',
    travelDate: '2025-02-21',
    amount: 5050,
    status: 'confirmed',
    transactionHash: '0x7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d',
    blockHeight: 128,
    paymentMethod: 'UPI Pre-authorization'
  }
];

export const INITIAL_ANALYTICS: AnalyticsSnapshot = {
  date: '2025-02-28',
  totalVisitors: 48920,
  activeBookings: 1284,
  verifiedProviders: 148,
  overallSentiment: 92.4,
  topDestinations: [
    { name: 'Netarhat', visits: 14200, sentiment: 96 },
    { name: 'Baidyanath Dham Deoghar', visits: 18500, sentiment: 94 },
    { name: 'Patratu Valley', visits: 12300, sentiment: 91 },
    { name: 'Betla National Park', visits: 8900, sentiment: 97 },
    { name: 'Hundru Falls', visits: 9400, sentiment: 89 }
  ],
  categoryBreakdown: [
    { category: 'Eco & Forests', count: 35 },
    { category: 'Waterfalls & Gorges', count: 28 },
    { category: 'Spiritual Pilgrimage', count: 22 },
    { category: 'Tribal Cultural Heritage', count: 15 }
  ],
  revenueVolume: 4280000, // ₹42.8 Lakhs
  ecoComplianceScore: 94.8
};

export const INITIAL_LEADERBOARD: import('../types').EcoExplorer[] = [
  {
    id: 'eco-001',
    name: 'Ananya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Ranchi / Bengaluru',
    points: 3850,
    badgeTitle: 'Forest Sentinel',
    tier: 'Diamond Sentinel',
    destinationsVisitedCount: 14,
    ecoActionsCount: 22,
    verifiedBadges: ['Netarhat Sunrise Pioneer', 'Zero-Plastic Trail', 'Sohrai Art Patron']
  },
  {
    id: 'eco-002',
    name: 'Rohan Tirkey',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Khunti / Delhi',
    points: 3420,
    badgeTitle: 'Tribal Lorekeeper',
    tier: 'Gold Guardian',
    destinationsVisitedCount: 11,
    ecoActionsCount: 19,
    verifiedBadges: ['Dokra Craft Collector', 'Betla Wildlife Scout', 'Munda Heritage Custodian']
  },
  {
    id: 'eco-003',
    name: 'Priyanka Sengupta',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    location: 'Kolkata',
    points: 3110,
    badgeTitle: 'Canopy Wanderer',
    tier: 'Gold Guardian',
    destinationsVisitedCount: 9,
    ecoActionsCount: 16,
    verifiedBadges: ['Hundru Plunge Explorer', '360° VR Virtuoso', 'Green Homestay Advocate']
  },
  {
    id: 'eco-004',
    name: 'Deepak Kumar',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    location: 'Jamshedpur',
    points: 2780,
    badgeTitle: 'Ghat Trailblazer',
    tier: 'Silver Trailblazer',
    destinationsVisitedCount: 8,
    ecoActionsCount: 14,
    verifiedBadges: ['Patratu Serpentine Ace', 'Baidyanath Pilgrim', 'AI Green Itinerary']
  },
  {
    id: 'eco-005',
    name: 'Sunita Munda',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    location: 'Latehar',
    points: 2450,
    badgeTitle: 'Plateau Guardian',
    tier: 'Silver Trailblazer',
    destinationsVisitedCount: 7,
    ecoActionsCount: 12,
    verifiedBadges: ['Saranda Forest Trek', 'Tribal Guide Supporter', 'Zero Waste Champion']
  }
];

export const INITIAL_QUESTS: import('../types').EcoQuest[] = [
  {
    id: 'quest-vr',
    title: 'Explore a 360° VR Panoramic Site',
    description: 'Immerse yourself in Netarhat Sunset Point or Betla jungle canopy via interactive WebGL VR.',
    points: 150,
    category: 'vr',
    completed: false,
    actionText: 'Launch 360° VR',
    targetAction: 'vr'
  },
  {
    id: 'quest-pledge',
    title: 'Sign the Sarna Eco-Tourism Pledge',
    description: 'Commit to zero single-use plastic, sacred grove protection, and fair tribal compensation.',
    points: 200,
    category: 'pledge',
    completed: false,
    actionText: 'Take Eco-Pledge',
    targetAction: 'pledge'
  },
  {
    id: 'quest-itinerary',
    title: 'Generate an AI Sustainable Itinerary',
    description: 'Use Gemini AI to build a low-carbon expedition plan with eco-stays & local guides.',
    points: 175,
    category: 'itinerary',
    completed: false,
    actionText: 'Plan with AI',
    targetAction: 'itinerary'
  },
  {
    id: 'quest-marketplace',
    title: 'Patronize Tribal Dokra or Tussar Artisans',
    description: 'Support indigenous craftsmen from Khunti, Hazaribagh, or Chaibasa with zero middlemen.',
    points: 250,
    category: 'marketplace',
    completed: false,
    actionText: 'Browse Crafts',
    targetAction: 'marketplace'
  },
  {
    id: 'quest-verify',
    title: 'Audit a Blockchain Certificate QR',
    description: 'Verify the cryptographic SHA-256 validity of a local guide or homestay license.',
    points: 125,
    category: 'verify',
    completed: false,
    actionText: 'Verify QR Code',
    targetAction: 'verify'
  }
];
