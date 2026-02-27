import React from 'react';
import { ProductGoalCanvas } from './components/ProductGoalCanvas';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto py-4 px-6">
          <h1 className="text-xl font-semibold text-gray-900">Product Goal Canvas Builder</h1>
        </div>
      </header>
      <main className="py-8">
        <ProductGoalCanvas />
      </main>
    </div>
  );
}

export default App;