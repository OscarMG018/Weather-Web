// Script to enrich city.list.json with local names and rewrite the file

const fs = require('fs');
const https = require('https');

class CityListEnricher {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.inputFile = options.inputFile || './city.list.json';
    this.outputFile = options.outputFile || './city.list.enriched.json';
    this.backupFile = options.backupFile || './city.list.backup.json';
    this.delay = options.delay || 100; // ms between requests
    this.batchSize = options.batchSize || 50; // Process in batches
    this.targetCountries = options.countries || ['US', 'ES', 'FR', 'GB', 'DE', 'IT', 'CA', 'MX', 'AR', 'BR'];
    this.maxRetries = 3;
    
    // Progress tracking
    this.processed = 0;
    this.enriched = 0;
    this.errors = [];
    this.totalCities = 0;
    this.startTime = Date.now();
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Load and filter the city list
  loadAndFilterCityList() {
    console.log(`Loading city list from ${this.inputFile}...`);
    
    try {
      const data = fs.readFileSync(this.inputFile, 'utf8');
      const allCities = JSON.parse(data);
      
      console.log(`Loaded ${allCities.length} cities from file`);
      
      // Filter by target countries
      const filteredCities = allCities.filter(city => 
        this.targetCountries.includes(city.country)
      );
      
      console.log(`Filtered to ${filteredCities.length} cities in target countries:`, this.targetCountries);
      
      // Transform to our format
      const transformedCities = filteredCities.map(city => ({
        id: city.id,
        name: city.name,
        country: city.country,
        state: city.state || null,
        coord: {
          lat: city.coord.lat,
          lon: city.coord.lon
        },
        // Initialize local_names as empty - will be filled by API
        local_names: null,
        enrichment_status: 'pending'
      }));
      
      this.totalCities = transformedCities.length;
      console.log(`Ready to process ${this.totalCities} cities`);
      
      return transformedCities;
      
    } catch (error) {
      console.error('Error loading city list:', error.message);
      process.exit(1);
    }
  }

