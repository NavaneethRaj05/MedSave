const axios = require('axios');

/**
 * Fetch live medicine details from PharmEasy search API to ground comparative pricing.
 * @param {string} query - The name of the medicine.
 * @returns {Promise<Object|null>} - Returns structured live medicine data or null.
 */
async function fetchLiveMedicineData(query) {
  if (!query || !query.trim()) return null;
  
  try {
    const url = `https://pharmeasy.in/api/search/search/?q=${encodeURIComponent(query.trim())}`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://pharmeasy.in/'
      },
      timeout: 5000 // 5 seconds timeout
    });

    const products = res.data?.data?.products || [];
    if (products.length === 0) {
      return null;
    }

    // Get the first matching product (most relevant search match)
    const prod = products[0];
    
    // Extract key details
    const result = {
      found: true,
      name: prod.name,
      mrp: parseFloat(prod.mrpDecimal) || 0,
      salePrice: parseFloat(prod.salePriceDecimal) || 0,
      discountPercent: parseInt(prod.discountPercent) || 0,
      manufacturer: prod.manufacturer || 'Unknown',
      moleculeName: prod.moleculeName || 'Unknown',
      stripQty: prod.measurementUnit || '1 Unit',
      substitute: null
    };

    // Extract cheaper generic substitute if PharmEasy has one in the metadata
    const sub = prod.productSubstitutionAttributes?.substituteProduct;
    if (sub) {
      result.substitute = {
        name: sub.name,
        mrp: parseFloat(sub.mrpDecimal) || 0,
        salePrice: parseFloat(sub.salePriceDecimal) || 0,
        discountPercent: parseInt(sub.discountPercent) || 0,
        manufacturer: sub.manufacturer || 'Unknown',
        stripQty: sub.measurementUnit || '1 Unit'
      };
    }

    return result;
  } catch (err) {
    console.error(`[SearchService] Error fetching from PharmEasy: ${err.message}`);
    return null;
  }
}

module.exports = {
  fetchLiveMedicineData
};
