import "../styles/global.css";

import Header from "../layout/header";
import Footer from "../layout/footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
