import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Layers,
  Eye,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  MapPin,
  Compass,
  Info,
  RotateCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Camera,
  Smartphone,
  Navigation,
  Globe,
  Share2,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Wind
} from 'lucide-react';

interface VRPanoramaViewerProps {
  initialSite?: string;
  onClose?: () => void;
  language: string;
}

export interface PanoramaLocation {
  id: string;
  aliases: string[];
  name: string;
  hindiName: string;
  district: string;
  category: 'eco' | 'waterfalls' | 'spiritual' | 'adventure' | 'cultural';
  coordinates: { lat: number; lng: number };
  elevation: string;
  bestTime: string;
  description: string;
  // High-resolution equirectangular 360 / panorama images
  panoramaTextureUrl: string;
  fallbackTextureUrl: string;
  aerialTextureUrl?: string;
  // Google Street View / Photosphere embed coordinates for live 360
  googleStreetViewEmbed?: string;
  skyColor: string;
  groundColor: string;
  audioTheme: 'wind_pines' | 'waterfall_roar' | 'jungle_birds' | 'temple_bells' | 'valley_breeze';
  highlights: string[];
  hotspots: {
    lat: number;
    lon: number;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
}

export const PANORAMA_SITES: PanoramaLocation[] = [
  {
    id: 'netarhat_sunset',
    aliases: ['netarhat', 'netarhat_sunset', 'netarhat-sunset', 'magnolia_point'],
    name: 'Netarhat Magnolia Sunset Point',
    hindiName: 'नेतरहाट मैगनोलिया सनसेट व्यू',
    district: 'Latehar (3,514 ft)',
    category: 'eco',
    coordinates: { lat: 23.4795, lng: 84.2694 },
    elevation: '1,071 m (3,514 ft)',
    bestTime: '4:45 PM – 6:15 PM (Golden Sunset Hour)',
    description:
      'Perched on the highest western rim of the Chotanagpur Plateau. Watch the golden dusk illuminate vast stretches of virgin Sal and Chir pine forests spreading into the horizon toward Chhattisgarh.',
    // Authentic high-res equirectangular 360 panorama of mountain plateau & golden sunset horizon
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2000&q=85',
    aerialTextureUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=90',
    skyColor: '#ea580c',
    groundColor: '#143422',
    audioTheme: 'wind_pines',
    highlights: [
      'Magnolia Point 1,200 ft vertical drop',
      'Pine forest walking trails & colonial rest houses',
      'Cool mountain breeze and unpolluted twilight'
    ],
    hotspots: [
      {
        lat: 12,
        lon: 15,
        title: 'Magnolia Cliff Drop-off',
        description:
          'Legend holds that an English woman named Magnolia was captivated by the plateau landscape and local lore. The viewpoint offers uninterrupted 180° views over Chhattisgarh hills.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -18,
        lon: 95,
        title: 'Chir Pine & Sal Forest Ridge',
        description:
          'Over 45 sq km of pristine sub-tropical forest corridor, sheltering wild civets, flying squirrels, and barking deer.',
        imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: 5,
        lon: -115,
        title: 'Upper Ghaghri Valley',
        description:
          'A quiet 4 km forest trek leading to the cascading Upper Ghaghri water springs nestled within dense eucalyptus and pear orchards.',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'hundru_falls',
    aliases: ['hundru_falls', 'hundru-falls', 'hundru', 'subarnarekha_falls'],
    name: 'Hundru Falls Granite Amphitheater',
    hindiName: 'हुंडरू जलप्रपात घाटी',
    district: 'Ranchi (Subarnarekha River)',
    category: 'waterfalls',
    coordinates: { lat: 23.4477, lng: 85.6547 },
    elevation: '655 m',
    bestTime: '7:30 AM – 4:30 PM (Misty Spray Hours)',
    description:
      'Standing at the base of the 320-foot Subarnarekha River cascade. Dramatic rock formations sculpted by millions of years of rushing waters create a natural swimming basin surrounded by sheer cliffs.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=2000&q=85',
    aerialTextureUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=2400&q=90',
    skyColor: '#0284c7',
    groundColor: '#334155',
    audioTheme: 'waterfall_roar',
    highlights: [
      '320 ft vertical plunge of Subarnarekha River',
      'Naturally polished granite rock formations',
      'Historic 700-step descending ghat staircase'
    ],
    hotspots: [
      {
        lat: 28,
        lon: 30,
        title: '320 ft Main Cascade Plunge',
        description:
          'The Subarnarekha river plunges 98 meters over jagged Chotanagpur granite, creating a massive vapor cloud visible for kilometers.',
        imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -22,
        lon: -60,
        title: 'Granite Potholes & Geological Basin',
        description:
          'Deep circular whirlpool potholes carved into solid granite over millennia by swirling river pebbles.',
        imageUrl: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -5,
        lon: 155,
        title: '700-Step Cliff Staircase',
        description:
          'Paved descending stone steps flanked by wild bamboo groves and fresh local Dhuska-Ghugni breakfast stalls.',
        imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'betla_safari',
    aliases: ['betla_safari', 'betla-national-park', 'betla', 'palamau_fort'],
    name: 'Betla Tiger Reserve & Palamau Fort Trail',
    hindiName: 'बेतला टाइगर रिज़र्व एवं पलामू किला',
    district: 'Latehar & Palamau',
    category: 'eco',
    coordinates: { lat: 23.8824, lng: 84.1895 },
    elevation: '320 m',
    bestTime: '6:00 AM – 9:30 AM (Wildlife Safari Time)',
    description:
      'Immerse in the historic Sal and Bamboo tiger corridor along the Auranga river. Explore the 16th-century stone ramparts of Raja Medini Ray’s Palamau Forts nestled deep in the jungle.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=2000&q=85',
    aerialTextureUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=90',
    skyColor: '#10b981',
    groundColor: '#1c1917',
    audioTheme: 'jungle_birds',
    highlights: [
      'Wild Elephant and Indian Gaur (Bison) tracking paths',
      '16th-century Chero Dynasty Fort Ruins (Nagpuri Gate)',
      'Towering centuries-old Shorea Robusta (Sal) trees'
    ],
    hotspots: [
      {
        lat: 18,
        lon: 45,
        title: 'Nagpuri Gate of Old Palamau Fort',
        description:
          'Architectural marvel built in 16th century by King Medini Ray with intricately carved Islamic and Hindu floral stone motifs.',
        imageUrl: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -14,
        lon: -80,
        title: 'Auranga River Watering Basin',
        description:
          'Primary natural watering hole where herds of Indian Gaur (bison), spotted deer (chital), and wild elephants gather at sunrise.',
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: 32,
        lon: 130,
        title: 'Sacred Sarna Sal Canopy',
        description:
          'Centuries-old Sal trees protected by tribal villagers as living nature sanctuaries for forest spirits.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'patratu_valley',
    aliases: ['patratu_valley', 'patratu-valley', 'patratu', 'patratu_dam'],
    name: 'Patratu Valley Serpentine Ghats',
    hindiName: 'पतरातू घाटी एवं जलाशय',
    district: 'Ramgarh (405 m)',
    category: 'adventure',
    coordinates: { lat: 23.6341, lng: 85.2988 },
    elevation: '405 m (1,328 ft)',
    bestTime: '5:00 PM – 7:00 PM (Sunset & Night Illumination)',
    description:
      'Gaze down upon the famous hairpin curves descending through lush emerald valleys into the Patratu Dam reservoir. A masterpiece of hill engineering and road-trip scenery.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    aerialTextureUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=2400&q=90',
    skyColor: '#0ea5e9',
    groundColor: '#1e293b',
    audioTheme: 'valley_breeze',
    highlights: [
      'Dramatic hairpin scenic curves',
      'Turquoise waters of Patratu Reservoir',
      'Waterfront resort and island promenade'
    ],
    hotspots: [
      {
        lat: 15,
        lon: 10,
        title: 'Hairpin Ghat Lookout Point',
        description:
          'Scenic viewpoint perched over the famous continuous S-curves winding down through the hills.',
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -12,
        lon: -70,
        title: 'Patratu Reservoir Water Sports Hub',
        description:
          'Lakeside marina offering speedboats, jet skis, and pontoon dining on the reservoir waters.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'baidyanath_dham',
    aliases: ['baidyanath-dham-deoghar', 'baidyanath_dham', 'baidyanath', 'deoghar'],
    name: 'Baba Baidyanath Jyotirlinga Dham',
    hindiName: 'बाबा बैद्यनाथ धाम (देवघर)',
    district: 'Deoghar',
    category: 'spiritual',
    coordinates: { lat: 24.4923, lng: 86.7001 },
    elevation: '254 m',
    bestTime: '4:30 AM – 7:30 AM (Morning Sandhya & Aarti)',
    description:
      'The sacred courtyard of one of the 12 Shiva Jyotirlingas in India. Featuring 22 ancient stone temples connected by sacred red ribbons with the holy gold Panchshul trident gleaming above the sanctum spire.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=2000&q=85',
    skyColor: '#f59e0b',
    groundColor: '#451a03',
    audioTheme: 'temple_bells',
    highlights: [
      'Sacred Kamana Lingam sanctum spire',
      'Panchshul gold trident dome',
      '22 interconnected historic stone mandirs'
    ],
    hotspots: [
      {
        lat: 25,
        lon: 0,
        title: 'Main Sanctum Spire & Panchshul',
        description:
          'Unlike other temples with trishuls, Baidyanath features a sacred 5-pronged Panchshul made of Ashtadhatu (eight metals).',
        imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -8,
        lon: 80,
        title: 'Parvati Mandir & Red Ribbon Bridge',
        description:
          'Holy red threads tied between Shiva and Parvati temples symbolizing eternal cosmic union and pilgrim vows.',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'parasnath_shikharji',
    aliases: ['parasnath-shikharji', 'parasnath', 'shikharji', 'sammed_shikharji'],
    name: 'Parasnath (Shri Sammed Shikharji)',
    hindiName: 'पारसनाथ (सम्मेद शिखरजी शिखर)',
    district: 'Giridih (1,365 m summit)',
    category: 'spiritual',
    coordinates: { lat: 23.9628, lng: 86.1306 },
    elevation: '1,365 m (4,478 ft)',
    bestTime: '4:00 AM – 11:00 AM (Mountain Sunrise Trek)',
    description:
      'Standing at the highest mountain summit of Jharkhand. A serene sacred pilgrimage where 20 Jain Tirthankaras attained Nirvana, surrounded by misty cloud forest ridges and white marble tonks.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=85',
    skyColor: '#38bdf8',
    groundColor: '#0f172a',
    audioTheme: 'wind_pines',
    highlights: [
      'Highest summit peak of Jharkhand (1,365m)',
      'Ancient marble Tonks of 20 Tirthankaras',
      'Panoramic 360° cloud views over Chotanagpur'
    ],
    hotspots: [
      {
        lat: 15,
        lon: 20,
        title: 'Paras Nath Tonk (23rd Tirthankara)',
        description:
          'The highest shrine of Lord Parshvanatha standing tall above the clouds at 4,478 ft.',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -10,
        lon: -90,
        title: 'Madhuvan Valley Base & Forests',
        description:
          'Dense sal and mahua forest canopy home to indigenous Santhal villages who revere the mountain as Marang Buru.',
        imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'jonha_dassam_falls',
    aliases: ['jonha-dassam-falls', 'jonha', 'dassam', 'gautamdhara'],
    name: 'Jonha & Dassam Waterfalls Circuit',
    hindiName: 'जोन्हा एवं दशम जलप्रपात',
    district: 'Ranchi (Kanchi River)',
    category: 'waterfalls',
    coordinates: { lat: 23.3441, lng: 85.6083 },
    elevation: '580 m',
    bestTime: '8:00 AM – 4:00 PM',
    description:
      'A multi-tiered stepped waterfall cascading through forest canyons with the ancient Buddhist monastery pavilion overlooking the roaring pools.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85',
    skyColor: '#0284c7',
    groundColor: '#1e293b',
    audioTheme: 'waterfall_roar',
    highlights: [
      'Stepped 722 stone terrace staircase',
      'Gautam Buddha meditation ashram',
      'Dassam 144 ft ten-stream torrent'
    ],
    hotspots: [
      {
        lat: 20,
        lon: 10,
        title: 'Lord Buddha Meditation Terrace',
        description:
          'Where Gautam Buddha is believed to have rested; overlooking the stepped cascades.',
        imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&q=80'
      }
    ]
  },
  {
    id: 'khunti_heritage_village',
    aliases: ['tribal-cultural-village-khunti', 'khunti', 'sohrai_village', 'ulihatu'],
    name: 'Khunti Tribal Living Heritage & Sohrai Murals',
    hindiName: 'खूंटी जनजातीय सांस्कृतिक धरोहर',
    district: 'Khunti & Ranchi',
    category: 'cultural',
    coordinates: { lat: 23.0768, lng: 85.2789 },
    elevation: '610 m',
    bestTime: '9:00 AM – 5:00 PM',
    description:
      'Immerse in an authentic Munda tribal village with earthen walls painted in UNESCO-recognized Sohrai geometric nature murals and sacred Sarna sal tree groves.',
    panoramaTextureUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
    fallbackTextureUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=2000&q=85',
    skyColor: '#b45309',
    groundColor: '#3f2e1e',
    audioTheme: 'jungle_birds',
    highlights: [
      'Hand-painted Sohrai-Khovar mud murals',
      'Dokra brass lost-wax casting workshops',
      'Sacred Sarna Sthal sal tree sanctuary'
    ],
    hotspots: [
      {
        lat: 10,
        lon: -20,
        title: 'Sohrai Natural Pigment Wall Murals',
        description:
          'Tribal women paint stories of birds, trees, and domestic animals using red oxide (geru), yellow earth, and charcoal.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80'
      },
      {
        lat: -15,
        lon: 110,
        title: 'Traditional Munda Akhra Gathering Ground',
        description:
          'Village center where elders hold Gram Sabha councils and youth celebrate Sarhul & Karma dances to Mandar drums.',
        imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
];

export const VRPanoramaViewer: React.FC<VRPanoramaViewerProps> = ({
  initialSite = 'netarhat_sunset',
  onClose,
  language
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerWrapperRef = useRef<HTMLDivElement>(null);

  // Match initial site by exact id or alias
  const resolveSite = (siteKey?: string): PanoramaLocation => {
    if (!siteKey) return PANORAMA_SITES[0];
    const key = siteKey.toLowerCase().trim();
    const found = PANORAMA_SITES.find(
      s => s.id.toLowerCase() === key || s.aliases.some(a => a.toLowerCase() === key)
    );
    return found || PANORAMA_SITES[0];
  };

  const [selectedSite, setSelectedSite] = useState<PanoramaLocation>(() =>
    resolveSite(initialSite)
  );

  // Track changes from parent component
  useEffect(() => {
    if (initialSite) {
      setSelectedSite(resolveSite(initialSite));
    }
  }, [initialSite]);

  // Viewer State
  const [viewMode, setViewMode] = useState<'360_photosphere' | 'aerial_view' | 'google_streetview'>(
    '360_photosphere'
  );
  const [isLoadingTexture, setIsLoadingTexture] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(10);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isGyroActive, setIsGyroActive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<PanoramaLocation['hotspots'][0] | null>(null);
  const [hudVisible, setHudVisible] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<'natural' | 'golden' | 'twilight'>('natural');
  const [snapshotSuccess, setSnapshotSuccess] = useState<boolean>(false);

  // Audio Context & Three.js references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gain?: GainNode } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const zoomControlRef = useRef<{ fov: number }>({ fov: 75 });

  // WebGL 360 Sphere Generator with Photographic Texture
  useEffect(() => {
    if (!mountRef.current || viewMode === 'google_streetview') return;

    const container = mountRef.current;
    // Clear existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    setIsLoadingTexture(true);
    setLoadingProgress(25);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(zoomControlRef.current.fov, width / height, 1, 1200);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;
    const cameraTarget = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = timeOfDay === 'golden' ? 1.25 : timeOfDay === 'twilight' ? 0.9 : 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Inverted 360 Sphere Geometry
    const sphereGeo = new THREE.SphereGeometry(500, 64, 48);
    sphereGeo.scale(-1, 1, 1); // Flip normals inward for 360 interior view

    // Texture Loader with Cross-Origin and Fallbacks
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // Pick appropriate image URL
    const targetUrl =
      viewMode === 'aerial_view' && selectedSite.aerialTextureUrl
        ? selectedSite.aerialTextureUrl
        : selectedSite.panoramaTextureUrl;

    // Helper: Draw procedural scenic gradient texture if network image is delayed
    const createFallbackCanvasTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 2048;
      cvs.height = 1024;
      const ctx = cvs.getContext('2d')!;
      
      const grad = ctx.createLinearGradient(0, 0, 0, cvs.height);
      grad.addColorStop(0, '#0c1a2e');
      grad.addColorStop(0.35, selectedSite.skyColor);
      grad.addColorStop(0.5, '#fed7aa');
      grad.addColorStop(0.55, '#1e3a1e');
      grad.addColorStop(1, selectedSite.groundColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Mountains & tree silhouettes
      ctx.fillStyle = 'rgba(10, 25, 15, 0.85)';
      ctx.beginPath();
      ctx.moveTo(0, cvs.height * 0.54);
      for (let x = 0; x <= cvs.width; x += 30) {
        const y = cvs.height * 0.52 + Math.sin(x * 0.015) * 40 + Math.cos(x * 0.04) * 25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(cvs.width, cvs.height);
      ctx.lineTo(0, cvs.height);
      ctx.fill();

      // Glowing Sun / Horizon
      ctx.beginPath();
      const sX = cvs.width * 0.48;
      const sY = cvs.height * 0.48;
      const sG = ctx.createRadialGradient(sX, sY, 15, sX, sY, 220);
      sG.addColorStop(0, 'rgba(255, 255, 220, 0.95)');
      sG.addColorStop(0.3, 'rgba(251, 146, 60, 0.6)');
      sG.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = sG;
      ctx.arc(sX, sY, 220, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(cvs);
    };

    const initialTexture = createFallbackCanvasTexture();
    const sphereMat = new THREE.MeshBasicMaterial({
      map: initialTexture
    });

    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // Load actual high-resolution photographic texture
    setLoadingProgress(50);
    textureLoader.load(
      targetUrl,
      texture => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1; // Align standard equirectangular horizontal orientation
        sphereMat.map = texture;
        sphereMat.needsUpdate = true;
        setLoadingProgress(100);
        setIsLoadingTexture(false);
      },
      progress => {
        if (progress.total > 0) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          setLoadingProgress(Math.min(95, Math.max(30, pct)));
        }
      },
      error => {
        console.warn('Primary 360 texture load fallback, trying secondary asset:', error);
        // Try fallback URL
        textureLoader.load(
          selectedSite.fallbackTextureUrl,
          fbTexture => {
            fbTexture.minFilter = THREE.LinearFilter;
            fbTexture.magFilter = THREE.LinearFilter;
            sphereMat.map = fbTexture;
            sphereMat.needsUpdate = true;
            setIsLoadingTexture(false);
          },
          undefined,
          () => {
            // Keep procedural high-fidelity canvas texture
            setIsLoadingTexture(false);
          }
        );
      }
    );

    // Interactive 3D Hotspot Rings positioned on sphere
    const hotspotGroup = new THREE.Group();
    scene.add(hotspotGroup);

    const hotspotMeshes: { mesh: THREE.Mesh; data: (typeof selectedSite.hotspots)[0] }[] = [];

    selectedSite.hotspots.forEach(hs => {
      const phi = THREE.MathUtils.degToRad(90 - hs.lat);
      const theta = THREE.MathUtils.degToRad(hs.lon);

      const x = 380 * Math.sin(phi) * Math.cos(theta);
      const y = 380 * Math.cos(phi);
      const z = 380 * Math.sin(phi) * Math.sin(theta);

      // Outer Ring
      const ringGeo = new THREE.RingGeometry(9, 14, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.lookAt(0, 0, 0);

      // Inner Center Glowing Disc
      const dotGeo = new THREE.CircleGeometry(6, 24);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.set(0, 0, 0.5);
      ringMesh.add(dotMesh);

      hotspotGroup.add(ringMesh);
      hotspotMeshes.push({ mesh: ringMesh, data: hs });
    });

    // Spherical Drag & Look Controls
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let lon = 0;
    let onPointerDownLon = 0;
    let lat = 0;
    let onPointerDownLat = 0;
    let phi = 0;
    let theta = 0;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      isUserInteracting = true;
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      onPointerDownPointerX = clientX;
      onPointerDownPointerY = clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      if (isUserInteracting) {
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

        lon = (onPointerDownPointerX - clientX) * 0.18 + onPointerDownLon;
        lat = (clientY - onPointerDownPointerY) * 0.18 + onPointerDownLat;
      }
    };

    const onPointerUp = () => {
      isUserInteracting = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const newFov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(newFov, 25, 95);
      zoomControlRef.current.fov = camera.fov;
      camera.updateProjectionMatrix();
    };

    // Hotspot Click Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes.map(h => h.mesh));
      if (intersects.length > 0) {
        const hit = hotspotMeshes.find(h => h.mesh === intersects[0].object || h.mesh.children.includes(intersects[0].object as any));
        if (hit) {
          setActiveHotspot(hit.data);
        }
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    container.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // Responsive Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isUserInteracting && isAutoRotating) {
        lon += 0.08; // Smooth ambient rotation
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.y = 500 * Math.cos(phi);
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(cameraTarget);

      // Hotspot gentle pulsation
      const time = clock.getElapsedTime();
      hotspotMeshes.forEach((h, i) => {
        const scale = 1 + Math.sin(time * 3.5 + i * 1.5) * 0.18;
        h.mesh.scale.set(scale, scale, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedSite, viewMode, isAutoRotating, timeOfDay]);

  // Zoom Helpers
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const step = direction === 'in' ? -12 : 12;
    const newFov = THREE.MathUtils.clamp(cameraRef.current.fov + step, 25, 95);
    cameraRef.current.fov = newFov;
    zoomControlRef.current.fov = newFov;
    cameraRef.current.updateProjectionMatrix();
  };

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.fov = 75;
    zoomControlRef.current.fov = 75;
    cameraRef.current.updateProjectionMatrix();
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerWrapperRef.current) return;
    if (!document.fullscreenElement) {
      containerWrapperRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen request denied:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Web Audio Synthesizer for Authentic Nature Soundscapes
  const toggleAudio = () => {
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        if (selectedSite.audioTheme === 'waterfall_roar') {
          // Deep rushing water resonance
          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(80, ctx.currentTime);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(140, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        } else if (selectedSite.audioTheme === 'temple_bells') {
          // Chime harmonic bells
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(528, ctx.currentTime);
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(792, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        } else if (selectedSite.audioTheme === 'jungle_birds') {
          // Soft fluty bird harmonics
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(440, ctx.currentTime);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(660, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.025, ctx.currentTime);
        } else {
          // Pine canopy mountain wind
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(180, ctx.currentTime);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(260, ctx.currentTime);
          gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
        }

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        soundNodesRef.current = { osc1, osc2, gain: gainNode };
        setIsAudioPlaying(true);
      } catch (e) {
        console.error('Audio synthesizer init error:', e);
      }
    }
  };

  // High-Resolution Postcard Snapshot
  const handleTakeSnapshot = () => {
    if (!rendererRef.current) return;
    try {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `Johar_Jharkhand_360_${selectedSite.id}_${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();

      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 3500);
    } catch (e) {
      console.warn('Snapshot capture warning:', e);
    }
  };

  return (
    <div
      ref={containerWrapperRef}
      id="vr-panorama-main-container"
      className="relative w-full rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl text-stone-100 select-none flex flex-col"
    >
      {/* 1. TOP HEADER & HUD BAR */}
      <div className="relative z-30 p-4 bg-gradient-to-b from-stone-950 via-stone-950/80 to-transparent border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Destination Identity & Mode Pill */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg border border-emerald-400/40 flex-shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-sm sm:text-base text-white tracking-tight">
                {language === 'hi' ? selectedSite.hindiName : selectedSite.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                {viewMode === '360_photosphere'
                  ? '360° Real View'
                  : viewMode === 'aerial_view'
                  ? 'Aerial Drone 360'
                  : 'Live Map View'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{selectedSite.district}</span>
              <span className="text-stone-600">•</span>
              <span className="text-amber-300 font-mono">{selectedSite.elevation}</span>
              <span className="text-stone-600">•</span>
              <span>Best: {selectedSite.bestTime}</span>
            </p>
          </div>
        </div>

        {/* View Controls & Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-stone-700 text-xs">
            <button
              onClick={() => setViewMode('360_photosphere')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                viewMode === '360_photosphere'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="360° Spherical Photosphere"
            >
              360° Ground
            </button>
            {selectedSite.aerialTextureUrl && (
              <button
                onClick={() => setViewMode('aerial_view')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'aerial_view'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Aerial Drone Perspective"
              >
                Aerial 360°
              </button>
            )}
            <button
              onClick={() => setViewMode('google_streetview')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'google_streetview'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Live Google Coordinates Map"
            >
              Satellite & Street
            </button>
          </div>

          {/* Auto-Rotation Toggle */}
          {viewMode !== 'google_streetview' && (
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-2 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all ${
                isAutoRotating
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900/80 text-stone-400 border-stone-700 hover:text-white'
              }`}
              title={isAutoRotating ? 'Pause 360 Auto-Rotation' : 'Resume 360 Auto-Rotation'}
            >
              {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Nature Audio Ambiance Toggle */}
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isAudioPlaying
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950'
                : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:bg-stone-800'
            }`}
            title="Toggle Spatial Nature Audio"
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span className="hidden md:inline">
              {isAudioPlaying ? 'Audio Playing' : 'Nature Ambiance'}
            </span>
          </button>

          {/* Snapshot Postcard Button */}
          {viewMode !== 'google_streetview' && (
            <button
              onClick={handleTakeSnapshot}
              className="p-2 rounded-xl bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700 hover:bg-stone-800 transition-colors"
              title="Download 360 Postcard Screenshot"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-stone-900/80 text-stone-300 hover:text-white border border-stone-700 hover:bg-stone-800 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN 360 VIEWPORT (Three.js WebGL Canvas or Google Satellite View) */}
      <div className="relative w-full h-[520px] sm:h-[620px] bg-stone-950 overflow-hidden">
        {viewMode === 'google_streetview' ? (
          /* Live Interactive Google Maps / Satellite Frame */
          <div className="w-full h-full relative">
            <iframe
              title={`360 Map View - ${selectedSite.name}`}
              src={`https://maps.google.com/maps?q=${selectedSite.coordinates.lat},${selectedSite.coordinates.lng}&z=14&output=embed`}
              className="w-full h-full border-0 filter brightness-95 contrast-105"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700 text-xs text-stone-200 max-w-xs shadow-xl">
              <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Geographic Satellite Position</span>
              </h4>
              <p className="text-[11px] text-stone-400">
                Lat: {selectedSite.coordinates.lat}° N, Lng: {selectedSite.coordinates.lng}° E
              </p>
              <div className="mt-2 pt-2 border-t border-stone-800 flex justify-between items-center text-[10px]">
                <span className="text-amber-400 font-semibold">Live GPS View</span>
                <button
                  onClick={() => setViewMode('360_photosphere')}
                  className="px-2 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                >
                  Return to 360° VR
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Three.js 360 Equirectangular Photosphere Canvas */
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing relative"
          />
        )}

        {/* Loading Spinner & Progress Bar */}
        {isLoadingTexture && viewMode !== 'google_streetview' && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20 space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <div className="text-center space-y-1">
              <h4 className="font-serif font-black text-white text-base">
                Loading High-Res 360° Panoramas...
              </h4>
              <p className="text-xs text-stone-400">
                Rendering {selectedSite.name} in equirectangular perspective
              </p>
            </div>
            <div className="w-48 h-2 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Snapshot Success Notification */}
        {snapshotSuccess && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl border border-emerald-300 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>High-Res 360° Postcard Downloaded! 📸</span>
          </div>
        )}

        {/* Floating Viewport Controls (Zoom In, Zoom Out, Reset, Compass) */}
        {viewMode !== 'google_streetview' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <button
              onClick={() => handleZoom('in')}
              className="w-9 h-9 rounded-xl bg-stone-900/85 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-95"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="w-9 h-9 rounded-xl bg-stone-900/85 hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-white flex items-center justify-center shadow-lg backdrop-blur-md transition-all active:scale-95"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCamera}
              className="w-9 h-9 rounded-xl bg-stone-900/85 hover:bg-stone-800 border border-stone-700 text-amber-400 hover:text-amber-300 flex items-center justify-center shadow-lg backdrop-blur-md transition-all text-xs font-black"
              title="Reset Zoom / Angle"
            >
              1x
            </button>
          </div>
        )}

        {/* Interactive Hotspot Details Modal */}
        {activeHotspot && (
          <div className="absolute bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-stone-900/95 backdrop-blur-xl border border-amber-500/50 rounded-3xl p-5 shadow-2xl text-stone-100 z-30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-black text-sm text-white">
                  {activeHotspot.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="w-6 h-6 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {activeHotspot.imageUrl && (
              <img
                src={activeHotspot.imageUrl}
                alt={activeHotspot.title}
                className="w-full h-32 object-cover rounded-2xl mt-3 border border-stone-800"
              />
            )}

            <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
              {activeHotspot.description}
            </p>

            <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span className="text-amber-300 font-semibold">📍 Point of Cultural Interest</span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-white font-bold hover:underline"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Bottom Interactive Navigation Help Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
          <div className="px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2 pointer-events-auto">
            <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>Click & Drag to Look Around 360° | Scroll to Zoom | Click amber rings for details</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px] text-amber-300 pointer-events-auto">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>8 Iconic Jharkhand Spheres Available</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM CAROUSEL OF ICONIC JHARKHAND DESTINATIONS */}
      <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3 z-30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select 360° Heritage & Nature Location:</span>
          </span>
          <span className="text-[11px] text-stone-400">
            {PANORAMA_SITES.length} Spheres Ready
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-800">
          {PANORAMA_SITES.map(site => {
            const isSelected = site.id === selectedSite.id;
            return (
              <button
                key={site.id}
                onClick={() => {
                  setSelectedSite(site);
                  setActiveHotspot(null);
                }}
                className={`group flex-shrink-0 flex items-center gap-3 p-2 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'bg-stone-900/90 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                }`}
              >
                <img
                  src={site.fallbackTextureUrl}
                  alt={site.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-700 flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="pr-2 max-w-[150px] sm:max-w-[170px]">
                  <h4 className="font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                    {language === 'hi' ? site.hindiName : site.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">
                    {site.district}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-amber-300 font-semibold mt-0.5">
                    <span>{site.elevation}</span>
                    <span>•</span>
                    <span className="capitalize">{site.category}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
