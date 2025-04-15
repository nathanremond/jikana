import "../styles/global.css";
import { AuthProvider } from "../context/AuthContext";

import Header from "../layout/header";
import Footer from "../layout/footer";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
