/**
 * BAGÉRA - Product Data & Catalog
 * All prices strictly in INR (₹50 - ₹199)
 */

const BAGERA_PRODUCTS = [
  {
    id: "bag-1",
    name: "Cherry Pop Mini Bag",
    price: 199,
    category: "Mini Bags",
    badge: "BESTSELLER",
    isNew: false,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-cherry-mini.svg",
    description: "Our signature micro carry in rich cherry patent gloss. Handcrafted with gold-toned clasp, structured rounded corners, and detachable strap.",
    details: ["Premium vegan patent leather", "Twist-lock cherry gold clasp", "Dimensions: 14cm x 11cm x 6cm", "Fits cards, keys & lip gloss"],
    colors: ["#8F1728", "#44121D", "#F3D9D7"]
  },
  {
    id: "bag-2",
    name: "Everyday Canvas Tote",
    price: 149,
    category: "Tote Bags",
    badge: "BESTSELLER",
    isNew: false,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-canvas-tote.svg",
    description: "Heavyweight 16oz organic ivory canvas with contrast cherry-red handles. Built for farmer's markets, library runs, and lazy Sunday strolls.",
    details: ["100% organic cotton canvas", "Reinforced double handles", "Dimensions: 38cm x 36cm x 12cm", "Interior zip pocket for phone"],
    colors: ["#FFF8F2", "#8F1728"]
  },
  {
    id: "bag-3",
    name: "Blush Mood Shoulder Bag",
    price: 199,
    category: "Shoulder Bags",
    badge: "NEW",
    isNew: true,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-blush-shoulder.svg",
    description: "Y2K nostalgia redefined. Curvy baguette silhouette in soft blush with subtle contrast burgundy piped trim and comfortable under-arm fit.",
    details: ["Silky matte vegan leather", "Concealed magnetic flap", "Dimensions: 26cm x 13cm x 5cm", "Smooth glide zipper interior"],
    colors: ["#F3D9D7", "#E9BFC2", "#8F1728"]
  },
  {
    id: "bag-4",
    name: "Little Things Sling Bag",
    price: 179,
    category: "Sling Bags",
    badge: "TRENDING",
    isNew: false,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-sling-little.svg",
    description: "A half-moon crossbody designed for hands-free adventures. Features an adjustable strap, brass ring lock, and buttery smooth texture.",
    details: ["Soft pebble grain finish", "Adjustable 120cm shoulder strap", "Dimensions: 21cm x 15cm x 6cm", "Scratch-resistant lining"],
    colors: ["#8F1728", "#25191B", "#FFF8F2"]
  },
  {
    id: "bag-5",
    name: "Sunday Mini Tote",
    price: 129,
    category: "Tote Bags",
    badge: "",
    isNew: false,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-sunday-tote.svg",
    description: "Compact pleated cream tote with structured round handle and removable cherry silk-feel twilly scarf.",
    details: ["Pleated vegan nappa leather", "Includes removable scarf charm", "Dimensions: 20cm x 18cm x 8cm", "Magnetic snap closure"],
    colors: ["#FFF8F2", "#F3D9D7"]
  },
  {
    id: "bag-6",
    name: "Classic Daily Carry",
    price: 199,
    category: "Everyday Bags",
    badge: "STUDIO PICK",
    isNew: false,
    image: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-classic-daily.svg",
    description: "Deep burgundy structured satchel with top handle and gold turn-lock. Elegant enough for meetings, cute enough for iced coffee dates.",
    details: ["Architectural box structure", "Dual carry: top handle & cross strap", "Dimensions: 24cm x 19cm x 9cm", "Gold-plated brass hardware"],
    colors: ["#44121D", "#25191B", "#8F1728"]
  },
  {
    id: "bag-7",
    name: "Pocket-Sized Cutie",
    price: 99,
    category: "Mini Bags",
    badge: "NEW",
    isNew: true,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-pocket-cutie.svg",
    description: "The sweetest micro handbag with freshwater-style imitation pearls and gold heart clasp. Big main character energy in a pocket size.",
    details: ["Pearlescent blush body", "Faux-pearl beaded arch handle", "Dimensions: 11cm x 9cm x 4cm", "Includes gold cable chain"],
    colors: ["#8F1728", "#F3D9D7"]
  },
  {
    id: "bag-8",
    name: "The Weekend Bag",
    price: 199,
    category: "Shoulder Bags",
    badge: "BESTSELLER",
    isNew: false,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-weekend.svg",
    description: "Slouchy hobo shoulder carry with custom luggage charm. Generous capacity that holds books, cosmetic pouch, and your favorite water bottle.",
    details: ["Ultra-soft slouch leatherette", "Reinforced wide strap", "Dimensions: 32cm x 24cm x 11cm", "Zip top closure with tassel"],
    colors: ["#44121D", "#8F1728", "#FFF8F2"]
  },
  {
    id: "bag-9",
    name: "Caramel Croc Baguette",
    price: 189,
    category: "Shoulder Bags",
    badge: "NEW",
    isNew: true,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-blush-shoulder.svg",
    description: "Embossed croc-texture baguette in warm sunset glaze. Clean lines and minimalist metallic eyelet detailing.",
    details: ["Embossed crocodile grain", "Slim under-shoulder profile", "Dimensions: 27cm x 14cm x 6cm", "Satin interior lining"],
    colors: ["#8F1728", "#D4A373"]
  },
  {
    id: "bag-10",
    name: "Sweet Peach Crossbody",
    price: 169,
    category: "Sling Bags",
    badge: "",
    isNew: false,
    image: "https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-sling-little.svg",
    description: "Soft peach-blush camera bag style crossbody with double zip compartments and front slip pocket for quick phone access.",
    details: ["Double zip-around design", "Webbed interchangeable strap", "Dimensions: 20cm x 13cm x 7cm", "Water-resistant exterior"],
    colors: ["#F3D9D7", "#E9BFC2"]
  },
  {
    id: "bag-11",
    name: "Noir Velvet Daily Satchel",
    price: 199,
    category: "Everyday Bags",
    badge: "STUDIO PICK",
    isNew: false,
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=700&q=80",
    fallbackImage: "assets/images/bag-classic-daily.svg",
    description: "Midnight noir with rich burgundy interior lining and gleaming gold-toned turnlock. A true daily staple.",
    details: ["Structured box silhouette", "Protective metal feet base", "Dimensions: 25cm x 18cm x 10cm", "Dual internal organizer slots"],
    colors: ["#25191B", "#44121D"]
  },
  {
    id: "bag-12",
    name: "Parisian Cherry Charm",
    price: 89,
    category: "Cute Accessories",
    badge: "HOT",
    isNew: true,
    image: "assets/images/category-accessories.svg",
    fallbackImage: "assets/images/category-accessories.svg",
    description: "Dangling cherry bag charm with polished gold ring, baby pink silk bow, and enameled cherry twin fruit.",
    details: ["Enamel finish with gold plating", "Easy spring-clip attachment", "Length: 12cm", "Fits any bag loop or zipper pull"],
    colors: ["#8F1728", "#E9BFC2"]
  }
];

