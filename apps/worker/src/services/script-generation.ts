import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ScriptSchema = z.object({
  title: z.string(),
  scenes: z.array(z.object({
    id: z.string(),
    text: z.string(),
    duration: z.number(),
    visualDescription: z.string(),
    timestamp: z.object({
      start: z.number(),
      end: z.number(),
    }),
  })),
  totalDuration: z.number(),
  metadata: z.object({
    niche: z.string(),
    tone: z.string(),
    targetAudience: z.string(),
  }),
})

export type Script = z.infer<typeof ScriptSchema>

interface ScriptGenerationParams {
  prompt?: string
  niche: string
  template: string
}

export class ScriptGenerationService {
  async generateScript(params: ScriptGenerationParams): Promise<Script> {
    const { prompt, niche, template } = params
    
    // Template-specific prompts
    const templatePrompts = {
      'tiktok-vertical': 'Create a viral, engaging short-form video script for TikTok. Focus on hooks, quick pacing, and trending elements.',
      'youtube-horizontal': 'Create an informative and engaging script for YouTube. Include clear sections and maintain viewer interest.',
      'instagram-square': 'Create a visually appealing script perfect for Instagram. Focus on aesthetics and engagement.',
    }

    const systemPrompt = `You are an expert content creator specializing in ${niche} content. Create an engaging video script that will perform well on social media.

Template: ${template}
Template guidance: ${templatePrompts[template as keyof typeof templatePrompts] || 'Create engaging content'}

Requirements:
- Scripts should be 30-90 seconds long
- Each scene should be 3-8 seconds
- Include engaging hooks in the first 3 seconds
- Provide visual descriptions for each scene
- Make content shareable and memorable
- Target audience: Gen Z and Millennials interested in ${niche}

Return a JSON object with the exact structure specified.`

    const userPrompt = prompt || `Create an engaging ${niche} video script that will go viral. Make it informative, entertaining, and shareable.`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content generated')
      }

      const parsedScript = JSON.parse(content)
      
      // Validate and return typed script
      return ScriptSchema.parse(parsedScript)
    } catch (error) {
      console.error('Script generation failed:', error)
      
      // Fallback script for demo purposes
      return {
        title: 'Sample Video Title',
        scenes: [
          {
            id: '1',
            text: 'Welcome to this amazing video!',
            duration: 3,
            visualDescription: 'Animated text overlay on colorful background',
            timestamp: { start: 0, end: 3 },
          },
          {
            id: '2', 
            text: 'Here are some incredible facts you need to know.',
            duration: 4,
            visualDescription: 'Dynamic graphics showing facts and figures',
            timestamp: { start: 3, end: 7 },
          },
          {
            id: '3',
            text: 'Thanks for watching! Like and subscribe for more.',
            duration: 3,
            visualDescription: 'Call-to-action animation with subscribe button',
            timestamp: { start: 7, end: 10 },
          },
        ],
        totalDuration: 10,
        metadata: {
          niche: params.niche,
          tone: 'engaging',
          targetAudience: 'Gen Z and Millennials',
        },
      }
    }
  }
}