// setupTests.ts
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function TestingProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: TestingProvider, ...options });

export * from "@testing-library/react";
export { customRender as render };