  // Make API request with retries
  async makeAPIRequest(lat, lon, retryCount = 0) {
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`;
    
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        let data = '';
        
        response.on('data', chunk => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            if (response.statusCode === 200) {
              const result = JSON.parse(data);
              resolve(result);
            } else if (response.statusCode === 429 && retryCount < this.maxRetries) {
              // Rate limited, wait and retry
              console.log(`Rate limited, waiting ${2000 * (retryCount + 1)}ms...`);
              setTimeout(() => {
                this.makeAPIRequest(lat, lon, retryCount + 1)
                  .then(resolve)
                  .catch(reject);
              }, 2000 * (retryCount + 1));
            } else {
              reject(new Error(`HTTP ${response.statusCode}: ${data}`));
            }
          } catch (parseError) {
            reject(new Error(`Parse error: ${parseError.message}`));
          }
        });
      });
      
      request.on('error', (error) => {
        if (retryCount < this.maxRetries) {
          setTimeout(() => {
            this.makeAPIRequest(lat, lon, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 1000 * (retryCount + 1));
        } else {
          reject(error);
        }
      });
      
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  // Enrich a single city with local names
  async enrichCity(city) {
    try {
      const result = await this.makeAPIRequest(city.coord.lat, city.coord.lon);
      
      if (result && result.length > 0) {
        const apiCity = result[0];
        
        // Extract local names
        const localNames = {
          en: apiCity.local_names?.en || apiCity.name,
          es: apiCity.local_names?.es || apiCity.name,
          fr: apiCity.local_names?.fr || apiCity.name,
          // Include original API name for reference
          original: apiCity.name
        };
        
        // Also include all available languages
        if (apiCity.local_names) {
          localNames.all_languages = apiCity.local_names;
        }
        
        return {
          ...city,
          local_names: localNames,
          enrichment_status: 'success',
          api_verification: {
            api_name: apiCity.name,
            api_country: apiCity.country,
            api_state: apiCity.state,
            matches_original: apiCity.name === city.name
          }
        };
      } else {
        return {
          ...city,
          local_names: {
            en: city.name,
            es: city.name,
            fr: city.name,
            original: city.name
          },
          enrichment_status: 'no_results'
        };
      }
      
    } catch (error) {
      this.errors.push({
        city: city.name,
        country: city.country,
        coordinates: `${city.coord.lat},${city.coord.lon}`,
        error: error.message
      });
      
      return {
        ...city,
        local_names: {
          en: city.name,
          es: city.name,
          fr: city.name,
          original: city.name
        },
        enrichment_status: 'error',
        error: error.message
      };
    }
  }

  // Process cities in batches
  async processBatch(cities, batchIndex) {
    console.log(`\nProcessing batch ${batchIndex + 1} (${cities.length} cities)...`);
    
    const enrichedBatch = [];
    
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      
      // Add delay between requests
      if (i > 0) {
        await this.sleep(this.delay);
      }
      
      const enrichedCity = await this.enrichCity(city);
      enrichedBatch.push(enrichedCity);
      
      this.processed++;
      if (enrichedCity.enrichment_status === 'success') {
        this.enriched++;
      }
      
      // Progress update
      if (this.processed % 10 === 0) {
        const elapsed = Date.now() - this.startTime;
        const rate = this.processed / (elapsed / 1000);
        const eta = (this.totalCities - this.processed) / rate;
        
        console.log(`Progress: ${this.processed}/${this.totalCities} (${(this.processed/this.totalCities*100).toFixed(1)}%) | Rate: ${rate.toFixed(1)}/s | ETA: ${Math.round(eta/60)}min | Enriched: ${this.enriched}`);
      }
    }
    
    return enrichedBatch;
  }

  // Save progress periodically
  saveProgress(enrichedCities, isComplete = false) {
    const progressFile = isComplete ? this.outputFile : `${this.outputFile}.progress`;
    
    const output = {
      meta: {
        generated: new Date().toISOString(),
        source: "OpenWeatherMap city.list.json + Geocoding API",
        countries: this.targetCountries,
        total_cities: enrichedCities.length,
        enriched_cities: this.enriched,
        processing_errors: this.errors.length,
        status: isComplete ? 'complete' : 'in_progress',
        processing_time_ms: Date.now() - this.startTime
      },
      errors: this.errors,
      cities: enrichedCities
    };
    
    try {
      fs.writeFileSync(progressFile, JSON.stringify(output, null, 2));
      console.log(`${isComplete ? 'Final result' : 'Progress'} saved to ${progressFile}`);
    } catch (error) {
      console.error('Error saving progress:', error.message);
    }
  }

  // Create backup of original file
  createBackup() {
    try {
      fs.copyFileSync(this.inputFile, this.backupFile);
      console.log(`Backup created: ${this.backupFile}`);
    } catch (error) {
      console.error('Error creating backup:', error.message);
    }
  }

  // Main processing function
  async processAllCities() {
    console.log('=== City List Enrichment Process ===\n');
    
    // Load and filter cities
    const cities = this.loadAndFilterCityList();
    
    // Create backup
    this.createBackup();
    
    console.log(`\nStarting enrichment process:`);
    console.log(`- Total cities: ${this.totalCities}`);
    console.log(`- Batch size: ${this.batchSize}`);
    console.log(`- Delay between requests: ${this.delay}ms`);
    console.log(`- Target countries: ${this.targetCountries.join(', ')}\n`);
    
    const allEnrichedCities = [];
    
    // Process in batches
    for (let i = 0; i < cities.length; i += this.batchSize) {
      const batch = cities.slice(i, i + this.batchSize);
      const batchIndex = Math.floor(i / this.batchSize);
      
      const enrichedBatch = await this.processBatch(batch, batchIndex);
      allEnrichedCities.push(...enrichedBatch);
      
      // Save progress every few batches
      if ((batchIndex + 1) % 5 === 0) {
        this.saveProgress(allEnrichedCities);
      }
      
      // Add delay between batches
      if (i + this.batchSize < cities.length) {
        console.log(`Batch complete. Waiting ${this.delay * 2}ms before next batch...`);
        await this.sleep(this.delay * 2);
      }
    }
    
    // Final save
    this.saveProgress(allEnrichedCities, true);
    
    // Print summary
    this.printSummary(allEnrichedCities);
    
    return allEnrichedCities;
  }

  // Print processing summary
  printSummary(enrichedCities) {
    const totalTime = Date.now() - this.startTime;
    const successfulEnrichments = enrichedCities.filter(c => c.enrichment_status === 'success').length;
    const errorCount = this.errors.length;
    
    console.log('\n=== PROCESSING COMPLETE ===');
    console.log(`Total cities processed: ${this.processed}`);
    console.log(`Successfully enriched: ${successfulEnrichments} (${(successfulEnrichments/this.processed*100).toFixed(1)}%)`);
    console.log(`Errors: ${errorCount} (${(errorCount/this.processed*100).toFixed(1)}%)`);
    console.log(`Processing time: ${Math.round(totalTime/1000)}s (${(this.processed/(totalTime/1000)).toFixed(1)} cities/sec)`);
    console.log(`Output file: ${this.outputFile}`);
    console.log(`Backup file: ${this.backupFile}`);
    
    if (errorCount > 0) {
      console.log('\nTop errors:');
      const errorGroups = {};
      this.errors.forEach(err => {
        errorGroups[err.error] = (errorGroups[err.error] || 0) + 1;
      });
      
      Object.entries(errorGroups)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([error, count]) => {
          console.log(`  ${error}: ${count} occurrences`);
        });
    }
    
    // Sample of enriched cities
    const samplesWithTranslations = enrichedCities
      .filter(c => c.enrichment_status === 'success' && 
                  (c.local_names.en !== c.local_names.es || c.local_names.en !== c.local_names.fr))
      .slice(0, 5);
    
    if (samplesWithTranslations.length > 0) {
      console.log('\nSample cities with translations:');
      samplesWithTranslations.forEach(city => {
        console.log(`  ${city.name} (${city.country}): EN="${city.local_names.en}" ES="${city.local_names.es}" FR="${city.local_names.fr}"`);
      });
    }
  }

  // Create search function for the enriched data
  static createSearchFunction(enrichedData) {
    return function searchCities(query, language = 'en', limit = 10) {
      const queryLower = query.toLowerCase();
      const results = [];
      
      enrichedData.cities.forEach(city => {
        if (city.local_names) {
          const searchFields = [
            city.local_names.en?.toLowerCase(),
            city.local_names.es?.toLowerCase(), 
            city.local_names.fr?.toLowerCase(),
            city.name.toLowerCase()
          ].filter(Boolean);
          
          if (searchFields.some(field => field.includes(queryLower))) {
            results.push({
              name: city.local_names[language] || city.name,
              displayName: `${city.local_names[language] || city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`,
              lat: city.coord.lat,
              lon: city.coord.lon,
              country: city.country,
              state: city.state,
              allNames: city.local_names,
              originalId: city.id
            });
          }
        }
      });
      
      return results
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, limit);
    };
  }
}

// Usage
async function main() {
  const apiKey = process.env.OPEN_WEATHER_API_KEY || "ca5895d89786f2aca9210e73dd8ba85c";
  console.log(apiKey);
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
    console.error("Please set OPENWEATHER_API_KEY environment variable or update the apiKey in the script");
    process.exit(1);
  }
  
  const enricher = new CityListEnricher(apiKey, {
    inputFile: './city.list.json',
    outputFile: './cities_enriched.json',
    backupFile: './city.list.backup.json',
    delay: 1000,
    batchSize: 60,
    countries: ['US', 'ES', 'FR', 'GB', 'DE', 'IT', 'CA', 'MX', 'AR', 'BR', 'JP', 'AU', 'IN', 'CN']
  });
  
  try {
    const enrichedCities = await enricher.processAllCities();
    
    // Test the search functionality
    console.log('\n=== Testing Search Functionality ===');
    const enrichedData = JSON.parse(fs.readFileSync('./cities_enriched.json', 'utf8'));
    const search = CityListEnricher.createSearchFunction(enrichedData);
    
    // Test searches
    const testQueries = ['madrid', 'paris', 'tokyo', 'new york', 'barcelon'];
    testQueries.forEach(query => {
      const results = search(query, 'en', 3);
      console.log(`\nSearch "${query}":`, results);
    });
    
  } catch (error) {
    console.error('Error during processing:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = CityListEnricher;