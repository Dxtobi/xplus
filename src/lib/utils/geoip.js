export const geoip = {
  async lookup(ip) {
    try {
      // You can use services like:
      // - MaxMind GeoIP2
      // - ipapi.co
      // - ip-api.com
      // - ipinfo.io
      
      // Example with ip-api.com (free tier)
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          country: data.country,
          city: data.city,
          region: data.regionName,
          countryCode: data.countryCode
        };
      }
      
      return null;
    } catch (error) {
      console.error('GeoIP lookup error:', error);
      return null;
    }
  }
};
