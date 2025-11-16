// Next.js серверийн хүсэлтийн төрлийг импортлох
import { NextRequest } from 'next/server'
// Google Gemini AI-н санг импортлох
import { GoogleGenerativeAI } from '@google/generative-ai'

// API түлхүүр байгаа эсэхийг шалгаж консолд хэвлэх
console.log('🔑 Gemini API Key exists:', !!process.env.GEMINI_API_KEY)
// API түлхүүрийн уртыг консолд хэвлэх
console.log('🔑 API Key length:', process.env.GEMINI_API_KEY?.length || 0)

// Gemini AI клиент үүсгэх (орчны хувьсагчаас API түлхүүр авах)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Клиент амжилттай эхэлсэн тухай консолд хэвлэх
// Клиент амжилттай эхэлсэн тухай консолд хэвлэх
console.log('✅ Gemini client initialized successfully')

// POST хүсэлтийг боловсруулах асинхрон функц экспортлох
export async function POST(req: NextRequest) {
  // Алдаа барих блок эхлүүлэх
  try {
    // API руу хүсэлт ирсэн тухай консолд хэвлэх
    console.log('📨 Received POST request to /api/chat')
    // Хүсэлтийн биеэс мессежүүдийг салгаж авах
    const { messages } = await req.json()
    // Хэдэн мессеж ирснийг консолд хэвлэх
    console.log('💬 Messages received:', messages.length, 'messages')

    // OpenAI форматаас Gemini формат руу хөрвүүлэх тайлбар
    // Convert OpenAI format to Gemini format
    // Түүхийг бүтээх: сүүлийн мессежээс бусад бүх мессежийг Gemini форматруу хөрвүүлэх
    const history = messages.slice(0, -1).map((msg: any) => ({
      // Дүрийг тохируулах: 'assistant' бол 'model', үгүй бол 'user'
      role: msg.role === 'assistant' ? 'model' : 'user',
      // Мессежийн агуулгыг хэсгүүд болгон хувиргах
      parts: [{ text: msg.content }],
    }))
    
    // Хамгийн сүүлийн мессежийн агуулгыг авах
    const lastMessage = messages[messages.length - 1].content

    // Gemini stream үүсгэж байгаа тухай консолд хэвлэх
    console.log('🚀 Creating Gemini stream...')
    // Gemini загварыг авах (gemini-2.0-flash-lite загвар ашиглах)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite', 
      // Системийн зааврыг тохируулах - зөвхөн монголоор хариулах
      systemInstruction: 'You could give physchological advice. Answer only in Mongolian language. Provide professional, respectful responses to users no matter what issue they bring up.'
    })
    // Түүхтэй чат эхлүүлэх
    const chat = model.startChat({ history })
    // Сүүлийн мессежийг илгээж, урсгалт хариу авах
    const result = await chat.sendMessageStream(lastMessage)
    // Stream амжилттай үүссэн тухай консолд хэвлэх
    // Stream амжилттай үүссэн тухай консолд хэвлэх
    console.log('✅ Gemini stream created successfully')

    // Текстийг кодлох encoder үүсгэх
    const encoder = new TextEncoder()
    
    // Token usage tracking
    let promptTokens = 0
    let completionTokens = 0

    // Унших боломжтой урсгал үүсгэх
    const readableStream = new ReadableStream({
      // Урсгалыг эхлүүлэх асинхрон функц
      async start(controller) {
        // Алдаа барих блок эхлүүлэх
        try {
          // Хариу урсгаж эхэлж байгаа тухай консолд хэвлэх
          console.log('📡 Starting to stream response...')
          // Урсгалын бүх хэсгийг давтах
          for await (const chunk of result.stream) {
            // Хэсгийн текстийг авах
            const text = chunk.text()
            
            // Token usage хэрэв байвал авах
            if (chunk.usageMetadata) {
              promptTokens = chunk.usageMetadata.promptTokenCount || 0
              completionTokens = chunk.usageMetadata.candidatesTokenCount || 0
            }
            
            // Server-Sent Events форматаар өгөгдөл бэлтгэх
            const data = `data: ${JSON.stringify({ 
              // Сонголтын массив
              choices: [{ 
                // Өөрчлөлтийн объект
                delta: { content: text } 
              }] 
            })}\n\n`
            // Кодлогдсон өгөгдлийг дараалалд нэмэх
            controller.enqueue(encoder.encode(data))
          }
          
          // Token usage мэдээллийг илгээх
          const totalTokens = promptTokens + completionTokens
          console.log('📊 Token usage:', { promptTokens, completionTokens, totalTokens })
          
          const tokenData = `data: ${JSON.stringify({ 
            tokenUsage: { 
              promptTokens, 
              completionTokens, 
              totalTokens 
            } 
          })}\n\n`
          controller.enqueue(encoder.encode(tokenData))
          
          // Урсгал амжилттай дууссан тухай консолд хэвлэх
          console.log('✅ Stream completed successfully')
          // Дууссан дохио илгээх
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          // Урсгалыг хаах
          controller.close()
        } catch (error) {
          // Урсгалын алдааг консолд хэвлэх
          console.error('❌ Stream error:', error)
          // Урсгалын алдааг буцаах
          controller.error(error)
        }
      },
    })

    // Урсгалтай Response буцаах
    return new Response(readableStream, {
      // HTTP толгойн мэдээлэл тохируулах
      headers: {
        // Агуулгын төрөл: Server-Sent Events
        'Content-Type': 'text/event-stream',
        // Кэш хадгалахгүй байх
        'Cache-Control': 'no-cache',
        // Холболтыг идэвхтэй байлгах
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    // API алдааг консолд хэвлэх
    console.error('❌ API Error:', error)
    // Алдааны мессежийг консолд хэвлэх
    console.error('❌ Error message:', error.message)
    // Алдааны stack trace-ийг консолд хэвлэх
    console.error('❌ Error stack:', error.stack)
    // Алдааны хариуг JSON форматаар буцаах
    return new Response(
      // Алдааны мессежийг JSON болгох (эсвэл ерөнхий мессеж)
      JSON.stringify({ error: error.message || 'An error occurred' }),
      // Статус код 500 (Серверийн алдаа), агуулгын төрөл JSON
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

