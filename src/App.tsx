import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { PathwayFinanceProvider } from '@/context/PathwayFinanceContext';

function App() {
  return (
    <PathwayFinanceProvider>
      <RouterProvider router={router} />
    </PathwayFinanceProvider>
  );
}

export default App;
