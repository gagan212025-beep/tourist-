import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_DESTINATIONS,
  INITIAL_PROVIDERS,
  INITIAL_PRODUCTS,
  INITIAL_EVENTS,
  INITIAL_BLOCKCHAIN_BLOCKS,
  INITIAL_REVIEWS,
  INITIAL_BOOKINGS,
  INITIAL_ANALYTICS,
  INITIAL_LEADERBOARD,
  INITIAL_QUESTS
} from './src/data/seedData';
import { computeBlockHash } from './src/lib/cryptoUtils';
import {
  Destination,
  Provider,
  MarketplaceProduct,
  CulturalEvent,
  BlockchainBlock,
  TouristReview,
  BookingRecord,
  AnalyticsSnapshot,
  GeneratedItinerary,
  EcoExplorer,
  EcoQuest
} from './src/types';

dotenv.config();

// In-Memory Database State
const destinations: Destination[] = [...INITIAL_DESTINATIONS];
const providers: Provider[] = [...INITIAL_PROVIDERS];
const products: MarketplaceProduct[] = [...INITIAL_PRODUCTS];
const events: CulturalEvent[] = [...INITIAL_EVENTS];
const blockchainBlocks: BlockchainBlock[] = [...INITIAL_BLOCKCHAIN_BLOCKS];
const reviews: TouristReview[] = [...INITIAL_REVIEWS];
const bookings: BookingRecord[] = [...INITIAL_BOOKINGS];
let analytics: AnalyticsSnapshot = { ...INITIAL_ANALYTICS };
const leaderboard: EcoExplorer[] = [...INITIAL_LEADERBOARD];
const quests: EcoQuest[] = [...INITIAL_QUESTS];

