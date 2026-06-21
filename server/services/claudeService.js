const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL        = 'llama-3.3-70b-versatile';
const VISION_MODEL = 'llama-3.2-11b-vision-preview';

// ── 1. Price Comparison ─────────────────────────────────────────────────────
const PRICE_SYSTEM = `You are MedSave, a highly accurate medicine price comparison assistant for Indian consumers.
Your goal is to provide realistic, mathematically consistent pricing across Indian pharmacies.
Follow these rules strictly to ensure maximum accuracy:
1. First, determine the standard branded MRP (Maximum Retail Price) for the given medicine in India.
2. Set the "Local Medical Shop" price to exactly this branded MRP (zero discount).
3. Set the "Jan Aushadhi (PMBJP)" price to exactly 30% to 35% of the branded MRP (rounded to the nearest rupee). If you know the exact PMBJP price list price, use it, but it must never exceed 35% of the branded MRP.
4. Set online pharmacy prices (PharmEasy, Tata 1mg, Amazon Pharmacy) to be exactly 15% to 22% off the branded MRP.
5. Set pharmacy chains (Apollo, MedPlus) to be exactly 10% to 15% off the branded MRP.
6. Make sure all generated source prices are mathematically logical: Jan Aushadhi (cheapest) < Tata 1mg < PharmEasy < Amazon < Apollo < MedPlus < Local Shop (MRP).
7. For each source, generate:
   - "matchingTitle": How this product is named on their store (e.g. generic name on Jan Aushadhi, branded name on Apollo).
   - "deliveryCost": Realistic shipping cost (e.g. "Free", "₹40", "₹35", "Store pickup only").
   - "deliveryTime": Realistic delivery speed (e.g. "2 hours", "Next day", "1-2 days", "Immediate").

Return ONLY valid JSON. No markdown. No explanation. Structure:
{
  "medicine": "Full name with strength",
  "genericName": "Active ingredient",
  "category": "Drug category",
  "stripQty": "e.g. 10 tablets",
  "sources": [
    { "name": "Jan Aushadhi (PMBJP)", "emoji": "🏛️", "type": "govt", "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "Government generic scheme" },
    { "name": "Apollo Pharmacy",      "emoji": "🔵", "type": "chain",  "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "With loyalty discount" },
    { "name": "MedPlus",              "emoji": "🟢", "type": "chain",  "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "MedPlus selling price" },
    { "name": "PharmEasy (Online)",   "emoji": "📦", "type": "online", "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "Online with standard discount" },
    { "name": "Tata 1mg",             "emoji": "🧡", "type": "online", "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "1mg app price with code" },
    { "name": "Amazon Pharmacy",      "emoji": "🛒", "type": "online", "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "Prime discount price" },
    { "name": "Justdial (Suppliers)", "emoji": "📞", "type": "online", "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "Directory average quote" },
    { "name": "Official Brand Site",  "emoji": "🌐", "type": "brand",  "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "Manufacturer direct MRP" },
    { "name": "Local Medical Shop",   "emoji": "🏪", "type": "local",  "price": <INR>, "mrp": <INR>, "matchingTitle": "String", "deliveryCost": "String", "deliveryTime": "String", "note": "Full MRP, no discount" }
  ],
  "aiPriceAnalysis": "A 2-3 sentence sharp, comparative analysis of the cheapest choices among the top 5, detailing specific savings and shipping vs. pickup trade-offs.",
  "awarenessTips": ["tip1", "tip2", "tip3"],
  "consumerNote": "One sentence on patient rights"
}`;

