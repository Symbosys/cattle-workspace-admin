import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLayout } from "./components/layout/AdminLayout";
import { CategoryPage } from "./pages/animal/CategoryPage";
import { SubCategoryPage } from "./pages/animal/SubCategoryPage";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";

const queryClient = new QueryClient();

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Navigate to="/animal/category" replace />} />
              <Route path="animal/category" element={<CategoryPage />} />
              <Route path="animal/subcategory" element={<SubCategoryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
