import { Suspense } from "react";
import AppRoutes from "./routes";

function App({ tempoRoutes = [] }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppRoutes tempoRoutes={tempoRoutes} />
    </Suspense>
  );
}

export default App;
