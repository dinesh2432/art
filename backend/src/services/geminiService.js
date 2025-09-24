const { GoogleGenerativeAI } = require('@google/generative-ai')

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not provided. AI features will be disabled.')
      this.genAI = null
      return
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async generateProductDescription(productData) {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized')
    }

    try {
      const prompt = `
        Generate a compelling product description for a handmade product with the following details:
        
        Product Name: ${productData.name}
        Category: ${productData.category}
        Materials: ${productData.materials || 'Not specified'}
        Dimensions: ${productData.dimensions || 'Not specified'}
        Artisan: ${productData.artisan || 'Not specified'}
        
        Make it engaging, highlight the craftsmanship, uniqueness, and quality. Keep it between 100-200 words.
        Focus on the handmade aspect and traditional techniques.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate product description')
    }
  }

  async generateSellerProfile(sellerData) {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized')
    }

    try {
      const prompt = `
        Generate a professional artisan profile description based on:
        
        Name: ${sellerData.name}
        Craft: ${sellerData.productType}
        Experience: ${sellerData.experience}
        Location: ${sellerData.location || 'India'}
        
        Create a warm, authentic profile that highlights their expertise, passion for their craft,
        and commitment to quality. Keep it between 80-120 words.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate seller profile')
    }
  }

  async suggestCollaborations(sellerProfile, requirement) {
    if (!this.genAI) {
      return {
        suggestions: [],
        reasoning: 'AI service not available'
      }
    }

    try {
      const prompt = `
        A ${sellerProfile.craft} artisan needs collaboration for: "${requirement}"
        
        Suggest 3 types of artisans/skills that would complement this requirement.
        Provide reasoning for each suggestion.
        
        Format as JSON:
        {
          "suggestions": [
            {
              "skill": "skill name",
              "reason": "why this collaboration would be beneficial"
            }
          ]
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        return JSON.parse(text)
      } catch {
        // If JSON parsing fails, return a basic structure
        return {
          suggestions: [
            {
              skill: "General Artisan",
              reason: "Could provide complementary skills for your requirement"
            }
          ],
          reasoning: text
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      return {
        suggestions: [],
        reasoning: 'Failed to generate suggestions'
      }
    }
  }

  async generateProductTags(productData) {
    if (!this.genAI) {
      return []
    }

    try {
      const prompt = `
        Generate relevant tags for this handmade product:
        
        Name: ${productData.name}
        Description: ${productData.description}
        Category: ${productData.category}
        
        Provide 8-12 relevant tags that customers might search for.
        Include material, style, use case, and technique tags.
        Return as comma-separated values.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const tags = response.text().split(',').map(tag => tag.trim())
      
      return tags.slice(0, 12) // Limit to 12 tags
    } catch (error) {
      console.error('Gemini API error:', error)
      return []
    }
  }

  async moderateContent(content) {
    if (!this.genAI) {
      return { isAppropriate: true, reason: 'Moderation not available' }
    }

    try {
      const prompt = `
        Analyze this content for appropriateness in a handmade marketplace:
        
        "${content}"
        
        Check for:
        - Inappropriate language
        - Spam or promotional content
        - Misleading claims
        - Offensive material
        
        Respond with JSON:
        {
          "isAppropriate": boolean,
          "reason": "explanation if inappropriate"
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      try {
        return JSON.parse(text)
      } catch {
        return { isAppropriate: true, reason: 'Could not analyze content' }
      }
    } catch (error) {
      console.error('Content moderation error:', error)
      return { isAppropriate: true, reason: 'Moderation service unavailable' }
    }
  }
}

module.exports = new GeminiService()
