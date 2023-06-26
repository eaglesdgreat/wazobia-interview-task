import App from "App";
import EmbedContent from "pages/EmbedContent"
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/embed-content/:type",
    element: <EmbedContent />,
  }
]);

export default router;