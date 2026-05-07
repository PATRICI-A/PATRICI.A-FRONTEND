import { Toaster } from 'sonner';

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          PATRICI.A
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Repositorio frontend configurado y listo para desarrollo.
        </p>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