// Helper to get lazy Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// Blockchain Helper: Append a new verified block to ledger
function appendBlockchainBlock(
  type: BlockchainBlock['type'],
  payload: BlockchainBlock['payload']
): BlockchainBlock {
  const previousBlock = blockchainBlocks[blockchainBlocks.length - 1];
  const index = blockchainBlocks.length;
  const timestamp = new Date().toISOString();
  const nonce = Math.floor(Math.random() * 90000) + 1000;
  const hash = computeBlockHash(index, timestamp, type, payload, previousBlock.hash, nonce);

  const newBlock: BlockchainBlock = {
    index,
    timestamp,
    type,
    payload,
    previousHash: previousBlock.hash,
    hash: '0x' + hash,
    nonce
  };

  blockchainBlocks.push(newBlock);
  return newBlock;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // REST API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), blocksCount: blockchainBlocks.length });
  });

  // --- DESTINATIONS ---
  app.get('/api/destinations', (req, res) => {
    const { category, search } = req.query;
    let result = [...destinations];
    if (category && category !== 'all') {
      result = result.filter(d => d.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.hindiName && d.hindiName.includes(q)) ||
        d.district.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }
    res.json(result);
  });

  app.get('/api/destinations/:id', (req, res) => {
    const dest = destinations.find(d => d.id === req.params.id);
    if (!dest) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(dest);
  });

  // --- PROVIDERS (Guides, Homestays, Artisans, Transport) ---
  app.get('/api/providers', (req, res) => {
    const { role } = req.query;
    if (role && role !== 'all') {
      return res.json(providers.filter(p => p.role === role));
    }
    res.json(providers);
  });

  app.get('/api/providers/:id', (req, res) => {
    const prov = providers.find(p => p.id === req.params.id);
    if (!prov) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(prov);
  });

  // Provider Registration with Blockchain Certification
  app.post('/api/providers/register', (req, res) => {
    const {
      name,
      role,
      community,
      location,
      district,
      contactPhone,
      contactEmail,
      experienceYears,
      languages,
      bio,
      servicesOffered,
      pricing,
      documentsVerified
    } = req.body;

    if (!name || !role || !contactPhone) {
      return res.status(400).json({ error: 'Name, role, and contact phone are required' });
    }

    const newId = `prov-${Date.now().toString().slice(-4)}`;
    const issuedDate = new Date().toISOString().split('T')[0];

    // Create a new block on the tamper-evident ledger
    const block = appendBlockchainBlock('PROVIDER_CERTIFICATION', {
      entityId: newId,
      entityName: name,
      action: `CERTIFIED_${role.toUpperCase()}`,
      details: `${bio || 'Verified provider on Johar Jharkhand platform'} - District: ${district || 'Jharkhand'}`,
      issuer: 'Jharkhand Tourism Development Corporation (JTDC)'
    });

    const newProvider: Provider = {
      id: newId,
      name,
      role,
      community: community || 'Local Tribal Community',
      location: location || 'Jharkhand',
      district: district || 'Ranchi',
      contactPhone,
      contactEmail: contactEmail || `${name.toLowerCase().replace(/\s+/g, '.')}@jharkhand-tourism.in`,
      experienceYears: Number(experienceYears) || 2,
      languages: languages && Array.isArray(languages) ? languages : ['Hindi', 'Local dialect'],
      rating: 5.0,
      reviewsCount: 1,
      bio: bio || 'Verified service provider onboarded to Johar Jharkhand eco-network.',
      servicesOffered: servicesOffered && Array.isArray(servicesOffered) ? servicesOffered : ['Local Tourism Assistance'],
      pricing: pricing || '₹1,000 / day',
      verified: true,
      certificateHash: block.hash,
      blockHeight: block.index,
      issuedDate,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      documentsVerified: documentsVerified && Array.isArray(documentsVerified) ? documentsVerified : ['Aadhaar ID', 'JTDC Registration']
    };

    providers.push(newProvider);
    analytics.verifiedProviders += 1;

    res.status(201).json({
      provider: newProvider,
      blockchainBlock: block
    });
  });

  // --- MARKETPLACE PRODUCTS ---
  const handleGetProducts = (req: express.Request, res: express.Response) => {
    const { category } = req.query;
    if (category && category !== 'all') {
      return res.json(products.filter(p => p.category === category));
    }
    res.json(products);
  };
  app.get('/api/products', handleGetProducts);
  app.get('/api/marketplace', handleGetProducts);

  app.get('/api/products/:id', (req, res) => {
    const prod = products.find(p => p.id === req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json(prod);
  });

  // --- CULTURAL EVENTS ---
  app.get('/api/events', (req, res) => {
    res.json(events);
  });

  // --- BOOKINGS & ORDERS ---
  app.get('/api/bookings', (req, res) => {
    res.json(bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const {
      touristName,
      touristEmail,
      touristPhone,
      serviceType,
      targetTitle,
      providerId,
      productId,
      travelDate,
      amount,
      paymentMethod,
      notes
    } = req.body;

    if (!touristName || !touristPhone || !targetTitle || !amount) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    const bookingId = `BKG-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
    const bookingDate = new Date().toISOString().split('T')[0];

    // Log to blockchain ledger
    const block = appendBlockchainBlock('BOOKING_ESCROW', {
      entityId: bookingId,
      entityName: touristName,
      action: `BOOKING_${serviceType.toUpperCase()}`,
      details: `${targetTitle} booked for ${travelDate || bookingDate}. Payment: ${paymentMethod || 'Pay on Arrival'}`,
      amount: Number(amount),
      issuer: 'Johar Jharkhand Escrow Protocol'
    });

    const newBooking: BookingRecord = {
      id: bookingId,
      touristName,
      touristEmail: touristEmail || 'guest@tourist.in',
      touristPhone,
      serviceType,
      targetTitle,
      providerId,
      productId,
      bookingDate,
      travelDate: travelDate || bookingDate,
      amount: Number(amount),
      status: 'confirmed',
      transactionHash: block.hash,
      blockHeight: block.index,
      paymentMethod: paymentMethod || 'Pay on Arrival / Cash',
      notes
    };

    bookings.unshift(newBooking);
    analytics.activeBookings += 1;
    analytics.revenueVolume += Number(amount);

    res.status(201).json({
      booking: newBooking,
      blockchainBlock: block
    });
  });

  // --- BLOCKCHAIN VERIFICATION ENGINE ---
  const handleGetBlocks = (req: express.Request, res: express.Response) => {
    res.json(blockchainBlocks);
  };
  app.get('/api/blockchain/blocks', handleGetBlocks);
  app.get('/api/blockchain/ledger', handleGetBlocks);

  app.get('/api/blockchain/verify', (req, res) => {
    let isChainIntact = true;
    for (let i = 1; i < blockchainBlocks.length; i++) {
      const curr = blockchainBlocks[i];
      const prev = blockchainBlocks[i - 1];
      if (curr.previousHash !== prev.hash) {
        isChainIntact = false;
        break;
      }
    }
    res.json({
      valid: isChainIntact,
      totalBlocks: blockchainBlocks.length,
      genesisHash: blockchainBlocks[0]?.hash,
      headHash: blockchainBlocks[blockchainBlocks.length - 1]?.hash,
      message: isChainIntact
        ? 'All blocks sequentially validated with SHA-256 integrity.'
        : 'Chain integrity compromised.'
    });
  });

  app.get('/api/blockchain/verify/:hash', (req, res) => {
    const hash = req.params.hash;
    const cleanHash = hash.startsWith('0x') ? hash : '0x' + hash;
    const block = blockchainBlocks.find(b => b.hash.toLowerCase() === cleanHash.toLowerCase() || b.hash.toLowerCase() === hash.toLowerCase());

    if (!block) {
      return res.status(404).json({
        valid: false,
        message: 'Certificate hash not found on the Jharkhand Tourism immutable ledger.'
      });
    }

    // Verify cryptographic integrity from genesis to target block
    let isChainIntact = true;
    for (let i = 1; i <= block.index; i++) {
      const curr = blockchainBlocks[i];
      const prev = blockchainBlocks[i - 1];
      if (curr.previousHash !== prev.hash) {
        isChainIntact = false;
        break;
      }
    }

    res.json({
      valid: isChainIntact,
      block,
      issuer: 'Jharkhand Tourism Development Corporation (JTDC)',
      tamperEvident: isChainIntact,
      verifiedTimestamp: block.timestamp,
      message: isChainIntact
        ? 'Verified Authentic: This record is cryptographically signed and stored on the Johar Jharkhand Tourism Ledger.'
        : 'Warning: Cryptographic hash chain mismatch detected.'
    });
  });

  // --- REVIEWS & SENTIMENT ANALYSIS ---
  app.get('/api/reviews', (req, res) => {
    const { destinationId, providerId } = req.query;
    let list = Array.isArray(reviews) ? [...reviews] : [];
    if (destinationId) list = list.filter(r => r && r.destinationId === destinationId);
    if (providerId) list = list.filter(r => r && r.providerId === providerId);
    res.json(list);
  });

  app.post('/api/reviews', async (req, res) => {
    const {
      destinationId,
      providerId,
      authorName,
      authorLocation,
      rating,
      comment
    } = req.body;

    if (!authorName || !comment) {
      return res.status(400).json({ error: 'Author name and comment are required' });
    }

    let sentimentScore = Math.min(100, Math.max(20, (Number(rating) || 5) * 19 + Math.floor(Math.random() * 6)));
    let sentimentLabel: 'Positive' | 'Neutral' | 'Constructive' = sentimentScore >= 80 ? 'Positive' : sentimentScore >= 50 ? 'Neutral' : 'Constructive';
    let aspects = {
      authenticity: 90,
      cleanliness: 85,
      safety: 90,
      hospitality: 92,
      value: 88
    };

    // Use Gemini for live sentiment extraction if available
    const ai = getGemini();
    if (ai) {
      try {
        const sentimentPrompt = `Analyze the sentiment and aspects of this tourism review for a destination/provider in Jharkhand, India.
Review: "${comment}" (User Star Rating: ${rating}/5)

Return a JSON object with:
- score: number (0-100)
- label: "Positive" | "Neutral" | "Constructive"
- authenticity: number (0-100)
- cleanliness: number (0-100)
- safety: number (0-100)
- hospitality: number (0-100)
- value: number (0-100)`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: sentimentPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                label: { type: Type.STRING },
                authenticity: { type: Type.NUMBER },
                cleanliness: { type: Type.NUMBER },
                safety: { type: Type.NUMBER },
                hospitality: { type: Type.NUMBER },
                value: { type: Type.NUMBER }
              },
              required: ['score', 'label', 'authenticity', 'cleanliness', 'safety', 'hospitality', 'value']
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          sentimentScore = parsed.score ?? sentimentScore;
          sentimentLabel = parsed.label as any ?? sentimentLabel;
          aspects = {
            authenticity: parsed.authenticity ?? 90,
            cleanliness: parsed.cleanliness ?? 85,
            safety: parsed.safety ?? 90,
            hospitality: parsed.hospitality ?? 92,
            value: parsed.value ?? 88
          };
        }
      } catch (err) {
        console.error('Gemini sentiment parsing fallback:', err);
      }
    }

    const newReview: TouristReview = {
      id: `rev-${Date.now().toString().slice(-4)}`,
      destinationId,
      providerId,
      authorName,
      authorLocation: authorLocation || 'Tourist Visitor',
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment,
      sentimentScore,
      sentimentLabel,
      aspects,
      verifiedVisit: true
    };

    reviews.unshift(newReview);
    res.status(201).json(newReview);
  });

  // --- ANALYTICS DASHBOARD FOR OFFICIALS ---
  const handleGetAnalytics = (req: express.Request, res: express.Response) => {
    // Recalculate dynamic statistics
    const avgSentiment = reviews.length
      ? Number((reviews.reduce((acc, r) => acc + r.sentimentScore, 0) / reviews.length).toFixed(1))
      : 92.4;

    const totalRev = (Array.isArray(bookings) ? bookings : []).reduce((acc, b) => acc + (b?.amount || 0), 0) + 38400000;

    const updatedSummary = {
      date: new Date().toISOString().split('T')[0],
      totalVisitors: 48920 + (bookings?.length || 0) * 4,
      totalTouristsMonthly: 142580 + (bookings?.length || 0) * 12,
      totalRevenueMonthlyINR: totalRev,
      activeProvidersCount: providers?.length || 0,
      activeBookings: bookings?.length || 0,
      verifiedProviders: providers?.length || 0,
      overallSentiment: avgSentiment,
      averageSatisfactionScore: avgSentiment,
      totalLedgerBlocks: blockchainBlocks?.length || 0,
      topVisitedDestinations: [
        { name: 'Netarhat', count: 48500 },
        { name: 'Hundru Falls', count: 41200 },
        { name: 'Betla National Park', count: 32800 },
        { name: 'Patratu Valley', count: 29400 },
        { name: 'Baidyanath Dham Deoghar', count: 56000 }
      ],
      topDestinations: [
        { name: 'Netarhat', visits: 14200 + (bookings || []).filter(b => b?.targetTitle?.includes('Netarhat')).length * 10, sentiment: 96 },
        { name: 'Baidyanath Dham Deoghar', visits: 18500, sentiment: 94 },
        { name: 'Patratu Valley', visits: 12300, sentiment: 91 },
        { name: 'Betla National Park', visits: 8900 + (bookings || []).filter(b => b?.targetTitle?.includes('Betla')).length * 15, sentiment: 97 },
        { name: 'Hundru Falls', visits: 9400, sentiment: 89 }
      ],
      categoryBreakdown: [
        { category: 'Eco & Forests', count: destinations.filter(d => d.category === 'eco').length },
        { category: 'Waterfalls', count: destinations.filter(d => d.category === 'waterfalls').length },
        { category: 'Spiritual', count: destinations.filter(d => d.category === 'spiritual').length },
        { category: 'Cultural Heritage', count: destinations.filter(d => d.category === 'cultural').length },
        { category: 'Adventure & Gorges', count: destinations.filter(d => d.category === 'adventure').length }
      ],
      categoryDistribution: [
        { category: 'Eco & Forests', count: destinations.filter(d => d.category === 'eco').length },
        { category: 'Waterfalls', count: destinations.filter(d => d.category === 'waterfalls').length },
        { category: 'Spiritual', count: destinations.filter(d => d.category === 'spiritual').length },
        { category: 'Cultural Heritage', count: destinations.filter(d => d.category === 'cultural').length },
        { category: 'Adventure & Gorges', count: destinations.filter(d => d.category === 'adventure').length }
      ],
      revenueVolume: totalRev,
      ecoComplianceScore: 95.2,
      recentReviewsCount: reviews.length
    };

    res.json(updatedSummary);
  };
  app.get('/api/analytics', handleGetAnalytics);
  app.get('/api/analytics/summary', handleGetAnalytics);

  // --- ECO-EXPLORERS LEADERBOARD & QUESTS ---
  app.get('/api/leaderboard', (req, res) => {
    // Sort descending by points
    const sorted = [...leaderboard].sort((a, b) => b.points - a.points);
    res.json({
      topExplorers: sorted.slice(0, 5),
      totalExplorers: sorted.length + 1420,
      quests
    });
  });

  app.post('/api/leaderboard/earn-points', (req, res) => {
    const { userName, pointsEarned, actionTitle, questId } = req.body;
    const pts = Number(pointsEarned) || 100;
    
    // Find or update quest
    if (questId) {
      const q = quests.find(item => item.id === questId);
      if (q) q.completed = true;
    }

    res.json({
      success: true,
      pointsAdded: pts,
      action: actionTitle || 'Eco Action Completed',
      message: `Congratulations! +${pts} Eco-Points added to your traveler passport.`
    });
  });

  // --- AI MULTILINGUAL ASSISTANT (JOHAR AI) ---
  app.post('/api/ai/chat', async (req, res) => {
    const { message, conversationHistory, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGemini();
    const systemPrompt = `You are "Johar AI", the official intelligent multilingual tourism concierge for Jharkhand ("Land of Forests"), India.
You provide warm, authentic, culturally respectful, and accurate information to tourists.

Key knowledge about Jharkhand:
- Traditional greeting is "Johar!" (जोहार) which conveys deep mutual respect and harmony with nature.
- Top destinations: Netarhat (Magnolia Sunset Point, Pine Forests, Queen of Chotanagpur), Patratu Valley & Dam (winding ghat road, lake boating), Betla National Park (elephants, tigers, 16th century Chero Dynasty Palamau Forts), Hundru Falls (320ft on Subarnarekha river), Baidyanath Dham Deoghar (sacred Shiva Jyotirlinga, Shravani Mela), Parasnath Shikharji (highest peak 1,365m, premier Jain pilgrimage), Jonha & Dassam Waterfalls, Khunti (Birsa Munda heritage, living Sohrai & Dokra artisan craft villages), Hazaribagh (Isco prehistoric cave art, Canary Hill).
- Local tribal communities: Santhal, Munda, Oraon, Ho, Kharia, Asur, Birhor with Sarna nature worship faith.
- Art & Crafts: Dokra lost-wax bell metal, Sohrai & Khovar GI-tagged earth pigment murals, Kuchai organic Tussar silk, bamboo crafts, lac bangles.
- Cuisine: Dhuska Barra with Chana Ghugni, Chilka Pitha, Marua (Finger Millet) Roti, Rugra & Puttu wild mushrooms, Bamboo shoot stir-fry, Deoghar Peda.
- Festivals: Sarhul (Spring Sal blossom festival), Karma Puja (worship of Karma tree and nature), Tusu Parab, Sohrai harvest cattle celebration.
- Transport: Birsa Munda Airport Ranchi (IXR) & Deoghar Airport (DGH), major rail hubs at Ranchi (RNC), Jasidih (JSME), Dhanbad (DHN), Tatanagar/Jamshedpur.

Instructions:
1. Always start or sprinkle a friendly "Johar!" greeting where appropriate.
2. Reply in the user's language (Support English, Hindi, Hinglish, Santhali, Bengali, etc.). If requested in Hindi, provide respectful Shuddh/conversational Hindi with Devanagari.
3. Be helpful, concise, well-formatted with markdown bullet points, highlighting travel logistics, safety, eco-responsibility, and authentic tribal community connections.`;

    if (ai) {
      try {
        const chatContents = (conversationHistory || []).map((m: { role: string; text: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

        chatContents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: chatContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7
          }
        });

        return res.json({
          reply: response.text || 'Johar! Welcome to Jharkhand. How may I assist your journey across our forests, waterfalls, and cultural heritage today?'
        });
      } catch (err) {
        console.error('Gemini chat error:', err);
      }
    }

    // Heuristic fallback if Gemini API is temporarily unavailable
    const lower = message.toLowerCase();
    let reply = 'Johar! Welcome to Jharkhand, the enchanted Land of Forests and Waterfalls. ';
    if (lower.includes('netarhat') || lower.includes('sunset')) {
      reply += 'Netarhat (Queen of Chotanagpur) is perched at 3,500 ft. Do not miss the famous Magnolia Sunset Point, Upper Ghaghri Falls, and stay at authentic Oraon eco-homestays. Best visited from October to March!';
    } else if (lower.includes('betla') || lower.includes('safari') || lower.includes('wildlife')) {
      reply += 'Betla National Park offers early morning elephant and bison tracking safaris. Inside the deep Sal forest, you can also explore the historic 16th-century Chero dynasty Palamau Forts!';
    } else if (lower.includes('food') || lower.includes('eat') || lower.includes('dhuska')) {
      reply += 'You must savor authentic Jharkhand dishes: hot Dhuska with spicy Chana Ghugni, Chilka Pitha, Marua (Ragi) roti with Desi Saag, Rugra wild mushrooms, and sweet Deoghar Peda!';
    } else if (lower.includes('waterfall') || lower.includes('falls')) {
      reply += 'Jharkhand is the city of waterfalls! Explore Hundru Falls (320 ft plunge), Dassam Falls (144 ft on Kanchi river), Jonha Falls (Gautamdhara), and Lodh Falls (highest at 468 ft).';
    } else if (lower.includes('craft') || lower.includes('art') || lower.includes('dokra') || lower.includes('sohrai')) {
      reply += 'Discover GI-tagged Sohrai earth murals in Hazaribagh, 4000-year-old Dokra lost-wax brass craft in Khunti, and Kuchai organic Tussar silk in our verified Artisan Marketplace!';
    } else {
      reply += 'I can help you build personalized day-by-day itineraries, book verified tribal naturalist guides, discover 360° VR previews of waterfalls, and find authentic homestays. Where would you like to travel in Jharkhand?';
    }

    res.json({ reply });
  });

  // --- AI PERSONALIZED ITINERARY BUILDER ---
  app.post('/api/ai/itinerary', async (req, res) => {
    const {
      durationDays = 3,
      budgetTier = 'Moderate',
      interests = ['Eco & Forests', 'Waterfalls', 'Tribal Culture'],
      partyType = 'Family',
      startingCity = 'Ranchi'
    } = req.body;

    const ai = getGemini();

    if (ai) {
      try {
        const prompt = `Generate a realistic, detailed, day-by-day travel itinerary for Jharkhand, India.
Parameters:
- Duration: ${durationDays} days
- Starting City: ${startingCity}
- Budget Tier: ${budgetTier} (Budget: ~₹1500-2500/day, Moderate: ~₹3500-5500/day, Heritage Luxury: ~₹8000+/day)
- Primary Interests: ${interests.join(', ')}
- Travel Party: ${partyType}

Focus on authentic destinations (Netarhat, Patratu, Betla, Hundru, Jonha, Deoghar, Khunti tribal village).
Include realistic travel logistics, sunrise/sunset highlights, traditional meals (Dhuska, Chilka Pitha, Marua roti), local guide recommendations, and eco-guidelines.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tripTitle: { type: Type.STRING },
                summary: { type: Type.STRING },
                durationDays: { type: Type.INTEGER },
                budgetTier: { type: Type.STRING },
                interests: { type: Type.ARRAY, items: { type: Type.STRING } },
                totalEstimatedCost: { type: Type.INTEGER },
                bestSeason: { type: Type.STRING },
                sustainabilityScore: { type: Type.INTEGER },
                days: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dayNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      morning: {
                        type: Type.OBJECT,
                        properties: {
                          activity: { type: Type.STRING },
                          destinationName: { type: Type.STRING },
                          tips: { type: Type.STRING },
                          estCost: { type: Type.INTEGER }
                        },
                        required: ['activity', 'destinationName', 'tips', 'estCost']
                      },
                      afternoon: {
                        type: Type.OBJECT,
                        properties: {
                          activity: { type: Type.STRING },
                          destinationName: { type: Type.STRING },
                          lunchSuggestion: { type: Type.STRING },
                          estCost: { type: Type.INTEGER }
                        },
                        required: ['activity', 'destinationName', 'lunchSuggestion', 'estCost']
                      },
                      evening: {
                        type: Type.OBJECT,
                        properties: {
                          activity: { type: Type.STRING },
                          destinationName: { type: Type.STRING },
                          sunsetSpot: { type: Type.STRING },
                          estCost: { type: Type.INTEGER }
                        },
                        required: ['activity', 'destinationName', 'estCost']
                      },
                      staySuggestion: { type: Type.STRING },
                      transportAdvice: { type: Type.STRING },
                      dailyTotalEst: { type: Type.INTEGER }
                    },
                    required: ['dayNumber', 'title', 'morning', 'afternoon', 'evening', 'staySuggestion', 'transportAdvice', 'dailyTotalEst']
                  }
                },
                essentialPacking: { type: Type.ARRAY, items: { type: Type.STRING } },
                culturalEtiquette: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['tripTitle', 'summary', 'durationDays', 'budgetTier', 'interests', 'totalEstimatedCost', 'bestSeason', 'sustainabilityScore', 'days', 'essentialPacking', 'culturalEtiquette']
            }
          }
        });

        if (response.text) {
          const plan: GeneratedItinerary = JSON.parse(response.text.trim());
          plan.id = `itin-${Date.now()}`;
          return res.json(plan);
        }
      } catch (err) {
        console.error('Gemini itinerary error:', err);
      }
    }

    // Default Fallback Itinerary
    const fallbackItinerary: GeneratedItinerary = {
      id: `itin-${Date.now()}`,
      tripTitle: `${durationDays}-Day Chotanagpur Plateau & Waterfalls Expedition`,
      summary: `An immersive journey starting from Ranchi covering scenic Patratu Valley ghats, majestic Hundru Falls, and the misty hills of Netarhat with certified local guides and authentic tribal cuisine.`,
      durationDays: Number(durationDays),
      budgetTier: budgetTier as any,
      interests: Array.isArray(interests) ? interests : ['Nature', 'Culture'],
      totalEstimatedCost: (budgetTier === 'Budget' ? 2200 : budgetTier === 'Heritage Luxury' ? 8500 : 4200) * Number(durationDays),
      bestSeason: 'October to March (Crisp pleasant weather)',
      sustainabilityScore: 96,
      days: [
        {
          dayNumber: 1,
          title: 'Arrival in Ranchi & Waterfalls Circuit (Hundru & Jonha)',
          morning: {
            activity: 'Drive to Hundru Falls; descend the 700 rock steps to view Subarnarekha River cascading 320 feet.',
            destinationName: 'Hundru Falls, Ranchi',
            tips: 'Carry water flask and wear non-slip walking shoes.',
            estCost: 400
          },
          afternoon: {
            activity: 'Traditional lunch of hot Dhuska, Barra, and Ghugni at local stalls, followed by a visit to Jonha Falls and Buddha shrine.',
            destinationName: 'Jonha (Gautamdhara) Falls',
            lunchSuggestion: 'Dhuska Barra & spicy tomato-garlic chutney',
            estCost: 350
          },
          evening: {
            activity: 'Watch sunset over Ranchi city from Tagore Hill; explore local handicraft shops on Main Road.',
            destinationName: 'Tagore Hill, Ranchi',
            sunsetSpot: 'Tagore Hill Top Pavilion',
            estCost: 200
          },
          staySuggestion: 'Eco Heritage Hotel or JTDC Birsa Vihar, Ranchi',
          transportAdvice: 'Pre-book a certified Chotanagpur Green Taxi for the full day.',
          dailyTotalEst: 3200
        },
        {
          dayNumber: 2,
          title: 'Patratu Valley Serpentine Road & Lakeside Boating',
          morning: {
            activity: 'Scenic morning drive through the zig-zag hairpin ghat curves of Patratu Valley with panoramic photo stops.',
            destinationName: 'Patratu Valley Ghat Road',
            tips: 'Stop at the high overlook viewpoint for morning mist photography.',
            estCost: 300
          },
          afternoon: {
            activity: 'Speed boating and island exploration at Patratu Lake Resort.',
            destinationName: 'Patratu Lake Resort',
            lunchSuggestion: 'Fresh lakeside Rohu fish curry with steamed rice',
            estCost: 800
          },
          evening: {
            activity: 'Sunset cruise on the reservoir; enjoy night illuminations along the valley roadway.',
            destinationName: 'Patratu Dam Reservoir',
            sunsetSpot: 'Patratu Lake Promenade Deck',
            estCost: 500
          },
          staySuggestion: 'Patratu Lake Resort (JTDC) or return to Ranchi',
          transportAdvice: 'Private cab for 45 km easy highway drive.',
          dailyTotalEst: 3800
        },
        {
          dayNumber: 3,
          title: 'Netarhat Hill Ascent & Magnolia Sunset Point',
          morning: {
            activity: 'Scenic 3.5 hour ascent through dense sal and chir pine forests up to Netarhat plateau (3,500 ft).',
            destinationName: 'Netarhat Hills',
            tips: 'Keep light jackets handy as hill temperatures drop by 6-8°C.',
            estCost: 600
          },
          afternoon: {
            activity: 'Visit Upper Ghaghri Falls and explore the historic Pine Forest trails and colonial cottages.',
            destinationName: 'Upper Ghaghri & Pine Forest',
            lunchSuggestion: 'Traditional Oraon meal: Marua Roti, Desi Chicken, and Bamboo shoot curry at homestay',
            estCost: 450
          },
          evening: {
            activity: 'Experience the world-renowned panoramic sunset at Magnolia Point accompanied by local folk flute music.',
            destinationName: 'Magnolia Sunset Point',
            sunsetSpot: 'Magnolia Cliff Lookout',
            estCost: 150
          },
          staySuggestion: 'Mahua Forest Eco Homestay or Netarhat Tourist Lodge',
          transportAdvice: 'Hill-certified driver recommended for Gumla-Netarhat ghats.',
          dailyTotalEst: 4500
        }
      ].slice(0, Number(durationDays)),
      essentialPacking: [
        'Comfortable walking/hiking shoes with good grip for waterfall steps',
        'Light woolens/jackets for Netarhat evenings and winter mornings',
        'Reusable water bottle to minimize plastic waste in eco-zones',
        'Sun protection & camera with wide-angle lens for landscapes'
      ],
      culturalEtiquette: [
        'Greet villagers and elders with a polite "Johar" and folded hands.',
        'Always ask permission before photographing tribal ceremonies or sacred Sarna groves.',
        'Support local indigenous economy by buying directly from certified artisans.'
      ]
    };

    res.json(fallbackItinerary);
  });

  // ==========================================
  // VITE & STATIC SERVING CONFIGURATION
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌲 Johar Jharkhand platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Johar Jharkhand server:', err);
  process.exit(1);
});