/**
 * THE STICKER CLUB & ACCESSORIES
 * Differentiating Pinterest aesthetic sticker packs & single stickers (₹50 - ₹99)
 */
const BAGERA_STICKERS = [
  {
    id: "pack-1",
    name: "Cute Chaos Sticker Pack",
    price: 79,
    category: "Sticker Pack",
    badge: "FAN FAVOURITE",
    image: "assets/images/pack-cute-chaos.svg",
    fallbackImage: "assets/images/pack-cute-chaos.svg",
    packName: "Cute Chaos",
    count: "6 Die-Cut Stickers",
    description: "A riot of cherries, retro bows, and doodles designed to stick on your notebook, laptop, phone case or tote clip.",
    stickersIncluded: ["Cherry Twin Hearts", "Soft Ribbon Bow", "Retro Daisy Smiley", "Sparkle Gold Star", "Studio Heart", "Bagéra Stamp"]
  },
  {
    id: "pack-2",
    name: "Main Character Energy Pack",
    price: 89,
    category: "Sticker Pack",
    badge: "BESTSELLER",
    image: "assets/images/pack-main-character.svg",
    fallbackImage: "assets/images/pack-main-character.svg",
    packName: "Main Character Energy",
    count: "8 Holographic Stickers",
    description: "Bold, sassy, and unmistakably iconic. Holographic glossy finishes that catch the golden-hour light.",
    stickersIncluded: ["'Main Character' Banner", "Disco Sparkle Star", "Iconic Red Heart", "Mini Coffee Cup", "Boujee Bagéra", "Lucky 777", "Cherry Pop", "Mirror Selfie Doodle"]
  },
  {
    id: "pack-3",
    name: "Little Happy Things Pack",
    price: 69,
    category: "Sticker Pack",
    badge: "SWEET PICK",
    image: "assets/images/pack-happy-things.svg",
    fallbackImage: "assets/images/pack-happy-things.svg",
    packName: "Little Happy Things",
    count: "5 Pastel Matte Stickers",
    description: "Soothing blush and warm ivory aesthetics: iced matcha cups, baby florals, smiling clouds and soft morning vibes.",
    stickersIncluded: ["Iced Matcha Cup", "Blush Daisy", "Pastel Sun", "Smiling Cloud", "'Carry Your World' Note"]
  },
  // Individual Stickers
  {
    id: "stk-1",
    name: "Cherry Twin Hearts Die-Cut",
    price: 50,
    category: "Sticker",
    badge: "POPULAR",
    image: "assets/images/sticker-cherries.svg",
    fallbackImage: "assets/images/sticker-cherries.svg",
    description: "Die-cut glossy waterproof vinyl sticker with thick white border. Safe for water bottles, laptops and phone cases.",
    count: "1 Premium Die-Cut",
    size: "6.5cm x 6.5cm"
  },
  {
    id: "stk-2",
    name: "Blush Silk Ribbon Bow",
    price: 55,
    category: "Sticker",
    badge: "",
    image: "assets/images/sticker-bow.svg",
    fallbackImage: "assets/images/sticker-bow.svg",
    description: "Coquette-aesthetic baby pink ribbon bow sticker with cherry red accents and subtle satin sheen.",
    count: "1 Die-Cut Sticker",
    size: "7cm x 5.5cm"
  },
  {
    id: "stk-3",
    name: "Retro Daisy Smiley Flower",
    price: 50,
    category: "Sticker",
    badge: "",
    image: "assets/images/sticker-flower.svg",
    fallbackImage: "assets/images/sticker-flower.svg",
    description: "Blush petals with a smiling cherry heart center. Brings instant sunshine to any surface.",
    count: "1 Matte Vinyl Sticker",
    size: "6cm x 6cm"
  },
  {
    id: "stk-4",
    name: "Lucky Disco Sparkle Star",
    price: 55,
    category: "Sticker",
    badge: "SPARKLE",
    image: "assets/images/sticker-star.svg",
    fallbackImage: "assets/images/sticker-star.svg",
    description: "Gold starburst sticker with shimmering facets and cute retro twinkle sparkles.",
    count: "1 Glossy Die-Cut",
    size: "6cm x 6cm"
  },
  {
    id: "stk-5",
    name: "Bagéra Studio Boujee Heart",
    price: 50,
    category: "Sticker",
    badge: "",
    image: "assets/images/sticker-heart.svg",
    fallbackImage: "assets/images/sticker-heart.svg",
    description: "Deep burgundy and cherry red monogram candy heart with 'Bagéra Little Love' inscription.",
    count: "1 Vinyl Sticker",
    size: "6.5cm x 6cm"
  },
  {
    id: "stk-6",
    name: "Iced Matcha Latte Cup",
    price: 50,
    category: "Sticker",
    badge: "FAVE",
    image: "assets/images/sticker-coffee.svg",
    fallbackImage: "assets/images/sticker-coffee.svg",
    description: "Layered matcha latte takeaway cup with cherry-red straw and sleeve heart. The ultimate cafe-hopper badge.",
    count: "1 Die-Cut Sticker",
    size: "5.5cm x 7.5cm"
  }
];

// Combine all catalog items for unified search/lookups
const ALL_CATALOG_ITEMS = [...BAGERA_PRODUCTS, ...BAGERA_STICKERS];