async function getPriceComparison(medicineName, liveData = null) {
  let userContent = `Compare prices for: ${medicineName}`;
  
  if (liveData && liveData.found) {
    userContent += `\n\nHere is verified real-time pricing data from online search for this medicine to ensure 100% accuracy:
- Brand Name: ${liveData.name}
- Brand MRP: ${liveData.mrp} INR (Local Medical Shop price)
- PharmEasy Selling Price: ${liveData.salePrice} INR (PharmEasy price)
- Active Generic Ingredient: ${liveData.moleculeName}
- Packaging/Qty: ${liveData.stripQty}
${liveData.substitute ? `- Cheaper Alternative Generic/Brand: ${liveData.substitute.name} (MRP: ${liveData.substitute.mrp} INR, Price: ${liveData.substitute.salePrice} INR)` : ''}

CRITICAL RULES FOR ACCURACY:
1. You must use the exact Brand Name ("${liveData.name}") as the "medicine" field in the output JSON.
2. You must use the exact Active Generic Ingredient ("${liveData.moleculeName}") as the "genericName" field.
3. You must use the exact Packaging/Qty ("${liveData.stripQty}") as the "stripQty" field.
4. Set the "Local Medical Shop" price to exactly the Brand MRP (${liveData.mrp} INR) with zero discount.
5. Set the "PharmEasy (Online)" price to exactly ${liveData.salePrice} INR and its mrp to exactly ${liveData.mrp} INR.
6. Calculate other pharmacy prices relative to the brand MRP of ${liveData.mrp} INR using these formulas:
   - Jan Aushadhi (PMBJP): Exactly 30% to 35% of the Brand MRP. If you know the exact Jan Aushadhi price list value, use it, but it must be within 30-35% of the Brand MRP.
   - Tata 1mg: Exactly 15% to 22% off the Brand MRP.
   - Amazon Pharmacy: Exactly 15% to 22% off the Brand MRP.
   - Apollo Pharmacy: Exactly 10% to 15% off the Brand MRP.
   - MedPlus: Exactly 10% to 15% off the Brand MRP.
   - Justdial: Exactly 5% to 10% off the Brand MRP.
   - Official Brand Site: Exactly the Brand MRP.
7. For each source, generate a realistic "matchingTitle" (how this product is named on their store), a "deliveryCost" (e.g. "Free", "₹40", or "₹35"), and a "deliveryTime" (e.g. "1-2 days", "2 hours", "Next day", "Store pickup only").
8. Ensure the mathematical sequence holds: Jan Aushadhi < Tata 1mg < PharmEasy < Amazon < Apollo < MedPlus < Local Shop.`;
  } else {
    userContent += `\n\n(No live search data was found. Please estimate the standard Indian branded MRP for this medicine, set Local Medical Shop to MRP, Jan Aushadhi to 30-35% of MRP, online pharmacies to 15-22% off MRP, and pharmacy chains to 10-15% off MRP. Generate realistic matching titles, delivery costs, and delivery times for each source.)`;
  }

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    max_tokens: 1800,
    messages: [
      { role: 'system', content: PRICE_SYSTEM },
      { role: 'user', content: userContent },
    ],
  });
  const raw = completion.choices[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── 2. Advisor Analysis ─────────────────────────────────────────────────────
const ADVISOR_SYSTEM = `You are a senior product strategist specialising in Indian healthtech and consumer apps.
Return ONLY valid JSON with this structure:
{
  "summary": "2-3 sentence sharp product summary",
  "impact": "One sentence on social/financial impact",
  "features": [
    { "rank": 1, "icon": "emoji", "title": "Feature name", "description": "2 sentences", "priority": "High|Medium|Low", "effort": "Low|Medium|High", "impact": "High|Medium|Low" }
  ]
}
Return exactly 8 features ranked by importance. Be specific to MedSave.`;

async function getAdvisorAnalysis() {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.5,
    max_tokens: 2000,
    messages: [
      { role: 'system', content: ADVISOR_SYSTEM },
      { role: 'user', content: 'Analyse the MedSave app idea and give me the top 8 features to build.' },
    ],
  });
  const raw = completion.choices[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── 3. Generic Alternatives ─────────────────────────────────────────────────
const GENERIC_SYSTEM = `Return ONLY a JSON array of generic alternatives for the given branded medicine (Indian market).
Format: [{ "genericName": "...", "activeIngredient": "...", "estimatedPrice": <INR>, "availability": "Jan Aushadhi / General", "savingsVsBranded": "X% cheaper" }]
Limit to 4 alternatives. Return ONLY the JSON array.`;

async function getGenericAlternatives(medicineName) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    max_tokens: 800,
    messages: [
      { role: 'system', content: GENERIC_SYSTEM },
      { role: 'user', content: `Generic alternatives for: ${medicineName}` },
    ],
  });
  const raw = completion.choices[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── 4. Symptom Check ────────────────────────────────────────────────────────
const SYMPTOM_SYSTEM = `You are a helpful Indian pharmacy assistant. Given a symptom, suggest 3 common safe OTC medicines available in India.
Return ONLY JSON array:
[{ "name": "Medicine name + strength", "use": "What it treats", "safeOTC": true, "disclaimer": "Consult doctor if symptoms persist" }]
Never diagnose. Only suggest common OTC medicines. Return ONLY the JSON array.`;

async function getSymptomSuggestions(symptom) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    max_tokens: 600,
    messages: [
      { role: 'system', content: SYMPTOM_SYSTEM },
      { role: 'user', content: `Symptom: ${symptom}` },
    ],
  });
  const raw = completion.choices[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

// ── 5. Streaming Advisor ────────────────────────────────────────────────────
async function streamAdvisorAnalysis(medicineName, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const stream = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 500,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are MedSave's price trend expert. Write 3-4 sentences explaining why ${medicineName || 'this medicine'} is priced the way it is in India, what factors affect its price, and which government schemes help reduce cost. Be informative and consumer-friendly.`,
      },
      { role: 'user', content: `Explain price trends for: ${medicineName}` },
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
    }
  }
  res.write('data: [DONE]\n\n');
  res.end();
}

// ── 6. Chat ─────────────────────────────────────────────────────────────────
const CHAT_SYSTEM = `You are MedSave Assistant, helping Indian consumers find affordable medicines.
You know about Jan Aushadhi PMBJP scheme, generic medicines, and pharmacy pricing in India.
Be concise, helpful, and always suggest checking Jan Aushadhi for savings. Keep replies under 3 sentences.`;

async function getChatResponse(messages) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: 'system', content: CHAT_SYSTEM }, ...messages],
  });
  return completion.choices[0]?.message?.content || '';
}

// ── 7. Prescription Reader (Vision) ─────────────────────────────────────────
async function readPrescription(base64Image, mediaType = 'image/jpeg') {
  const completion = await groq.chat.completions.create({
    model: VISION_MODEL,
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mediaType};base64,${base64Image}` },
          },
          {
            type: 'text',
            text: 'You are a pharmacy assistant. Extract all medicine names and dosages from this prescription image. Return ONLY JSON: [{ "name": "...", "dosage": "...", "frequency": "..." }]',
          },
        ],
      },
    ],
  });
  const raw = completion.choices[0]?.message?.content || '';
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

module.exports = {
  getPriceComparison,
  getAdvisorAnalysis,
  getGenericAlternatives,
  getSymptomSuggestions,
  streamAdvisorAnalysis,
  getChatResponse,
  readPrescription,
};
