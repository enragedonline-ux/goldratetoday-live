export type City = {
  slug: string;
  city: string;
  state: string;
  tier: 1 | 2;
  note: string;
  neighbours: string[];
};

export const CITIES: City[] = [
  { slug: "bangalore", city: "Bangalore", state: "Karnataka", tier: 1, note: "A large jewellery-buying city, with busy shopping streets where gold is bought for weddings, festivals and everyday wear.", neighbours: ["mysore", "chennai", "hyderabad"] },
  { slug: "hyderabad", city: "Hyderabad", state: "Telangana", tier: 1, note: "Known for its old jewellery quarters and a strong tradition of buying gold for weddings and family occasions.", neighbours: ["vijayawada", "bangalore", "nagpur"] },
  { slug: "delhi", city: "Delhi", state: "Delhi", tier: 1, note: "A huge retail market for gold, with buyers ranging from first-time buyers to families buying for weddings.", neighbours: ["patna", "bhopal", "indore"] },
  { slug: "mumbai", city: "Mumbai", state: "Maharashtra", tier: 1, note: "One of India's biggest gold markets, where demand stays high through the wedding season and festivals.", neighbours: ["pune", "nashik", "nagpur"] },
  { slug: "chennai", city: "Chennai", state: "Tamil Nadu", tier: 1, note: "A city where gold jewellery is part of daily life and weddings, and where 22K is the usual choice.", neighbours: ["coimbatore", "madurai", "bangalore"] },
  { slug: "pune", city: "Pune", state: "Maharashtra", tier: 1, note: "A fast-growing city with a busy jewellery trade serving both local families and buyers from nearby towns.", neighbours: ["mumbai", "nashik", "nagpur"] },
  { slug: "ahmedabad", city: "Ahmedabad", state: "Gujarat", tier: 2, note: "A major trading city in Gujarat, where gold is bought for weddings, festivals and as a family store of value.", neighbours: ["surat", "mumbai", "indore"] },
  { slug: "kolkata", city: "Kolkata", state: "West Bengal", tier: 2, note: "A city with a long jewellery tradition, where fine gold work and wedding jewellery are bought year-round.", neighbours: ["patna", "bhubaneswar", "delhi"] },
  { slug: "patna", city: "Patna", state: "Bihar", tier: 2, note: "A growing market where gold buying peaks around weddings and festivals, and buyers compare rates carefully.", neighbours: ["kolkata", "delhi", "bhubaneswar"] },
  { slug: "bhubaneswar", city: "Bhubaneswar", state: "Odisha", tier: 2, note: "A rising jewellery market in Odisha, with demand driven by weddings, festivals and family savings.", neighbours: ["kolkata", "patna", "hyderabad"] },
  { slug: "coimbatore", city: "Coimbatore", state: "Tamil Nadu", tier: 2, note: "A well-known jewellery manufacturing and retail centre in Tamil Nadu, serving buyers across the region.", neighbours: ["chennai", "madurai", "mysore"] },
  { slug: "mysore", city: "Mysore", state: "Karnataka", tier: 2, note: "A historic city where gold jewellery is bought for weddings and festivals, and where silk and gold go together.", neighbours: ["bangalore", "coimbatore", "chennai"] },
  { slug: "surat", city: "Surat", state: "Gujarat", tier: 2, note: "A diamond and textile hub where gold jewellery is also bought in large volumes for weddings.", neighbours: ["ahmedabad", "mumbai", "nashik"] },
  { slug: "bhopal", city: "Bhopal", state: "Madhya Pradesh", tier: 2, note: "A steady jewellery market in central India, with buying concentrated around weddings and festivals.", neighbours: ["indore", "nagpur", "delhi"] },
  { slug: "vijayawada", city: "Vijayawada", state: "Andhra Pradesh", tier: 2, note: "A busy commercial city in Andhra Pradesh where gold is a common wedding and festival purchase.", neighbours: ["hyderabad", "chennai", "bhubaneswar"] },
  { slug: "madurai", city: "Madurai", state: "Tamil Nadu", tier: 2, note: "A temple city with a deep jewellery tradition, where gold is bought for weddings and temple occasions.", neighbours: ["chennai", "coimbatore", "bangalore"] },
  { slug: "indore", city: "Indore", state: "Madhya Pradesh", tier: 2, note: "The commercial centre of Madhya Pradesh, with a busy jewellery trade serving the whole region.", neighbours: ["bhopal", "ahmedabad", "delhi"] },
  { slug: "nagpur", city: "Nagpur", state: "Maharashtra", tier: 2, note: "A central-India trading city where gold buying follows the wedding season and festival calendar.", neighbours: ["pune", "mumbai", "hyderabad"] },
  { slug: "nashik", city: "Nashik", state: "Maharashtra", tier: 2, note: "A growing city in Maharashtra where gold is bought for weddings, festivals and family occasions.", neighbours: ["mumbai", "pune", "surat"] },
  { slug: "kerala", city: "Kerala", state: "Kerala", tier: 2, note: "In Kerala, gold is bought by weight in pavans as well as grams, and wedding jewellery is often bought in 22K.", neighbours: ["coimbatore", "madurai", "bangalore"] },
];

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export function cityUrl(c: City): string {
  return `/gold-rate-today-in-${c.slug}/`;
}
