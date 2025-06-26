export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Dify
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dify Console</h2>
            <p className="text-gray-600 mb-4">
              Build and manage your AI applications
            </p>
            <a 
              href="/console" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Open Console
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">AlphaMind</h2>
            <p className="text-gray-600 mb-4">
              Advanced AI agent management and automation
            </p>
            <a 
              href="/alphamind" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Open AlphaMind
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">n8n Workflows</h2>
            <p className="text-gray-600 mb-4">
              Automate workflows and integrations
            </p>
            <a 
              href="/n8n" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Open n8n
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

